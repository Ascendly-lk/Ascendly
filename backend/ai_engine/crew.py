"""
CrewAI Crew Assembly — DB-based analysis pipeline.
Used when analyzing a dataset already stored in Supabase (via dataset_id).

The CSV-based pipeline (run_analysis in tasks.py) is kept separately
for the POST /api/analyze CSV upload endpoint.
"""
import json
import os
import sys
import time
import uuid

from crewai import Agent, Task, Crew, Process, LLM

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _make_llm() -> LLM:
    return LLM(
        model=os.getenv("CREWAI_LLM_MODEL", "azure/gpt-4o"),
        api_key=os.getenv("AZURE_API_KEY"),
        endpoint=os.getenv("AZURE_ENDPOINT"),
        api_version=os.getenv("AZURE_API_VERSION"),
    )


def _run_safe(crew: Crew, task: Task, label: str) -> str:
    try:
        crew.kickoff()
        return str(task.output) if task.output else ""
    except Exception as e:
        print(f"[Ascendly] {label} failed: {e}")
        return str(task.output) if task.output else ""


def run_dataset_analysis(dataset_id: str) -> dict:
    """
    Run the full AI analysis pipeline on a dataset stored in Supabase.
    Reads data via query_dataset tool, forecasts via SARIMAX, and
    generates strategic advice with benchmark comparisons.

    Args:
        dataset_id: UUID of the dataset in the `data_rows` table.

    Returns:
        Dict with status, metadata, and data (historical, forecast, strategic_advice).
    """
    from ai_engine.tools.query_tool import query_dataset
    from ai_engine.tools.data_tools import growth_calculator
    from ai_engine.tools.sarimax_tool import forecast_revenue
    from ai_engine.tools.benchmark_tool import query_benchmarks

    start_time = time.time()
    request_id = str(uuid.uuid4())

    # === Step 1: Data Analyst — load + compute metrics ===
    print("[Ascendly] Step 1/3: Data Analyst (DB)...")
    analyst = Agent(
        role="Data Analyst",
        goal="Load the dataset and calculate performance metrics. Be concise.",
        backstory="You load financial data from a database using query_dataset, then run growth_calculator. Output only facts.",
        tools=[query_dataset, growth_calculator],
        llm=_make_llm(),
        verbose=False,
        allow_delegation=False,
        max_iter=4,
    )
    task_analyze = Task(
        description=(
            f"Use query_dataset to load dataset_id='{dataset_id}'. "
            f"Then run growth_calculator on the result. Return cleaned data and metrics."
        ),
        expected_output="JSON with 'cleaned_data' array and 'metrics' object.",
        agent=analyst,
    )
    crew1 = Crew(agents=[analyst], tasks=[task_analyze], process=Process.sequential, verbose=True)
    analyst_output = _run_safe(crew1, task_analyze, "Analyst")

    # Fallback: run tools directly if agent failed
    if not analyst_output:
        print("[Ascendly] Analyst failed — running tools directly...")
        try:
            raw = query_dataset.run(dataset_id)
            analyst_output = growth_calculator.run(raw)
        except Exception as e:
            print(f"[Ascendly] Direct fallback failed: {e}")
            analyst_output = ""

    print("[Ascendly] Step 1 complete.")

    # === Step 2: Forecaster — predict next 3 months ===
    print("[Ascendly] Step 2/3: Forecaster...")
    forecaster = Agent(
        role="Lead Forecaster",
        goal="Predict next 3 months of revenue. Be concise.",
        backstory="You run SARIMAX forecasts. Only output numbers and confidence intervals.",
        tools=[forecast_revenue],
        llm=_make_llm(),
        verbose=False,
        allow_delegation=False,
        max_iter=5,
    )
    task_forecast = Task(
        description=f"Run forecast_revenue on this data: {analyst_output[:2000]}",
        expected_output="JSON with model_used, data_points, and forecast array.",
        agent=forecaster,
    )
    crew2 = Crew(agents=[forecaster], tasks=[task_forecast], process=Process.sequential, verbose=True)
    forecast_output = _run_safe(crew2, task_forecast, "Forecaster")

    if not forecast_output:
        try:
            forecast_output = forecast_revenue.run(analyst_output[:2000])
        except Exception as e:
            print(f"[Ascendly] Forecast fallback failed: {e}")
            forecast_output = ""

    print("[Ascendly] Step 2 complete.")

    # === Step 3: Strategist — advice with benchmark context ===
    print("[Ascendly] Step 3/3: Strategist (with benchmarks)...")
    strategist = Agent(
        role="Startup Consultant",
        goal="Give 3 short, actionable recommendations based on the data and benchmarks.",
        backstory=(
            "You compare startup metrics against industry benchmarks. "
            "Use query_benchmarks to get relevant industry and competitor data. "
            "Then give direct, data-backed advice. No fluff."
        ),
        tools=[query_benchmarks],
        llm=_make_llm(),
        verbose=False,
        allow_delegation=False,
        max_iter=4,
    )
    context_summary = f"User metrics: {analyst_output[:800]}\nForecast: {forecast_output[:600]}"
    task_advise = Task(
        description=(
            f"First call query_benchmarks('industry_growth') to get sector averages. "
            f"Then call query_benchmarks('competitor') for competitor data. "
            f"Based on this user data AND the benchmarks, give exactly 3 recommendations as a JSON array. "
            f"Each with 'title' and 'body'. Reference specific benchmark comparisons.\n\n{context_summary}"
        ),
        expected_output='JSON array: [{"title": "...", "body": "..."}]',
        agent=strategist,
    )
    crew3 = Crew(agents=[strategist], tasks=[task_advise], process=Process.sequential, verbose=True)
    strategist_output = _run_safe(crew3, task_advise, "Strategist")

    processing_time = int((time.time() - start_time) * 1000)
    response = _parse_outputs(analyst_output, forecast_output, strategist_output, processing_time)
    response["request_id"] = request_id
    response["agent_logs"] = [
        {"agent_name": "Analyst", "output": analyst_output},
        {"agent_name": "Forecaster", "output": forecast_output},
        {"agent_name": "Strategist", "output": strategist_output},
    ]
    return response


def _parse_outputs(analyst_output: str, forecast_output: str, advice_output: str, processing_time: int) -> dict:
    import re

    def extract_json(text):
        try:
            return json.loads(text)
        except (json.JSONDecodeError, TypeError):
            pass
        for pattern in [r'\[[\s\S]*\]', r'\{[\s\S]*\}']:
            match = re.search(pattern, text or "")
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError:
                    continue
        return None

    historical = []
    try:
        data = extract_json(analyst_output)
        if isinstance(data, dict) and "cleaned_data" in data:
            historical = data["cleaned_data"]
        elif isinstance(data, list):
            historical = data
    except Exception:
        pass

    forecast = []
    model_used = "SARIMAX"
    try:
        data = extract_json(forecast_output)
        if isinstance(data, dict):
            forecast = data.get("forecast", [])
            model_used = data.get("model_used", "SARIMAX")
        elif isinstance(data, list):
            forecast = data
    except Exception:
        pass

    strategic_advice = []
    try:
        data = extract_json(advice_output)
        if isinstance(data, list):
            strategic_advice = data
        elif isinstance(data, dict) and "advice" in data:
            strategic_advice = data["advice"]
    except Exception:
        strategic_advice = [{"title": "Analysis Complete", "body": advice_output or ""}]

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
