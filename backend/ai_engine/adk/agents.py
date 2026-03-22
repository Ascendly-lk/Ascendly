"""
ADK Benchmark Agents
---------------------
Factory functions that create fresh Google ADK LlmAgent instances.
All agents use gemini-2.0-flash (GOOGLE_ADK_MODEL env var).

Agents:
  - make_industry_benchmark_agent  → World Bank + Alpha Vantage sector data
  - make_competitor_benchmark_agent → SerpAPI competitor search results
  - make_market_data_agent          → Yahoo Finance sector ETF performance

Factory pattern is required because ADK agents track their parent (ParallelAgent)
as instance state. Re-using module-level singletons across multiple orchestrator
calls causes a "already has a parent" ValidationError on the second call.
"""
import os
from google.adk.agents import LlmAgent
from ai_engine.adk.tools import (
    fetch_world_bank,
    fetch_alpha_vantage_sector,
    fetch_serp_competitors,
    fetch_yahoo_sector,
)

_MODEL = os.getenv("GOOGLE_ADK_MODEL", "gemini-2.0-flash")


def make_industry_benchmark_agent() -> LlmAgent:
    return LlmAgent(
        name="industry_benchmark_agent",
        model=_MODEL,
        instruction=(
            "You are an industry benchmark analyst. Your job is to fetch and structure "
            "industry growth data from multiple sources.\n\n"
            "Steps:\n"
            "1. Call fetch_world_bank with the provided category to get GDP and macro data.\n"
            "2. Call fetch_alpha_vantage_sector to get real-time sector performance.\n"
            "3. Combine both results and return a JSON array of benchmark records.\n\n"
            "Each record must have: name, metric, value (number), unit, period, source.\n"
            "Only include records with valid numeric values. Return ONLY the JSON array, no extra text."
        ),
        tools=[fetch_world_bank, fetch_alpha_vantage_sector],
        output_key="industry_result",
    )


def make_competitor_benchmark_agent() -> LlmAgent:
    return LlmAgent(
        name="competitor_benchmark_agent",
        model=_MODEL,
        instruction=(
            "You are a competitive intelligence analyst. Your job is to find competitor "
            "revenue and growth benchmarks.\n\n"
            "Steps:\n"
            "1. Call fetch_serp_competitors with the provided category.\n"
            "2. Extract any revenue figures, growth rates, or ARR data from the search snippets.\n"
            "3. Return a JSON array of benchmark records.\n\n"
            "Each record must have: name, metric, value (number, use 0 if unavailable), "
            "unit, period, source.\n"
            "Return ONLY the JSON array, no extra text."
        ),
        tools=[fetch_serp_competitors],
        output_key="competitor_result",
    )


def make_market_data_agent() -> LlmAgent:
    return LlmAgent(
        name="market_data_agent",
        model=_MODEL,
        instruction=(
            "You are a market data analyst. Your job is to fetch and structure "
            "sector ETF performance data from Yahoo Finance.\n\n"
            "Steps:\n"
            "1. Call fetch_yahoo_sector with the provided category.\n"
            "2. Structure the results as benchmark records.\n\n"
            "Each record must have: name, metric, value (number), unit, period, source.\n"
            "Return ONLY the JSON array, no extra text."
        ),
        tools=[fetch_yahoo_sector],
        output_key="market_result",
    )
