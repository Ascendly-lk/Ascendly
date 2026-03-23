"""
Tests for /auth endpoints.

These tests send real HTTP to the auth routes. Most are unit-style (mock auth).
Actual Supabase sign-in/up is integration-only and requires TEST_AUTH_TOKEN env var.
"""
import pytest


class TestSignIn:
    def test_signin_missing_body_returns_422(self, client):
        resp = client.post("/auth/signin", json={})
        assert resp.status_code == 422

    def test_signin_invalid_email_returns_422(self, client):
        resp = client.post("/auth/signin", json={"email": "notanemail", "password": "pass"})
        assert resp.status_code == 422

    def test_signin_wrong_credentials_returns_4xx(self, client):
        """Wrong credentials must not return 2xx."""
        resp = client.post("/auth/signin", json={
            "email": "wrong@ascendly.test",
            "password": "wrongpassword",
        })
        assert resp.status_code >= 400

    def test_signin_returns_token_on_success(self, real_client):
        """Integration: real sign-in returns access_token."""
        import os
        email = os.getenv("TEST_EMAIL", "testuser@ascendly.test")
        password = os.getenv("TEST_PASSWORD", "")
        if not password:
            pytest.skip("TEST_PASSWORD not set")
        resp = real_client.post("/auth/signin", json={"email": email, "password": password})
        assert resp.status_code == 200
        assert "access_token" in resp.json()


class TestSignOut:
    def test_signout_requires_auth(self, client):
        from fastapi.testclient import TestClient
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))
        from main import app
        with TestClient(app, raise_server_exceptions=False) as raw:
            resp = raw.post("/auth/signout")
        assert resp.status_code in (401, 403, 422)

    def test_signout_with_auth_returns_200(self, client):
        resp = client.post("/auth/signout")
        assert resp.status_code == 200
