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
        from database.supabase_client import get_records

        valid_categories = ("industry_growth", "competitor")
        if category not in valid_categories:
            return json.dumps({
                "error": f"Invalid category '{category}'. Must be one of: {valid_categories}"
            })

        response = get_records("benchmarks", {"category": category})
        rows = response.data if response and response.data else []

        if not rows:
            return json.dumps({
                "warning": f"No benchmark data found for category='{category}'. "
                           "The benchmarks table may not be populated yet."
            })

        # Return clean, agent-readable records
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

        return json.dumps(benchmarks, indent=2)

    except Exception as e:
        return json.dumps({"error": f"Failed to query benchmarks: {str(e)}"})
