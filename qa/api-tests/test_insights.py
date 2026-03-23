"""
Tests for AI Insights / Analysis pipeline endpoint POST /api/analyze.

The actual CrewAI pipeline is monkeypatched so tests are fast and deterministic.
"""
import io
import json
import pytest

SAMPLE_CSV = b"date,revenue,expenses\n2024-01,10000,6000\n2024-02,12000,7000\n"

MOCK_RESULT = {
    "status": "success",
    "data": {
        "historical": [{"date": "2024-01", "revenue": 10000, "expenses": 6000}],
        "forecast": [{"date": "2024-04", "revenue": 13000}],
        "strategic_advice": [{"title": "Grow", "body": "Invest in marketing."}],
    },
    "metadata": {"model": "sarimax", "periods": 3},
    "agent_logs": [],
    "request_id": "test-req-001",
}


class TestAnalyzeEndpoint:
    def test_analyze_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.post(
                "/api/analyze",
                data={"user_id": "some-id"},
                files={"file": ("test.csv", io.BytesIO(SAMPLE_CSV), "text/csv")},
            )
        assert resp.status_code in (401, 403, 422)

    def test_analyze_rejects_non_csv(self, client):
        """Only .csv files are accepted by /api/analyze."""
        resp = client.post(
            "/api/analyze",
            data={"user_id": "test-user-uuid-1234"},
            files={"file": ("report.pdf", io.BytesIO(b"%PDF"), "application/pdf")},
        )
        assert resp.status_code == 400
        assert "csv" in resp.json().get("detail", "").lower()

    def test_analyze_rejects_oversized_file(self, client):
        big = io.BytesIO(b"x,y\n" + b"1,2\n" * (10 * 1024 * 1024 // 4 + 1))
        resp = client.post(
            "/api/analyze",
            data={"user_id": "test-user-uuid-1234"},
            files={"file": ("big.csv", big, "text/csv")},
        )
        assert resp.status_code == 413

    def test_analyze_rejects_wrong_user_id(self, client):
        """user_id in form must match authenticated user id."""
        resp = client.post(
            "/api/analyze",
            data={"user_id": "a-different-user-id"},
            files={"file": ("data.csv", io.BytesIO(SAMPLE_CSV), "text/csv")},
        )
        assert resp.status_code == 403

    def test_analyze_success(self, client, monkeypatch):
        """Happy path — mocked pipeline returns structured result."""
        import ai_engine.tasks as tasks_mod
        monkeypatch.setattr(tasks_mod, "run_analysis", lambda path: dict(MOCK_RESULT))

        import database.supabase_client as sc

        class _FakeTable:
            def insert(self, *a, **kw): return self
            def select(self, *a, **kw): return self
            def eq(self, *a, **kw): return self
            def execute(self): return type("R", (), {"data": []})()

        monkeypatch.setattr(sc, "insert_record", lambda *a, **kw: None)

        resp = client.post(
            "/api/analyze",
            data={"user_id": "test-user-uuid-1234"},
            files={"file": ("data.csv", io.BytesIO(SAMPLE_CSV), "text/csv")},
        )
        assert resp.status_code == 200
        body = resp.json()
        # agent_logs and request_id must be stripped from response
        assert "agent_logs" not in body
        assert "request_id" not in body
        assert "data" in body
