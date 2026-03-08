"""
CrewAI Agent Definitions — 3 agents per PRD Section 3
"""
import os
from crewai import Agent, LLM
from ai_engine.tools.data_tools import csv_reader, growth_calculator
from ai_engine.tools.sarimax_tool import forecast_revenue
from ai_engine.tools.benchmark_tool import query_benchmarks


def _make_llm() -> LLM:
    model = os.getenv("CREWAI_LLM_MODEL", "azure/gpt-4o")
    if model.startswith("azure/"):
        api_key = os.getenv("AZURE_API_KEY")
        endpoint = os.getenv("AZURE_ENDPOINT")
        api_version = os.getenv("AZURE_API_VERSION")
        if not api_key or not endpoint:
            raise EnvironmentError(
                "AZURE_API_KEY and AZURE_ENDPOINT must be set for Azure models."
            )
        return LLM(model=model, api_key=api_key, endpoint=endpoint, api_version=api_version)
    return LLM(model=model, api_key=os.getenv("OPENAI_API_KEY"))


def create_data_analyst() -> Agent:
    """Agent 1: Senior Data Analyst — cleans data and calculates metrics."""
    return Agent(
        role="Data Analyst",
        goal="Clean raw data and calculate metrics. Be concise.",
        backstory="You extract Date and Revenue columns, fix missing values, and calculate MoM growth. Output only facts.",
        tools=[csv_reader, growth_calculator],
        llm=_make_llm(),
        verbose=False,
        allow_delegation=False,
        max_iter=3,
    )


def create_forecaster() -> Agent:
    """Agent 2: Quantitative Forecaster — predicts future revenue."""
    return Agent(
        role="Lead Forecaster",
        goal="Predict next 3 months of revenue. Be concise.",
        backstory="You run SARIMAX forecasts. Only output numbers and confidence intervals.",
        tools=[forecast_revenue],
        llm=_make_llm(),
        verbose=False,
        allow_delegation=False,
        max_iter=5,
    )


def create_strategist() -> Agent:
    """Agent 3: Strategic Advisor — synthesizes data and benchmark comparisons into actionable advice."""
    return Agent(
        role="Startup Consultant",
        goal="Give 3 short, actionable recommendations backed by data and industry benchmarks.",
        backstory=(
            "You compare startup metrics against industry benchmarks and competitor data. "
            "Use query_benchmarks to get context, then give direct advice. "
            "Reference specific numbers. No fluff."
        ),
        tools=[query_benchmarks],
        llm=_make_llm(),
        verbose=False,
        allow_delegation=False,
        max_iter=4,
    )

