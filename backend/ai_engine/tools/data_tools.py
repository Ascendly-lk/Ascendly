"""
Data Analysis Tools for CrewAI
CSV reading, cleaning, and growth calculation.
"""
import json
from difflib import SequenceMatcher
import pandas as pd
import numpy as np
from crewai.tools import tool


def _fuzzy_match_column(columns: list[str], target: str, threshold: float = 0.6) -> str | None:
    """Find the best fuzzy match for a column name."""
    best_match = None
    best_score = 0
    for col in columns:
        score = SequenceMatcher(None, col.lower().strip(), target.lower()).ratio()
        if score > best_score and score >= threshold:
            best_score = score
            best_match = col
    return best_match


@tool("csv_reader")
def csv_reader(file_path: str) -> str:
    """
    Read a CSV file containing financial data. Automatically finds Date and Revenue
    columns even if named differently. Cleans missing values via interpolation.
    Input: Path to the CSV file.
    Output: JSON string of cleaned data with 'date' and 'revenue' keys.
    """
    df = pd.read_csv(file_path)

    # Fuzzy match Date and Revenue columns
    columns = df.columns.tolist()
    date_col = _fuzzy_match_column(columns, "date")
    revenue_col = _fuzzy_match_column(columns, "revenue")

    if not date_col:
        # Try common date column names
        for alt in ["month", "period", "time", "year"]:
            date_col = _fuzzy_match_column(columns, alt)
            if date_col:
                break

    if not date_col or not revenue_col:
        return json.dumps({
            "error": f"Could not find required columns. Found: {columns}. "
                     f"Need columns matching 'Date' and 'Revenue'."
        })

    # Extract and clean
    result = pd.DataFrame()
    result["date"] = pd.to_datetime(df[date_col], format="mixed")
    result["revenue"] = pd.to_numeric(df[revenue_col], errors="coerce")

    # Check for expenses column (optional)
    expense_col = _fuzzy_match_column(columns, "expenses")
    if not expense_col:
        expense_col = _fuzzy_match_column(columns, "expense")
    if expense_col:
        result["expenses"] = pd.to_numeric(df[expense_col], errors="coerce")

    # Sort by date
    result = result.sort_values("date").reset_index(drop=True)

    # Interpolate missing revenue values
    result["revenue"] = result["revenue"].interpolate(method="linear")

    # Drop any remaining NaN rows
    result = result.dropna(subset=["date", "revenue"])

    if len(result) < 6:
        return json.dumps({
            "error": f"Insufficient data. Need at least 6 rows, got {len(result)}."
        })

    # Format dates as strings for JSON
    output = result.copy()
    output["date"] = output["date"].dt.strftime("%Y-%m-%d")
    return output.to_json(orient="records")


@tool("growth_calculator")
def growth_calculator(cleaned_data_json: str) -> str:
    """
    Calculate historical performance metrics from cleaned financial data.
    Input: JSON string of cleaned data with 'date' and 'revenue' keys.
    Output: Text summary with key metrics (average revenue, MoM growth, trends).
    """
    data = json.loads(cleaned_data_json)

    if isinstance(data, dict) and "error" in data:
        return json.dumps(data)

    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")

    revenues = df["revenue"].values
    dates = df["date"].values

    # Basic stats
    avg_revenue = float(np.mean(revenues))
    median_revenue = float(np.median(revenues))
    min_revenue = float(np.min(revenues))
    max_revenue = float(np.max(revenues))
    total_months = len(revenues)

    # Month-over-Month growth rates
    mom_growth = []
    for i in range(1, len(revenues)):
        if revenues[i - 1] != 0:
            growth = ((revenues[i] - revenues[i - 1]) / revenues[i - 1]) * 100
            mom_growth.append(round(growth, 2))

    avg_growth = round(float(np.mean(mom_growth)), 2) if mom_growth else 0
    growth_volatility = round(float(np.std(mom_growth)), 2) if mom_growth else 0

    # Trend direction
    if len(revenues) >= 3:
        recent_3 = revenues[-3:]
        if recent_3[-1] > recent_3[0]:
            trend = "upward"
        elif recent_3[-1] < recent_3[0]:
            trend = "downward"
        else:
            trend = "flat"
    else:
        trend = "insufficient data"

    # Date range
    start_date = pd.Timestamp(dates[0]).strftime("%b %Y")
    end_date = pd.Timestamp(dates[-1]).strftime("%b %Y")

    summary = {
        "date_range": f"{start_date} to {end_date}",
        "total_months": total_months,
        "average_monthly_revenue": round(avg_revenue, 2),
        "median_monthly_revenue": round(median_revenue, 2),
        "min_revenue": round(min_revenue, 2),
        "max_revenue": round(max_revenue, 2),
        "average_mom_growth_pct": avg_growth,
        "growth_volatility_pct": growth_volatility,
        "recent_trend": trend,
        "mom_growth_rates": mom_growth,
    }

    # Text summary for the agent
    text = (
        f"Data covers {start_date} to {end_date} ({total_months} months). "
        f"Average monthly revenue is ${avg_revenue:,.0f}. "
        f"Median monthly revenue is ${median_revenue:,.0f}. "
        f"Revenue ranged from ${min_revenue:,.0f} to ${max_revenue:,.0f}. "
        f"Average MoM growth rate is {avg_growth}% with volatility of {growth_volatility}%. "
        f"Recent trend is {trend}."
    )

    return json.dumps({"summary_text": text, "metrics": summary}, indent=2)
