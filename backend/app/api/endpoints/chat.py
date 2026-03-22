"""
AI Chat Endpoint — POST /api/chat

Streaming SSE response supporting two modes:
  - Quick mode:    token-by-token streaming via litellm (conversational questions)
  - Analysis mode: step progress + final result via 3-agent CrewAI pipeline

Conversation memory is supported by passing a `history` array in the request.
"""
import os
import re
import uuid
import json
import asyncio
import traceback
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Literal, Optional
from database.supabase_client import require_auth, get_supabase_client, insert_record
from dotenv import load_dotenv

load_dotenv()

# Provider config is validated at import time in ai_engine.provider
from ai_engine.provider import get_litellm_params

router = APIRouter(prefix="/api", tags=["Chat"])

# Keywords that trigger the full CrewAI analysis pipeline
ANALYSIS_KEYWORDS = re.compile(
    r"\b(analyze|analyse|forecast|predict|trend|report|compare|benchmark|"
    r"revenue|growth|insight|recommendation|strategic|sarimax)\b",
    re.IGNORECASE,
)


class HistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=8000)


class ChatRequest(BaseModel):
    message: str
    dataset_id: Optional[str] = None
    history: Optional[list[HistoryItem]] = Field(default_factory=list, max_length=50)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _sse(data: dict) -> str:
    """Format a dict as an SSE data line."""
    return f"data: {json.dumps(data)}\n\n"


def _is_analysis_request(message: str, dataset_id: Optional[str]) -> bool:
    return bool(ANALYSIS_KEYWORDS.search(message)) and dataset_id is not None


def _format_analysis_text(data: dict) -> str:
    """Convert analysis result dict into markdown-formatted text."""
    parts = []

    forecast = data.get("forecast", [])
    if forecast:
        parts.append("**Forecast Summary:**")
        for f in forecast[:3]:
            date = f.get("date", "N/A")
            value = float(f.get("revenue", f.get("forecasted_value", 0)) or 0)
            lower = f.get("conf_lower")
            upper = f.get("conf_upper")
            if lower is not None and upper is not None:
                parts.append(f"- {date}: **${value:,.2f}** *(range: ${float(lower):,.2f} – ${float(upper):,.2f})*")
            else:
                parts.append(f"- {date}: **${value:,.2f}**")

    advice = data.get("strategic_advice", [])
    if advice:
        parts.append("\n**Strategic Recommendations:**")
        if isinstance(advice, list):
            for a in advice[:3]:
                if isinstance(a, dict):
                    parts.append(f"- **{a.get('title', '')}**: {a.get('body', a.get('description', ''))}")
                else:
                    parts.append(f"- {a}")
        elif isinstance(advice, str):
            parts.append(advice)

    return "\n".join(parts) if parts else "Analysis complete. No significant patterns found in the current dataset."


async def _build_dataset_context(user_id: str, dataset_id: str) -> str:
    """Load file metadata and sample rows for quick response context."""
    try:
        client = get_supabase_client()
        dataset = (
            client.table("uploaded_files")
            .select("filename, file_type, uploaded_at")
            .eq("id", dataset_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not dataset.data:
            return ""
        d = dataset.data[0]
        context = f"\n\nThe user has a dataset loaded: {d.get('filename', 'unknown')} ({d.get('file_type', '')})."

        rows = (
            client.table("data_rows")
            .select("data")
            .eq("dataset_id", dataset_id)
            .order("row_index")
            .limit(10)
            .execute()
        )
        if rows.data:
            sample = [r["data"] for r in rows.data]
            columns = list(sample[0].keys()) if sample else []
            context += f"\n\nDataset columns: {', '.join(columns)}"
            context += f"\nSample data:\n{json.dumps(sample, indent=2, default=str)}"
            context += "\n\nUse this data to answer the user's question. Be specific with numbers from the data."
        return context
    except Exception:
        return ""


# ── Streaming generators ──────────────────────────────────────────────────────

async def _stream_quick_response(
    message: str,
    user_id: str,
    dataset_id: Optional[str],
    history: list[dict],
):
    """Stream quick conversational response token by token."""
    try:
        from cache.cache_manager import get_cached_chat, set_cached_chat

        # Only cache stateless requests — skip when history is present (context-dependent)
        use_cache = not history
        if use_cache:
            cached = get_cached_chat(message, user_id, dataset_id)
            if cached is not None:
                yield _sse({"type": "token", "content": cached})
                yield _sse({"type": "done", "message_id": str(uuid.uuid4()), "cached": True})
                return

        import litellm

        # Get provider-specific params (model, api_key, api_base, api_version)
        llm_params = get_litellm_params()

        system_prompt = (
            "You are Ascendly AI, a helpful financial analytics assistant for startups. "
            "You help users understand their business data, answer questions about analytics, "
            "and guide them on using the platform. Be concise, friendly, and professional. "
            "If the user asks for deep analysis, forecasting, or specific data insights, "
            "suggest they upload a dataset and ask for an analysis."
        )

        context = await _build_dataset_context(user_id, dataset_id) if dataset_id else ""

        # Validate history roles and limit to last 10 exchanges
        valid_roles = {"user", "assistant"}
        safe_history = [
            {"role": h["role"], "content": h["content"]}
            for h in history[-10:]
            if h.get("role") in valid_roles and h.get("content")
        ]

        messages = [
            {"role": "system", "content": system_prompt + context},
            *safe_history,
            {"role": "user", "content": message},
        ]

        response = await litellm.acompletion(
            messages=messages,
            max_tokens=512,
            stream=True,
            **llm_params,
        )

        full_text = ""
        async for chunk in response:
            token = chunk.choices[0].delta.content or ""
            if token:
                full_text += token
                yield _sse({"type": "token", "content": token})

        message_id = str(uuid.uuid4())
        if use_cache:
            set_cached_chat(message, user_id, dataset_id, full_text)
        yield _sse({"type": "done", "message_id": message_id})

        # Log after stream completes
        try:
            insert_record("ai_logs", {
                "user_id": user_id,
                "request_id": message_id,
                "agent_name": "chat-quick",
                "tool_output": message,
                "final_answer": full_text[:1000],
            })
        except Exception:
            pass

    except Exception as e:
        print(f"[chat] _stream_quick_response error: {e}")
        yield _sse({"type": "error", "content": "I'm having trouble processing your request right now. Please try again."})


async def _stream_c1_response(data: dict, message: str, dataset_name: str, message_id: str):
    """
    Call the Thesys C1 API with structured analysis data and stream the result.

    Yields c1_chunk / c1_done SSE events.
    Each chunk content is base64-encoded to prevent newlines from breaking SSE framing.
    Falls back to yielding a plain 'result' event if THESYS_API_KEY is not set.
    message_id is passed in (not generated here) so all events share the same ID.
    """
    import base64
    import os as _os

    if not _os.environ.get("THESYS_API_KEY"):
        # Graceful fallback — no C1 key configured
        text = _format_analysis_text(data)
        yield _sse({"type": "result", "text": text, "message_id": message_id})
        return

    try:
        from ai_engine.c1_client import get_c1_client, ASCENDLY_C1_SYSTEM_PROMPT, C1_METADATA, C1_MODEL

        client = get_c1_client()

        # Filter out raw historical array to keep prompt size manageable
        # and avoid sending large portions of user data to Thesys
        filtered_data = {k: v for k, v in data.items() if k != "historical"}
        if "historical" in data and isinstance(data.get("historical"), list):
            filtered_data["historical_count"] = len(data["historical"])

        system_content = ASCENDLY_C1_SYSTEM_PROMPT + json.dumps(filtered_data, indent=2, default=str)

        stream = await client.chat.completions.create(
            model=C1_MODEL,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": f"Dataset: {dataset_name}. {message}"},
            ],
            max_tokens=1500,
            metadata=C1_METADATA,
            stream=True,
        )

        async for chunk in stream:
            token = chunk.choices[0].delta.content or ""
            if token:
                encoded = base64.b64encode(token.encode()).decode()
                yield _sse({"type": "c1_chunk", "content": encoded, "message_id": message_id})

        yield _sse({"type": "c1_done", "message_id": message_id})

    except Exception as e:
        print(f"[chat] _stream_c1_response error: {e}")
        # Fall back to markdown on C1 failure
        text = _format_analysis_text(data)
        yield _sse({"type": "result", "text": text, "message_id": message_id})


async def _stream_analysis_response(message: str, user_id: str, dataset_id: str):
    """Stream analysis progress steps then final result via C1 or markdown fallback."""
    try:
        from ai_engine.crew import run_analyst_step, run_forecaster_step, run_strategist_step, parse_outputs

        yield _sse({"type": "progress", "step": 1, "total": 3, "label": "Analyzing your data..."})
        analyst_output = await asyncio.to_thread(run_analyst_step, dataset_id)

        yield _sse({"type": "progress", "step": 2, "total": 3, "label": "Forecasting revenue..."})
        forecast_output = await asyncio.to_thread(run_forecaster_step, analyst_output)

        yield _sse({"type": "progress", "step": 3, "total": 3, "label": "Generating recommendations..."})
        strategist_output = await asyncio.to_thread(run_strategist_step, analyst_output, forecast_output)

        result = parse_outputs(analyst_output, forecast_output, strategist_output, 0)
        data = result.get("data", {})
        message_id = str(uuid.uuid4())

        # Resolve dataset name for C1 context
        dataset_name = "your dataset"
        try:
            client = get_supabase_client()
            row = client.table("uploaded_files").select("filename").eq("id", dataset_id).execute()
            if row.data:
                dataset_name = row.data[0].get("filename", dataset_name)
        except Exception:
            pass

        # Persist insights
        try:
            insert_record("ai_insights", {
                "dataset_id": dataset_id,
                "user_id": user_id,
                "insight_type": "analysis",
                "title": f"Analysis: {message[:100]}",
                "content": json.dumps(data),
                "metadata": json.dumps(result.get("metadata", {})),
                "status": "completed",
            })
        except Exception:
            pass

        # Log interaction
        try:
            insert_record("ai_logs", {
                "user_id": user_id,
                "request_id": message_id,
                "agent_name": "chat-analysis",
                "tool_output": message,
                "final_answer": json.dumps(data)[:1000],
            })
        except Exception:
            pass

        # Stream via C1 (or fallback to markdown if key missing / C1 fails)
        # Pass the shared message_id so all events (c1_chunk, c1_done, result) use the same ID
        async for event in _stream_c1_response(data, message, dataset_name, message_id):
            yield event

        yield _sse({"type": "done", "message_id": message_id})

    except Exception as e:
        print(f"[chat] _stream_analysis_response error: {e}\n{traceback.format_exc()}")
        yield _sse({"type": "error", "content": "Analysis failed. Please ensure your dataset is properly formatted and try again."})


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user=Depends(require_auth),
):
    """
    Streaming SSE chat endpoint.
    Returns text/event-stream with token, progress, result, done, or error events.
    """
    user_id = str(current_user.id)
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Ownership check — ensure dataset belongs to this user
    if request.dataset_id:
        try:
            client = get_supabase_client()
            owned = (
                client.table("uploaded_files")
                .select("id")
                .eq("id", request.dataset_id)
                .eq("user_id", user_id)
                .execute()
            )
            if not owned.data:
                raise HTTPException(status_code=403, detail="Access to this dataset is not allowed.")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=403, detail="Access to this dataset is not allowed.")

    history = [{"role": h.role, "content": h.content} for h in (request.history or [])]
    is_analysis = _is_analysis_request(message, request.dataset_id)

    generator = (
        _stream_analysis_response(message, user_id, request.dataset_id)
        if is_analysis
        else _stream_quick_response(message, user_id, request.dataset_id, history)
    )

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
