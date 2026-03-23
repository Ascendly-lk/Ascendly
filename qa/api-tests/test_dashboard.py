"""Tests for /api/dashboard/metrics and /api/analytics/activity."""
import pytest


class TestDashboardMetrics:
    def test_metrics_requires_auth(self, no_auth_client):
        resp = no_auth_client.get("/api/dashboard/metrics")
        assert resp.status_code in (401, 403, 422)

    def test_metrics_returns_expected_keys(self, client):
        """With mocked auth, response must have the four metric keys."""
        resp = client.get("/api/dashboard/metrics")
        assert resp.status_code == 200
        body = resp.json()
        for key in ("files_uploaded", "ai_queries", "data_processed", "active_reports"):
            assert key in body, f"Missing key: {key}"

    def test_metrics_each_key_has_value_and_change(self, client):
        """Each metric object must contain 'value' and 'change_percent'."""
        resp = client.get("/api/dashboard/metrics")
        assert resp.status_code == 200
        body = resp.json()
        for key in ("files_uploaded", "ai_queries", "active_reports"):
            assert "value" in body[key]
            assert "change_percent" in body[key]


class TestAnalyticsActivity:
    def test_activity_requires_auth(self, no_auth_client):
        resp = no_auth_client.get("/api/analytics/activity")
        assert resp.status_code in (401, 403, 422)

    def test_activity_default_monthly(self, client):
        resp = client.get("/api/analytics/activity")
        assert resp.status_code == 200
        body = resp.json()
        assert body["period"] == "monthly"
        assert len(body["labels"]) == 12
        assert len(body["data"]) == 12

    def test_activity_yearly_period(self, client):
        resp = client.get("/api/analytics/activity?period=yearly")
        assert resp.status_code == 200
        body = resp.json()
        assert body["period"] == "yearly"
        # Labels list is non-empty and matches data length
        assert len(body["labels"]) > 0
        assert len(body["labels"]) == len(body["data"])

    def test_activity_invalid_period_rejected(self, client):
        """period must match ^(monthly|yearly)$ — anything else is 422."""
        resp = client.get("/api/analytics/activity?period=weekly")
        assert resp.status_code == 422

    def test_activity_response_has_values(self, client):
        """Response must contain labels, data, and values arrays."""
        resp = client.get("/api/analytics/activity")
        assert resp.status_code == 200
        body = resp.json()
        assert "values" in body
        assert "total_value" in body
        assert len(body["values"]) == len(body["labels"])
