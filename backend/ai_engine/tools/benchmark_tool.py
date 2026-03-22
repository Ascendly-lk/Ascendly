"""
Benchmark Query Tool for CrewAI
---------------------------------
Fallback chain (in order):
  1. In-memory TTL cache (cache_manager) — returns immediately if fresh
  2. Local Supabase startup_benchmarks table — 1051 startup records (free, always on)
  3. Google ADK BenchmarkOrchestrator — live multi-source fetch (uses Gemini credits)
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
    Fetch industry or competitor benchmark data using a 4-layer fallback chain:
    in-memory cache → local Supabase startup_benchmarks table → Google ADK multi-agent
    pipeline (World Bank, Alpha Vantage, SerpAPI, Yahoo Finance) → hardcoded defaults.

    Input: category string — must be one of:
      - "industry_growth"  → startup revenue growth stats and success rate from local dataset
      - "competitor"        → top-revenue successful startups as competitor proxies

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

    # ── Layer 2: Local startup_benchmarks table ───────────────────────────────
    try:
        from database.supabase_client import get_supabase_admin
        client = get_supabase_admin()

        if category == "industry_growth":
            # Query revenue rows for growth calculation (ordered for determinism)
            revenue_resp = (
                client.table("startup_benchmarks")
                .select("revenue_year1, revenue_year3")
                .not_.is_("revenue_year3", "null")
                .gt("revenue_year3", 0)
                .order("name")
                .limit(500)
                .execute()
            )
            # Separate query for overall success rate (unfiltered denominator)
            success_resp = (
                client.table("startup_benchmarks")
                .select("current_status")
                .execute()
            )
            revenue_rows = revenue_resp.data or []
            all_rows = success_resp.data or []
            if revenue_rows and all_rows:
                growths = []
                for r in revenue_rows:
                    y1 = r.get("revenue_year1") or 0
                    y3 = r.get("revenue_year3") or 0
                    if y1 > 0 and y3 > 0:
                        growths.append(((y3 - y1) / y1) * 100)
                if growths:
                    growths.sort()
                    n = len(growths)
                    # Correct median: average of two middle values for even-length lists
                    if n % 2 == 1:
                        median_growth = growths[n // 2]
                    else:
                        median_growth = (growths[n // 2 - 1] + growths[n // 2]) / 2
                    successful = sum(1 for r in all_rows if r.get("current_status") == "Successful")
                    success_rate = successful / max(len(all_rows), 1) * 100
                    records = [
                        {"name": "Startup Median Revenue Growth (Y1→Y3)", "metric": "revenue_growth_pct", "value": round(median_growth, 1), "unit": "%", "period": "Y1-Y3", "source": "startup_benchmarks"},
                        {"name": "Startup Success Rate", "metric": "success_rate", "value": round(success_rate, 1), "unit": "%", "period": "2024", "source": "startup_benchmarks"},
                        {"name": "Sample Size", "metric": "count", "value": len(all_rows), "unit": "startups", "period": "2024", "source": "startup_benchmarks"},
                    ]
                    logger.info("Local benchmark table returned %d records for category='%s'", len(records), category)
                    return _cache_and_return(records)

        elif category == "competitor":
            # Top revenue performers — Y3 revenue as competitor proxy
            response = (
                client.table("startup_benchmarks")
                .select("name, country, revenue_year1, revenue_year2, revenue_year3, current_status")
                .eq("current_status", "Successful")
                .not_.is_("revenue_year3", "null")
                .gt("revenue_year3", 0)
                .order("revenue_year3", desc=True)
                .limit(10)
                .execute()
            )
            rows = response.data or []
            if rows:
                records = [
                    {
                        "name": r["name"],
                        "metric": "revenue_year3",
                        "value": r["revenue_year3"],
                        "unit": "USD",
                        "period": "Year 3",
                        "source": "startup_benchmarks",
                    }
                    for r in rows
                ]
                logger.info("Local benchmark table returned %d competitor records", len(records))
                return _cache_and_return(records)
    except Exception:
        logger.exception("Local startup_benchmarks query failed for category='%s'", category)

    # ── Layer 3: Google ADK live fetch ────────────────────────────────────────
    try:
        from ai_engine.adk.orchestrator import BenchmarkOrchestrator
        logger.info("ADK benchmark fetch starting for category='%s'", category)
        orchestrator = BenchmarkOrchestrator()
        adk_records = orchestrator.run(category)
        logger.info("ADK returned %d benchmark records for category='%s'", len(adk_records), category)
        if adk_records:
            return _cache_and_return(adk_records)
    except Exception:
        logger.exception("ADK benchmark fetch failed for category='%s'", category)

    # ── Layer 4: Hardcoded defaults ───────────────────────────────────────────
    logger.warning("All sources failed — using hardcoded defaults for category='%s'", category)
    return _cache_and_return(_DEFAULTS.get(category, []))
