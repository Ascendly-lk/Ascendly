"""
Deterministic tests for the Data Analyst pipeline.

These tests exercise parse_outputs() and the analyst output schema directly —
no LLM calls, no network, no Supabase.  They must pass on every push.
"""
import json

import pytest

from ai_engine.crew import parse_outputs


# ── Helpers ───────────────────────────────────────────────────────────────────

def _make_forecast_output(model: str = "SARIMAX", n: int = 3) -> str:
    return json.dumps({
        "model_used": model,
        "data_points": 6,
        "forecast": [
            {"month": f"2024-0{7 + i}", "revenue": 17000 + i * 1500}
            for i in range(n)
        ],
    })


def _make_advice_output() -> str:
    return json.dumps([
        {"title": "Reduce churn", "body": "Introduce annual plans."},
        {"title": "Upsell", "body": "Offer a mid-tier plan."},
        {"title": "Expand market", "body": "Target EU segment."},
    ])


# ── Tests ─────────────────────────────────────────────────────────────────────

class TestParseOutputsSchema:
    """parse_outputs returns the required top-level schema."""

    def test_returns_status_success(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), _make_advice_output(), 500)
        assert result["status"] == "success"

    def test_metadata_keys_present(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), _make_advice_output(), 750)
        assert "model_used" in result["metadata"]
        assert "processing_time_ms" in result["metadata"]
        assert result["metadata"]["processing_time_ms"] == 750

    def test_data_keys_present(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), _make_advice_output(), 0)
        assert "historical" in result["data"]
        assert "forecast" in result["data"]
        assert "strategic_advice" in result["data"]


class TestParseOutputsHistorical:
    """Analyst output → historical data extraction."""

    def test_historical_extracted(self, analyst_output_str, analyst_fixture):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), _make_advice_output(), 0)
        assert result["data"]["historical"] == analyst_fixture["cleaned_data"]

    def test_historical_revenue_accuracy(self, analyst_output_str, analyst_fixture):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), _make_advice_output(), 0)
        actual_revenues = [row["revenue"] for row in result["data"]["historical"]]
        expected_revenues = [row["revenue"] for row in analyst_fixture["cleaned_data"]]
        for actual, expected in zip(actual_revenues, expected_revenues):
            error_pct = abs(actual - expected) / expected * 100
            assert error_pct < 0.1, f"Revenue accuracy error {error_pct:.4f}% ≥ 0.1%"


class TestParseOutputsForecast:
    """Forecast output → forecast array extraction."""

    def test_forecast_list_extracted(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), _make_advice_output(), 0)
        assert isinstance(result["data"]["forecast"], list)
        assert len(result["data"]["forecast"]) == 3

    def test_model_used_propagated(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, _make_forecast_output("SES"), _make_advice_output(), 0)
        assert result["metadata"]["model_used"] == "SES"


class TestParseOutputsEdgeCases:
    """Graceful degradation when inputs are empty or malformed."""

    def test_empty_analyst_output(self):
        result = parse_outputs("", _make_forecast_output(), _make_advice_output(), 0)
        assert result["status"] == "success"
        assert result["data"]["historical"] == []

    def test_malformed_json_analyst_output(self):
        result = parse_outputs("not json at all", _make_forecast_output(), _make_advice_output(), 0)
        assert result["status"] == "success"

    def test_empty_forecast_output(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, "", _make_advice_output(), 0)
        assert isinstance(result["data"]["forecast"], list)

    def test_empty_advice_falls_back_gracefully(self, analyst_output_str):
        result = parse_outputs(analyst_output_str, _make_forecast_output(), "", 0)
        # Falls back to a single-item list with the raw output
        assert isinstance(result["data"]["strategic_advice"], list)
