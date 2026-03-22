"""
Benchmark Orchestrator
-----------------------
Runs the three ADK benchmark agents in parallel using ADK's ParallelAgent,
then combines and normalises their outputs into a unified benchmark list.

Usage:
    orchestrator = BenchmarkOrchestrator()
    results = orchestrator.run("industry_growth")   # sync — safe to call from CrewAI tool
    results = await orchestrator.run_async("competitor")  # async variant

Architecture (ADK ParallelAgent pattern):
    ParallelAgent("benchmark_parallel")
        ├── industry_benchmark_agent  → session.state["industry_result"]
        ├── competitor_benchmark_agent → session.state["competitor_result"]
        └── market_data_agent          → session.state["market_result"]

Each sub-agent writes its output to a unique session state key via output_key.
The orchestrator reads all three keys after the parallel run completes.
"""
import asyncio
import json
import re
import uuid

from google.adk.agents import ParallelAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from ai_engine.adk.agents import (
    make_industry_benchmark_agent,
    make_competitor_benchmark_agent,
    make_market_data_agent,
)
from observability.adk_span import benchmark_span

APP_NAME = "ascendly_benchmarks"


def _extract_json_array(text: str) -> list:
    """Extract a JSON array from agent output text (may have surrounding prose)."""
    if not text:
        return []
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass
    match = re.search(r"\[[\s\S]*\]", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return []


def _normalise_records(records: list, category: str) -> list:
    """Ensure every record has the required benchmark schema fields."""
    normalised = []
    for r in records:
        if not isinstance(r, dict):
            continue
        try:
            value = float(r.get("value", 0) or 0)
        except (ValueError, TypeError):
            value = 0.0
        normalised.append({
            "name": str(r.get("name", "Unknown")),
            "metric": str(r.get("metric", "benchmark")),
            "value": value,
            "unit": str(r.get("unit", "")),
            "period": str(r.get("period", "")),
            "source": str(r.get("source", "ADK")),
        })
    return normalised


class BenchmarkOrchestrator:
    """
    Runs the three ADK benchmark sub-agents in parallel and returns
    a combined list of normalised benchmark records.
    """

    def __init__(self):
        # Fresh agent instances each time — ADK tracks parent agent as instance
        # state, so reusing module-level singletons causes a ValidationError on
        # the second call ("already has a parent agent").
        self._parallel_agent = ParallelAgent(
            name="benchmark_parallel",
            sub_agents=[
                make_industry_benchmark_agent(),
                make_competitor_benchmark_agent(),
                make_market_data_agent(),
            ],
        )

    async def run_async(self, category: str) -> list[dict]:
        """
        Async entry point. Runs all three agents in parallel via ADK Runner.
        Returns a combined list of benchmark records.
        """
        session_service = InMemorySessionService()
        runner = Runner(
            agent=self._parallel_agent,
            app_name=APP_NAME,
            session_service=session_service,
        )

        user_id = f"benchmark_{category}"
        session_id = str(uuid.uuid4())

        await session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
        )

        message = types.Content(
            role="user",
            parts=[types.Part(text=f"Fetch benchmark data for category: {category}")],
        )

        # Drain the event stream — sub-agents write to session state via output_key
        with benchmark_span("parallel", category=category):
            async for event in runner.run_async(
                user_id=user_id,
                session_id=session_id,
                new_message=message,
            ):
                pass  # we read from session state after completion, not from events

        # Read each agent's output from session state
        session = await session_service.get_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
        )
        state = session.state if session else {}

        all_records = []
        for key in ("industry_result", "competitor_result", "market_result"):
            raw = state.get(key, "")
            records = _extract_json_array(raw)
            all_records.extend(_normalise_records(records, category))

        return all_records

    def run(self, category: str) -> list[dict]:
        """
        Sync wrapper around run_async().
        Uses asyncio.run() directly (preferred path — creates a new event loop).
        Falls back to a ThreadPoolExecutor if a loop is already running in the
        calling thread (e.g. nested asyncio contexts).
        """
        try:
            return asyncio.run(self.run_async(category))
        except RuntimeError as e:
            # Only retry in a thread if the error is due to a running event loop
            if "cannot be called from a running event loop" not in str(e):
                raise
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                future = pool.submit(lambda: asyncio.run(self.run_async(category)))
                return future.result(timeout=60)
