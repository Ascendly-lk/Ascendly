"""
Tests for /api/upload and /api/files/recent endpoints.
File I/O is mocked at the Supabase admin client level via dependency override.
"""
import io
import pytest


SAMPLE_CSV = b"date,revenue,expenses\n2024-01,10000,6000\n2024-02,12000,7000\n2024-03,11000,6500\n"


class TestFileUpload:
    def test_upload_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.post("/api/upload", files={"file": ("test.csv", io.BytesIO(SAMPLE_CSV), "text/csv")})
        assert resp.status_code in (401, 403, 422)

    def test_upload_rejects_disallowed_extension(self, client):
        """Uploading an .exe file must return 400."""
        resp = client.post(
            "/api/upload",
            files={"file": ("malware.exe", io.BytesIO(b"MZ"), "application/octet-stream")},
        )
        assert resp.status_code == 400
        assert "Unsupported file type" in resp.json().get("detail", "")

    def test_upload_rejects_oversized_file(self, client):
        """Files over 50MB must be rejected with 413."""
        big_file = io.BytesIO(b"x" * (51 * 1024 * 1024))
        resp = client.post(
            "/api/upload",
            files={"file": ("big.csv", big_file, "text/csv")},
        )
        assert resp.status_code == 413

    def test_upload_csv_returns_file_id(self, client, tmp_path, monkeypatch):
        """Valid CSV upload returns file_id and filename in response."""
        import uuid

        # Patch Supabase admin so no real DB call is made
        fake_id = str(uuid.uuid4())

        class _FakeTable:
            def insert(self, *a, **kw): return self
            def update(self, *a, **kw): return self
            def eq(self, *a, **kw): return self
            def execute(self): return type("R", (), {"data": [{"id": fake_id}]})()

        class _FakeAdmin:
            def table(self, name): return _FakeTable()

        monkeypatch.setenv("SUPABASE_SERVICE_KEY", "fake")
        import database.supabase_client as sc
        monkeypatch.setattr(sc, "get_supabase_admin", lambda: _FakeAdmin())

        # Also patch uploads directory to tmp_path
        import app.api.endpoints.analysis as analysis_mod
        monkeypatch.setattr(analysis_mod, "UPLOADS_DIR", str(tmp_path))

        resp = client.post(
            "/api/upload",
            files={"file": ("sales.csv", io.BytesIO(SAMPLE_CSV), "text/csv")},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "file_id" in body
        assert body["filename"] == "sales.csv"
        assert body["size_bytes"] == len(SAMPLE_CSV)


class TestRecentFiles:
    def test_recent_files_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.get("/api/files/recent")
        assert resp.status_code in (401, 403, 422)

    def test_recent_files_returns_list(self, client):
        """With mocked auth, endpoint returns files list (empty is fine — no real DB)."""
        resp = client.get("/api/files/recent")
        assert resp.status_code == 200
        body = resp.json()
        assert "files" in body
        assert "count" in body
        assert isinstance(body["files"], list)

    def test_recent_files_limit_param(self, client):
        """Limit query param must be accepted (le=50)."""
        resp = client.get("/api/files/recent?limit=5")
        assert resp.status_code == 200

    def test_recent_files_limit_over_max_rejected(self, client):
        """limit > 50 should be rejected with 422."""
        resp = client.get("/api/files/recent?limit=100")
        assert resp.status_code == 422
