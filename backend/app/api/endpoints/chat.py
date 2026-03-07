"""
AI Chat Endpoint — POST /api/chat
Auto-detect mode: lightweight LLM for quick questions,
full CrewAI pipeline for analysis requests.
"""
import os
import re
import uuid
import json
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from database.supabase_client import require_auth, get_supabase_client, insert_record
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api", tags=["Chat"])

# Keywords that trigger the full CrewAI analysis pipeline
ANALYSIS_KEYWORDS = re.compile(
    r"\b(analyze|analyse|forecast|predict|trend|report|compare|benchmark|"
    r"revenue|growth|insight|recommendation|strategic|sarimax)\b",
    re.IGNORECASE,
)


class ChatRequest(BaseModel):
    message: str
    dataset_id: Optional[str] = None


def _is_analysis_request(message: str, dataset_id: Optional[str]) -> bool:
    """Determine if the message requires the full CrewAI pipeline."""
    has_keywords = bool(ANALYSIS_KEYWORDS.search(message))
    return has_keywords and dataset_id is not None


async def _quick_response(message: str, user_id: str, dataset_id: Optional[str] = None) -> str:
    """Generate a fast response using LiteLLM/Groq for conversational queries."""
    try:
        import litellm

        model = os.getenv("CREWAI_LLM_MODEL", "groq/llama-3.1-8b-instant")

        system_prompt = (
            "You are Ascendly AI, a helpful financial analytics assistant for startups. "
            "You help users understand their business data, answer questions about analytics, "
            "and guide them on using the platform. Be concise, friendly, and professional. "
            "If the user asks for deep analysis, forecasting, or specific data insights, "
            "suggest they upload a dataset and ask for an analysis."
        )

        # If dataset_id provided, load file metadata + actual sample data
        context = ""
        if dataset_id:
            try:
                client = get_supabase_client()
                # Load file metadata (filter by user_id to prevent data leakage)
                dataset = client.table("uploaded_files").select("filename, file_type, uploaded_at").eq("id", dataset_id).eq("user_id", user_id).execute()
                if dataset.data:
                    d = dataset.data[0]
                    context = f"\n\nThe user has a dataset loaded: {d.get('filename', 'unknown')} ({d.get('file_type', '')})."

                # Load actual data rows (first 10 rows for context)
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
                    context += f"\nTotal rows loaded: {len(rows.data)} (showing first rows)"
                    context += f"\nSample data:\n{json.dumps(sample, indent=2, default=str)}"
                    context += "\n\nUse this data to answer the user's question. Be specific with numbers from the data."
            except Exception:
                pass

        messages = [
            {"role": "system", "content": system_prompt + context},
            {"role": "user", "content": message},
        ]

        response = litellm.completion(model=model, messages=messages, max_tokens=512)
        return response.choices[0].message.content

    except Exception as e:
        print(f"[chat] _quick_response error: {e}")
        return "I'm having trouble processing your request right now. Please try again."


def _analysis_response_sync(message: str, user_id: str, dataset_id: Optional[str]) -> str:
    """Run the full CrewAI pipeline for deep analysis requests."""
    try:
        from ai_engine.crew import run_dataset_analysis

        result = run_dataset_analysis(dataset_id)

        if result.get("status") != "success":
            return "I encountered an issue while analyzing your data. Please try again."

        data = result.get("data", {})

        # Save insights to ai_insights table
        try:
            request_id = result.get("request_id", str(uuid.uuid4()))
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
            pass  # Don't fail if saving insights fails

        # Format response text
        parts = []

        # Forecast summary
        forecast = data.get("forecast", [])
        if forecast:
            parts.append("**Forecast Summary:**")
            for f in forecast[:3]:
                date = f.get("date", "N/A")
                value = f.get("forecasted_value", 0)
                parts.append(f"- {date}: ${value:,.2f}")

        # Strategic advice
        advice = data.get("strategic_advice", [])
        if advice:
            parts.append("\n**Strategic Recommendations:**")
            if isinstance(advice, list):
                for a in advice[:3]:
                    if isinstance(a, dict):
                        parts.append(f"- **{a.get('title', '')}**: {a.get('description', '')}")
                    else:
                        parts.append(f"- {a}")
            elif isinstance(advice, str):
                parts.append(advice)

        return "\n".join(parts) if parts else "Analysis complete. No significant patterns found in the current dataset."

    except Exception as e:
        print(f"[chat] _analysis_response error: {e}")
        return "Analysis failed. Please ensure your dataset is properly formatted and try again."


@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user=Depends(require_auth),
):
    """
    AI chat endpoint with auto-detect mode.
    - Quick questions → lightweight LLM (fast, ~2-3 sec)
    - Analysis requests with dataset_id → full CrewAI pipeline (deeper, ~2-4 min)
    """
    user_id = str(current_user.id)
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Ownership check — ensure dataset belongs to this user
    if request.dataset_id:
        try:
            client = get_supabase_client()
            owned = client.table("uploaded_files").select("id").eq("id", request.dataset_id).eq("user_id", user_id).execute()
            if not owned.data:
                raise HTTPException(status_code=403, detail="Access to this dataset is not allowed.")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=403, detail="Access to this dataset is not allowed.")

    # Auto-detect mode
    is_analysis = _is_analysis_request(message, request.dataset_id)

    if is_analysis:
        mode = "analysis"
        text = await asyncio.to_thread(_analysis_response_sync, message, user_id, request.dataset_id)
    else:
        mode = "quick"
        text = await _quick_response(message, user_id, request.dataset_id)

    # Log the interaction
    try:
        insert_record("ai_logs", {
            "user_id": user_id,
            "request_id": str(uuid.uuid4()),
            "agent_name": "chat",
            "tool_output": message,
            "final_answer": text[:1000],
        })
    except Exception:
        pass  # Don't fail if logging fails

    now = datetime.now(timezone.utc).isoformat()

    return {
        "message_id": str(uuid.uuid4()),
        "role": "assistant",
        "text": text,
        "time": now,
        "mode": mode,
    }
