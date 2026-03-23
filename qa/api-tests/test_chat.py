"""
Tests for POST /api/chat (streaming SSE endpoint).

Because responses are Server-Sent Events, we read the raw text and check
that the stream contains expected SSE event types.
"""
import json
import pytest


def _collect_sse(resp) -> list[dict]:
    """Parse SSE text/event-stream body into a list of data dicts."""
    events = []
    for line in resp.text.splitlines():
        if line.startswith("data: "):
            payload = line[len("data: "):]
            if payload == "[DONE]":
                break
            try:
                events.append(json.loads(payload))
            except json.JSONDecodeError:
                pass
    return events


class TestChatEndpoint:
    def test_chat_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.post("/api/chat", json={"message": "hello"})
        assert resp.status_code in (401, 403, 422)

    def test_chat_empty_message_returns_400(self, client):
        resp = client.post("/api/chat", json={"message": "   "})
        assert resp.status_code == 400
        assert "empty" in resp.json().get("detail", "").lower()

    def test_chat_missing_message_returns_422(self, client):
        resp = client.post("/api/chat", json={})
        assert resp.status_code == 422

    def test_chat_history_too_long_rejected(self, client):
        """history array with > 50 items must be rejected."""
        history = [{"role": "user", "content": "hi"} for _ in range(51)]
        resp = client.post("/api/chat", json={"message": "hello", "history": history})
        assert resp.status_code == 422

    def test_chat_returns_event_stream(self, client, monkeypatch):
        """Quick chat must return Content-Type text/event-stream."""
        # Patch out the actual LLM call
        async def fake_stream(*args, **kwargs):
            yield 'data: {"type": "token", "content": "Hello"}\n\n'
            yield 'data: {"type": "done", "conversation_id": null}\n\n'

        import app.api.endpoints.chat as chat_mod
        monkeypatch.setattr(chat_mod, "_stream_quick_response", fake_stream)
        monkeypatch.setattr(chat_mod, "check_usage_limit", lambda *a, **kw: None)

        # Also patch Supabase admin for conversation creation
        class _FakeTable:
            def insert(self, *a, **kw): return self
            def update(self, *a, **kw): return self
            def select(self, *a, **kw): return self
            def eq(self, *a, **kw): return self
            def execute(self): return type("R", (), {"data": []})()

        class _FakeAdmin:
            def table(self, name): return _FakeTable()

        import database.supabase_client as sc
        monkeypatch.setattr(sc, "get_supabase_admin", lambda: _FakeAdmin())

        resp = client.post("/api/chat", json={"message": "hello"})
        assert resp.status_code == 200
        assert "text/event-stream" in resp.headers.get("content-type", "")

    def test_chat_dataset_ownership_check(self, client, monkeypatch):
        """Passing a dataset_id the user doesn't own must return 403."""
        class _FakeTable:
            def select(self, *a, **kw): return self
            def eq(self, *a, **kw): return self
            def execute(self): return type("R", (), {"data": []})()  # empty = not owned

        class _FakeAdmin:
            def table(self, name): return _FakeTable()

        import database.supabase_client as sc
        monkeypatch.setattr(sc, "get_supabase_admin", lambda: _FakeAdmin())
        monkeypatch.setattr(
            "app.api.endpoints.chat.check_usage_limit",
            lambda *a, **kw: None,
        )

        resp = client.post("/api/chat", json={
            "message": "analyze my revenue",
            "dataset_id": "non-existent-id-0000",
        })
        assert resp.status_code == 403
