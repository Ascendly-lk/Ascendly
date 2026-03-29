"""
Benchmark Query Tool for CrewAI
Reads industry and competitor benchmark data from the Supabase benchmarks table.
"""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from crewai.tools import tool


@tool("query_benchmarks")
def query_benchmarks(category: str) -> str:
    """
    Fetch industry or competitor benchmark data from the database.
    Use this to compare the user's metrics against industry averages or competitors.

    Input: category string — must be one of:
      - "industry_growth"  → average MoM/annual growth rates by sector (SaaS, E-commerce, etc.)
      - "competitor"        → revenue and growth data for known competitor companies

    Output: JSON array of benchmark records, each with: name, metric, value, unit, period, source.

    Examples:
      query_benchmarks("industry_growth")
      query_benchmarks("competitor")
    """
    try:
<<<<<<< HEAD
        from cache.cache_manager import get_cached_benchmark, set_cached_benchmark
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
        from database.supabase_client import get_records

        valid_categories = ("industry_growth", "competitor")
        if category not in valid_categories:
            return json.dumps({
                "error": f"Invalid category '{category}'. Must be one of: {valid_categories}"
            })

<<<<<<< HEAD
        # Return from cache if available (TTL managed by cache_manager — 24h)
        cached = get_cached_benchmark(category)
        if cached:
            print(f"[Ascendly] Benchmark cache HIT for category='{category}'")
            return cached

=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
        response = get_records("benchmarks", {"category": category})
        rows = response.data if response and response.data else []

        if not rows:
            return json.dumps({
                "warning": f"No benchmark data found for category='{category}'. "
                           "The benchmarks table may not be populated yet."
            })

<<<<<<< HEAD
=======
        # Return clean, agent-readable records
>>>>>>> parent of ae17c912 (Update by deleting some files)
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

<<<<<<< HEAD
        result = json.dumps(benchmarks, indent=2)
        set_cached_benchmark(category, result)
        return result
=======
        return json.dumps(benchmarks, indent=2)
>>>>>>> parent of ae17c912 (Update by deleting some files)

    except Exception as e:
        return json.dumps({"error": f"Failed to query benchmarks: {str(e)}"})
