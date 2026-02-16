"""
CrewAI Task & Crew Definitions
Runs agents one at a time with delays to respect free-tier rate limits.
"""
import json
import sys
import time
import uuid
from crewai import Task, Crew, Process
from ai_engine.agents import create_data_analyst, create_forecaster, create_strategist

# Delay between agent runs (seconds) to avoid rate limits
AGENT_DELAY = 75


def _countdown(seconds: int, label: str):
    """Display a countdown timer in the terminal."""
    for remaining in range(seconds, 0, -1):
        mins, secs = divmod(remaining, 60)
        sys.stdout.write(f"\r[Ascendly] {label} — resuming in {mins:02d}:{secs:02d} ")
        sys.stdout.flush()
        time.sleep(1)
    sys.stdout.write(f"\r[Ascendly] {label} — done! Continuing...           \n")
    sys.stdout.flush()


def _run_crew_safe(crew, task, label: str) -> str:
    """Run a crew and return the task output. If the crew fails, try to salvage tool output."""
    try:
        crew.kickoff()
        return str(task.output)
    except Exception as e:
        print(f"[Ascendly] {label} crew failed: {e}")
        # Try to salvage output — the tool may have run successfully before the LLM failed
        if task.output:
            print(f"[Ascendly] {label} — salvaged partial output from task.")
            return str(task.output)
        # Check if any tool calls produced output (stored in task tools_output or similar)
        error_msg = str(e)
        if "forecast" in error_msg.lower() or "cleaned_data" in error_msg.lower():
            return error_msg
        print(f"[Ascendly] {label} — no output to salvage. Continuing with empty result.")
        return ""


def run_analysis(file_path: str) -> dict:
    """
    Run the full AI analysis pipeline on a CSV file.
    Runs each agent separately with delays to stay within free-tier rate limits.
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())

    # === Step 1: Data Analyst ===
    print("[Ascendly] Starting Step 1/3: Data Analyst...")
    analyst = create_data_analyst()
    task_analyze = Task(
        description=f"Read CSV at '{file_path}' with csv_reader. Then run growth_calculator on the result. Return the cleaned data and metrics.",
        expected_output="JSON with 'cleaned_data' array and 'metrics' object.",
        agent=analyst,
    )

    crew1 = Crew(
        agents=[analyst],
        tasks=[task_analyze],
        process=Process.sequential,
        verbose=True,
        max_rpm=2,
    )
    analyst_output = _run_crew_safe(crew1, task_analyze, "Analyst")

    # If analyst failed completely, try running csv_reader + growth_calculator directly
    if not analyst_output:
        print("[Ascendly] Analyst agent failed. Running tools directly as fallback...")
        from ai_engine.tools.data_tools import csv_reader, growth_calculator
        try:
            csv_result = csv_reader.run(file_path)
            growth_result = growth_calculator.run(csv_result)
            analyst_output = growth_result
            print("[Ascendly] Direct tool fallback succeeded.")
        except Exception as fallback_err:
            print(f"[Ascendly] Direct tool fallback also failed: {fallback_err}")
            analyst_output = csv_result if csv_result else ""

    # Wait for rate limit to reset
    print(f"[Ascendly] Step 1 complete.")
    _countdown(AGENT_DELAY, "Rate limit cooldown (1/2)")

    # === Step 2: Forecaster ===
    print("[Ascendly] Starting Step 2/3: Forecaster...")
    forecaster = create_forecaster()
    task_forecast = Task(
        description=(
            f"Run forecast_revenue tool with this data: {analyst_output[:2000]}"
        ),
        expected_output="JSON with model_used, data_points, and forecast array.",
        agent=forecaster,
    )

    crew2 = Crew(
        agents=[forecaster],
        tasks=[task_forecast],
        process=Process.sequential,
        verbose=True,
        max_rpm=2,
    )
    forecast_output = _run_crew_safe(crew2, task_forecast, "Forecaster")

    # If forecaster failed, try running the tool directly
    if not forecast_output:
        print("[Ascendly] Forecaster agent failed. Running SARIMAX tool directly as fallback...")
        from ai_engine.tools.sarimax_tool import forecast_revenue
        try:
            # Extract just the cleaned data array from analyst output
            analyst_data = _extract_json(analyst_output)
            if isinstance(analyst_data, dict) and "cleaned_data" in analyst_data:
                tool_input = json.dumps(analyst_data["cleaned_data"])
            elif isinstance(analyst_data, dict) and "metrics" in analyst_data:
                # growth_calculator output — need the raw data, not metrics
                tool_input = analyst_output
            else:
                tool_input = analyst_output
            forecast_output = forecast_revenue.run(tool_input)
            print("[Ascendly] Direct SARIMAX fallback succeeded.")
        except Exception as fallback_err:
            print(f"[Ascendly] Direct SARIMAX fallback also failed: {fallback_err}")

    # Wait for rate limit to reset
    print(f"[Ascendly] Step 2 complete.")
    _countdown(AGENT_DELAY, "Rate limit cooldown (2/2)")

    # === Step 3: Strategist ===
    print("[Ascendly] Starting Step 3/3: Strategist...")
    strategist = create_strategist()

    # Truncate context to save tokens
    context_summary = f"Analyst: {analyst_output[:1000]}\nForecast: {forecast_output[:1000]}"

    task_advise = Task(
        description=(
            f"Based on this data, give exactly 3 recommendations as JSON array. "
            f"Each with 'title' and 'body' keys. Be direct.\n\n{context_summary}"
        ),
        expected_output='JSON array: [{"title": "...", "body": "..."}]',
        agent=strategist,
    )

    crew3 = Crew(
        agents=[strategist],
        tasks=[task_advise],
        process=Process.sequential,
        verbose=True,
        max_rpm=2,
    )
    strategist_output = _run_crew_safe(crew3, task_advise, "Strategist")

    processing_time = int((time.time() - start_time) * 1000)

    # Parse outputs into API response
    response = _parse_outputs(analyst_output, forecast_output, strategist_output, processing_time)
    response["request_id"] = request_id

    # Collect agent logs
    response["agent_logs"] = [
        {"agent_name": "Analyst", "output": analyst_output},
        {"agent_name": "Forecaster", "output": forecast_output},
        {"agent_name": "Strategist", "output": strategist_output},
    ]

    return response


def _parse_outputs(analyst_output: str, forecast_output: str, advice_output: str, processing_time: int) -> dict:
    """Parse agent outputs into API contract format."""

    historical = []
    try:
        data = _extract_json(analyst_output)
        if isinstance(data, dict) and "cleaned_data" in data:
            historical = data["cleaned_data"]
        elif isinstance(data, list):
            historical = data
    except Exception:
        pass

    forecast = []
    model_used = "SARIMAX"
    try:
        data = _extract_json(forecast_output)
        if isinstance(data, dict):
            forecast = data.get("forecast", [])
            model_used = data.get("model_used", "SARIMAX")
        elif isinstance(data, list):
            forecast = data
    except Exception:
        pass

    strategic_advice = []
    try:
        data = _extract_json(advice_output)
        if isinstance(data, list):
            strategic_advice = data
        elif isinstance(data, dict) and "advice" in data:
            strategic_advice = data["advice"]
    except Exception:
        strategic_advice = [{"title": "Analysis Complete", "body": advice_output}]

    return {
        "status": "success",
        "metadata": {
            "model_used": model_used,
            "processing_time_ms": processing_time,
        },
        "data": {
            "historical": historical,
            "forecast": forecast,
            "strategic_advice": strategic_advice,
        },
    }


def _extract_json(text: str):
    """Try to extract JSON from text that may contain extra content."""
    import re

    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass

    for pattern in [r'\[[\s\S]*\]', r'\{[\s\S]*\}']:
        match = re.search(pattern, text)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                continue

    return None
