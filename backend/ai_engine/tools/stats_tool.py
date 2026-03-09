"""
Statistics Tool for CrewAI
Runs pandas statistical operations on dataset records.
"""
import json
import pandas as pd
import numpy as np
from crewai.tools import tool


@tool("compute_statistics")
def compute_statistics(input_json: str) -> str:
    """
    Run statistical analysis on a dataset.
    Input: JSON string with two keys:
      - "data": array of records (each a dict with column: value pairs)
      - "operation": one of "describe", "correlation", "group_by", "time_series"

    Optional keys for specific operations:
      - "group_by_col": column name to group by (required for "group_by")
      - "value_col": column to aggregate (required for "group_by", "time_series")
      - "date_col": date column name (required for "time_series")

    Example input:
      {"data": [...], "operation": "describe"}
      {"data": [...], "operation": "group_by", "group_by_col": "region", "value_col": "revenue"}

    Output: JSON with the statistical result.
    """
    try:
        params = json.loads(input_json)
    except (json.JSONDecodeError, TypeError):
        return json.dumps({"error": "Input must be a valid JSON string."})

    data = params.get("data")
    operation = params.get("operation", "describe")

    if not data or not isinstance(data, list):
        return json.dumps({"error": "Missing or invalid 'data' field. Expected a JSON array."})

    try:
        df = pd.DataFrame(data)
    except Exception as e:
        return json.dumps({"error": f"Could not create DataFrame: {str(e)}"})

    # Convert numeric columns
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="ignore")

    try:
        if operation == "describe":
            numeric_df = df.select_dtypes(include=[np.number])
            if numeric_df.empty:
                return json.dumps({"error": "No numeric columns found for describe operation."})
            result = numeric_df.describe().round(2).to_dict()
            return json.dumps({"operation": "describe", "result": result})

        elif operation == "correlation":
            numeric_df = df.select_dtypes(include=[np.number])
            if numeric_df.shape[1] < 2:
                return json.dumps({"error": "Need at least 2 numeric columns for correlation."})
            result = numeric_df.corr().round(3).to_dict()
            return json.dumps({"operation": "correlation", "result": result})

        elif operation == "group_by":
            group_col = params.get("group_by_col")
            value_col = params.get("value_col")
            if not group_col or not value_col:
                return json.dumps({"error": "group_by requires 'group_by_col' and 'value_col'."})
            if group_col not in df.columns or value_col not in df.columns:
                return json.dumps({
                    "error": f"Columns not found. Available: {list(df.columns)}"
                })
            grouped = df.groupby(group_col)[value_col].agg(
                count="count", sum="sum", mean="mean", min="min", max="max"
            ).round(2).reset_index()
            result = grouped.to_dict(orient="records")
            return json.dumps({"operation": "group_by", "group_by": group_col, "result": result})

        elif operation == "time_series":
            date_col = params.get("date_col", "date")
            value_col = params.get("value_col", "revenue")
            if date_col not in df.columns or value_col not in df.columns:
                return json.dumps({
                    "error": f"Columns not found. Need '{date_col}' and '{value_col}'. "
                             f"Available: {list(df.columns)}"
                })
            df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
            df = df.dropna(subset=[date_col]).sort_values(date_col)
            df[value_col] = pd.to_numeric(df[value_col], errors="coerce")

            values = df[value_col].values
            mom_growth = []
            for i in range(1, len(values)):
                if values[i - 1] != 0:
                    growth = ((values[i] - values[i - 1]) / values[i - 1]) * 100
                    mom_growth.append(round(float(growth), 2))

            result = {
                "date_range": {
                    "start": df[date_col].iloc[0].strftime("%Y-%m-%d"),
                    "end": df[date_col].iloc[-1].strftime("%Y-%m-%d"),
                },
                "data_points": len(df),
                "avg_mom_growth_pct": round(float(np.mean(mom_growth)), 2) if mom_growth else 0,
                "growth_volatility_pct": round(float(np.std(mom_growth)), 2) if mom_growth else 0,
                "total": round(float(df[value_col].sum()), 2),
                "average": round(float(df[value_col].mean()), 2),
                "min": round(float(df[value_col].min()), 2),
                "max": round(float(df[value_col].max()), 2),
                "mom_growth_rates": mom_growth,
            }
            return json.dumps({"operation": "time_series", "result": result})

        else:
            return json.dumps({
                "error": f"Unknown operation '{operation}'. "
                         "Choose from: describe, correlation, group_by, time_series"
            })

    except Exception as e:
        return json.dumps({"error": f"Operation '{operation}' failed: {str(e)}"})
