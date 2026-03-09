"""
SARIMAX Forecasting Tool for CrewAI
Predicts future revenue using SARIMAX or SES fallback.
"""
import json
from datetime import datetime
from dateutil.relativedelta import relativedelta
import pandas as pd
import numpy as np
from crewai.tools import tool


def _apply_guardrails(forecast_values: list[float], last_actual: float) -> list[float]:
    """
    Apply guardrails to forecast values:
    - Clamp negative revenue to 0
    - Cap growth at 150% if > 500% of previous month
    """
    guarded = []
    prev = last_actual
    for val in forecast_values:
        if val < 0:
            val = 0.0
        if prev > 0 and val > prev * 5.0:
            val = prev * 1.5
        guarded.append(round(val, 2))
        prev = val
    return guarded


def _forecast_sarimax(series: pd.Series, steps: int = 3):
    """Run SARIMAX model on the time series."""
    from statsmodels.tsa.statespace.sarimax import SARIMAX

    model = SARIMAX(
        series,
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 12),
        enforce_stationarity=False,
        enforce_invertibility=False,
    )
    results = model.fit(disp=False)
    forecast = results.get_forecast(steps=steps)
    summary = forecast.summary_frame(alpha=0.20)  # 80% confidence interval

    return {
        "mean": summary["mean"].tolist(),
        "lower": summary["mean_ci_lower"].tolist(),
        "upper": summary["mean_ci_upper"].tolist(),
    }


def _forecast_ses(series: pd.Series, steps: int = 3):
    """Fallback: Simple Exponential Smoothing for < 12 data points."""
    from statsmodels.tsa.holtwinters import SimpleExpSmoothing

    model = SimpleExpSmoothing(series).fit()
    forecast = model.forecast(steps)

    std_err = series.std()
    return {
        "mean": forecast.tolist(),
        "lower": (forecast - 1.28 * std_err).tolist(),  # ~80% CI
        "upper": (forecast + 1.28 * std_err).tolist(),
    }


@tool("forecast_revenue")
def forecast_revenue(cleaned_data_json: str) -> str:
    """
    Predict the next 3 months of revenue from historical data.
    Input: JSON string of cleaned data with 'date' and 'revenue' keys.
    Example: '[{"date": "2023-01-01", "revenue": 10000}, ...]'
    Output: JSON string with forecast results including confidence intervals.
    """
    try:
        data = json.loads(cleaned_data_json)
    except (json.JSONDecodeError, TypeError):
        # Try to extract JSON from text that may contain extra content
        import re
        json_match = None
        for pattern in [r'\[[\s\S]*\]', r'\{[\s\S]*\}']:
            match = re.search(pattern, str(cleaned_data_json))
            if match:
                try:
                    json_match = json.loads(match.group())
                    break
                except json.JSONDecodeError:
                    continue
        if json_match is None:
            return json.dumps({"error": "Could not parse input as JSON. Please pass a JSON array of objects with 'date' and 'revenue' keys."})
        data = json_match

    # Handle various input formats the LLM might send
    if isinstance(data, dict):
        # If LLM sent a dict with a data key, extract the array
        if "cleaned_data" in data:
            data = data["cleaned_data"]
        elif "data" in data:
            data = data["data"]
        elif "date" in data and "revenue" in data:
            # Single data point wrapped in a dict — wrap in list
            data = [data]
        else:
            # Try to find any list value in the dict
            for v in data.values():
                if isinstance(v, list) and len(v) > 0:
                    data = v
                    break

    if not isinstance(data, list) or len(data) == 0:
        return json.dumps({"error": f"Expected a JSON array of objects with 'date' and 'revenue' keys. Got: {str(data)[:200]}"})

    if len(data) < 3:
        return json.dumps({"error": f"Need at least 3 data points for forecasting, got {len(data)}."})

    try:
        df = pd.DataFrame(data)
    except ValueError:
        return json.dumps({"error": f"Could not create DataFrame from data. Expected list of dicts with 'date' and 'revenue'. Got: {str(data)[:200]}"})

    # Flexible column name matching
    col_map = {}
    for col in df.columns:
        cl = col.lower().strip()
        if cl in ("date", "month", "period", "time"):
            col_map["date"] = col
        elif cl in ("revenue", "amount", "sales", "income"):
            col_map["revenue"] = col

    if "date" not in col_map or "revenue" not in col_map:
        return json.dumps({"error": f"Could not find 'date' and 'revenue' columns. Found columns: {list(df.columns)}"})

    df = df.rename(columns={col_map["date"]: "date", col_map["revenue"]: "revenue"})

    try:
        df["date"] = pd.to_datetime(df["date"], format="mixed")
    except Exception:
        return json.dumps({"error": f"Could not parse dates. Sample values: {df['date'].head(3).tolist()}"})

    df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")
    df = df.dropna(subset=["date", "revenue"])

    if len(df) < 3:
        return json.dumps({"error": f"After cleaning, only {len(df)} valid rows remain. Need at least 3."})

    df = df.sort_values("date")
    df.set_index("date", inplace=True)

    # Ensure monthly frequency
    try:
        df = df.asfreq("MS")
    except ValueError:
        # If dates don't align to month starts, resample
        df = df.resample("MS").last()
        df = df.dropna(subset=["revenue"])

    series = df["revenue"].astype(float)

    if len(series) < 3:
        return json.dumps({"error": f"After resampling, only {len(series)} data points. Need at least 3."})

    # Choose model based on data points
    n_points = len(series)
    if n_points < 12:
        raw = _forecast_ses(series, steps=3)
        model_used = "SES"
    else:
        raw = _forecast_sarimax(series, steps=3)
        model_used = "SARIMAX"

    last_actual = float(series.iloc[-1])
    last_date = series.index[-1]

    # Apply guardrails
    guarded_mean = _apply_guardrails(raw["mean"], last_actual)
    guarded_lower = _apply_guardrails(raw["lower"], last_actual)
    guarded_upper = _apply_guardrails(raw["upper"], last_actual)

    # Build forecast result
    forecast = []
    for i in range(3):
        forecast_date = last_date + relativedelta(months=i + 1)
        forecast.append({
            "date": forecast_date.strftime("%Y-%m-%d"),
            "revenue": guarded_mean[i],
            "conf_lower": guarded_lower[i],
            "conf_upper": guarded_upper[i],
        })

    result = {
        "model_used": model_used,
        "data_points": n_points,
        "forecast": forecast,
    }
    return json.dumps(result, indent=2)
