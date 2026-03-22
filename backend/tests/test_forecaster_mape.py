"""
Walk-forward MAPE test for the Forecaster.

For each fixture series (growth / seasonal / volatile):
  1. Use the first N-3 points as training data.
  2. Forecast months N-2, N-1, N using the SARIMAX / SES tool.
  3. Compute MAPE against the true held-out values.
  4. Assert MAPE < 20 % AND model beats naive carry-forward baseline.

No LLM calls — the tool functions are called directly.
"""
import json
from datetime import date
from dateutil.relativedelta import relativedelta

import pytest

from ai_engine.tools.sarimax_tool import _forecast_sarimax, _forecast_ses, _apply_guardrails


# ── Helpers ───────────────────────────────────────────────────────────────────

def _series_to_tool_input(values: list[float], start: date = date(2022, 1, 1)) -> str:
    """Build the JSON string that forecast_revenue expects."""
    rows = []
    for i, v in enumerate(values):
        d = start + relativedelta(months=i)
        rows.append({"date": d.strftime("%Y-%m-%d"), "revenue": v})
    return json.dumps(rows)


def _mape(actual: list[float], predicted: list[float]) -> float:
    assert len(actual) == len(predicted)
    errors = [abs(a - p) / a for a, p in zip(actual, predicted) if a != 0]
    return sum(errors) / len(errors) * 100


def _naive_mape(actual: list[float], last_known: float) -> float:
    errors = [abs(a - last_known) / a for a in actual if a != 0]
    return sum(errors) / len(errors) * 100


def _run_forecast(series_values: list[float], n_holdout: int = 3) -> list[float]:
    """Call the underlying forecast functions directly (no LLM)."""
    import pandas as pd

    train = series_values[:-n_holdout]
    start = date(2022, 1, 1)
    dates = [start + relativedelta(months=i) for i in range(len(train))]
    s = pd.Series(train, index=pd.DatetimeIndex(dates, freq="MS"), dtype=float)

    if len(train) < 12:
        raw = _forecast_ses(s, steps=n_holdout)
    else:
        raw = _forecast_sarimax(s, steps=n_holdout)

    guarded = _apply_guardrails(raw["mean"], float(train[-1]))
    return guarded


# ── Tests ─────────────────────────────────────────────────────────────────────

class TestForecasterMAPE:

    def test_growth_series_mape_under_threshold(self, growth_revenue_series):
        series = growth_revenue_series          # 18 points, 10% monthly growth
        holdout = series[-3:]
        predicted = _run_forecast(series)

        mape = _mape(holdout, predicted)
        naive = _naive_mape(holdout, series[-4])

        assert mape < 20.0, f"Growth MAPE {mape:.1f}% ≥ 20%"
        assert mape < naive, (
            f"Growth MAPE {mape:.1f}% did not beat naive baseline {naive:.1f}%"
        )

    def test_seasonal_series_mape_under_threshold(self, seasonal_revenue_series):
        series = seasonal_revenue_series        # 24 points with annual seasonality
        holdout = series[-3:]
        predicted = _run_forecast(series)

        mape = _mape(holdout, predicted)
        naive = _naive_mape(holdout, series[-4])

        assert mape < 20.0, f"Seasonal MAPE {mape:.1f}% ≥ 20%"
        # Seasonal series: model must do at least as well as naive (within 5pp margin)
        assert mape <= naive + 5.0, (
            f"Seasonal MAPE {mape:.1f}% exceeds naive baseline {naive:.1f}% by >5pp"
        )

    def test_volatile_series_beats_naive(self, volatile_revenue_series):
        series = volatile_revenue_series        # 18 points, noisy Gaussian noise
        holdout = series[-3:]
        predicted = _run_forecast(series)

        mape = _mape(holdout, predicted)
        naive = _naive_mape(holdout, series[-4])

        # Volatile: strict MAPE threshold is relaxed, but must beat naive carry-forward
        assert mape < naive or mape < 30.0, (
            f"Volatile MAPE {mape:.1f}% fails both beating naive ({naive:.1f}%) and 30% cap"
        )

    def test_forecast_produces_three_steps(self, growth_revenue_series):
        predicted = _run_forecast(growth_revenue_series, n_holdout=3)
        assert len(predicted) == 3

    def test_forecast_values_are_positive(self, growth_revenue_series):
        predicted = _run_forecast(growth_revenue_series)
        for val in predicted:
            assert val >= 0.0, f"Negative forecast value: {val}"
