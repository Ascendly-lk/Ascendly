"""Tests for /api/dashboard/metrics and /api/analytics/activity."""
import pytest


class TestDashboardMetrics:
    def test_metrics_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.get("/api/dashboard/metrics")
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
    def test_activity_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.get("/api/analytics/activity")
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
        assert len(body["labels"]) == 5  # last 5 years

    def test_activity_invalid_period_rejected(self, client):
        """period must match ^(monthly|yearly)$ — anything else is 422."""
        resp = client.get("/api/analytics/activity?period=weekly")
        assert resp.status_code == 422

    def test_activity_response_has_series(self, client):
        resp = client.get("/api/analytics/activity")
        assert resp.status_code == 200
        body = resp.json()
        assert "series" in body
        assert "analyses" in body["series"]
        assert "chats" in body["series"]
