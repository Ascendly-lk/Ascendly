"""
Benchmark Query Tool for CrewAI
---------------------------------
Replaces the static Supabase lookup with a live Google ADK multi-agent pipeline
that fetches data from World Bank, Alpha Vantage, SerpAPI, and Yahoo Finance.

Fallback chain (in order):
  1. In-memory TTL cache (cache_manager) — returns immediately if fresh
  2. Google ADK BenchmarkOrchestrator — live multi-source fetch
  3. Cached Supabase rows — last-known-good data
  4. Hardcoded defaults — always returns something useful

The @tool signature is unchanged — no modifications needed in crew.py or agents.py.
"""
import json
import logging
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from crewai.tools import tool

logger = logging.getLogger(__name__)

# Hardcoded defaults — used only when all live sources fail
_DEFAULTS = {
    "industry_growth": [
        {"name": "SaaS Industry Average",      "metric": "annual_growth_rate", "value": 18.0, "unit": "%", "period": "2024", "source": "default"},
        {"name": "E-commerce Industry Average", "metric": "annual_growth_rate", "value": 14.0, "unit": "%", "period": "2024", "source": "default"},
        {"name": "Fintech Industry Average",    "metric": "annual_growth_rate", "value": 16.5, "unit": "%", "period": "2024", "source": "default"},
        {"name": "Global GDP Growth",           "metric": "annual_growth_rate", "value": 3.2,  "unit": "%", "period": "2024", "source": "World Bank (default)"},
    ],
    "competitor": [
        {"name": "Median Series A SaaS",  "metric": "arr_growth_rate", "value": 150.0, "unit": "%", "period": "2024", "source": "default"},
        {"name": "Median Series B SaaS",  "metric": "arr_growth_rate", "value": 80.0,  "unit": "%", "period": "2024", "source": "default"},
        {"name": "Top Quartile Startups", "metric": "revenue_growth",  "value": 200.0, "unit": "%", "period": "2024", "source": "default"},
    ],
}


@tool("query_benchmarks")
def query_benchmarks(category: str) -> str:
    """
    Fetch industry or competitor benchmark data from live sources.
    Uses a Google ADK multi-agent pipeline (World Bank, Alpha Vantage, SerpAPI, Yahoo Finance).

    Input: category string — must be one of:
      - "industry_growth"  → average MoM/annual growth rates by sector (SaaS, E-commerce, etc.)
      - "competitor"        → revenue and growth data for known competitor companies

    Output: JSON array of benchmark records, each with: name, metric, value, unit, period, source.

    Examples:
      query_benchmarks("industry_growth")
      query_benchmarks("competitor")
    """
    valid_categories = ("industry_growth", "competitor")
    if category not in valid_categories:
        return json.dumps({"error": f"Invalid category '{category}'. Must be one of: {valid_categories}"})

    # Shared cache helpers — used by any layer that succeeds
    try:
        from cache.cache_manager import get_cached_benchmark, set_cached_benchmark
        _cache_available = True
    except Exception:
        _cache_available = False
        get_cached_benchmark = set_cached_benchmark = None

    def _cache_and_return(records: list) -> str:
        """Serialise records, write to cache (from any layer), and return."""
        result = json.dumps(records, indent=2)
        if _cache_available:
            try:
                set_cached_benchmark(category, result)
            except Exception:
                pass
        return result

    # ── Layer 1: In-memory cache ──────────────────────────────────────────────
    if _cache_available:
        try:
            cached = get_cached_benchmark(category)
            if cached is not None:
                logger.debug("Benchmark cache HIT for category='%s'", category)
                return cached
        except Exception:
            logger.exception("Benchmark cache read failed for category='%s'", category)

    # ── Layer 2: Google ADK live fetch ────────────────────────────────────────
    try:
        from ai_engine.adk.orchestrator import BenchmarkOrchestrator
        logger.info("ADK benchmark fetch starting for category='%s'", category)
        orchestrator = BenchmarkOrchestrator()
        adk_records = orchestrator.run(category)
        logger.info("ADK returned %d benchmark records for category='%s'", len(adk_records), category)
        if adk_records:
            # TODO: upsert to Supabase benchmarks table with fetched_at=NOW() once columns are added
            return _cache_and_return(adk_records)
    except Exception:
        logger.exception("ADK benchmark fetch failed for category='%s'", category)

    # ── Layer 3: Supabase fallback (last-known-good) ──────────────────────────
    try:
        from database.supabase_client import get_records
        response = get_records("benchmarks", {"category": category})
        rows = response.data if response and response.data else []
        if rows:
            logger.warning("ADK failed — using Supabase cached data (%d rows) for category='%s'", len(rows), category)
            benchmarks = [
                {
                    "name": r.get("name"),
                    "metric": r.get("metric"),
                    "value": r.get("value"),
                    "unit": r.get("unit"),
                    "period": r.get("period"),
                    "source": r.get("source"),
                }
                for r in rows
            ]
            return _cache_and_return(benchmarks)
    except Exception:
        logger.exception("Supabase fallback failed for category='%s'", category)

    # ── Layer 4: Hardcoded defaults ───────────────────────────────────────────
    logger.warning("All sources failed — using hardcoded defaults for category='%s'", category)
    return _cache_and_return(_DEFAULTS.get(category, []))
