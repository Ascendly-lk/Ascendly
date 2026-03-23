"""Tests for health / root endpoints."""
import pytest


def test_root_returns_200(client):
    resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert "message" in body


def test_root_no_auth_required(no_auth_client):
    """Root endpoint must be publicly accessible."""
    resp = no_auth_client.get("/")
    assert resp.status_code == 200


def test_health_db_requires_auth(no_auth_client):
    """GET /health/db should return 401/403/422 without a token."""
    resp = no_auth_client.get("/health/db")
    assert resp.status_code in (401, 403, 422)


def test_health_db_with_auth(client):
    """GET /health/db with mocked auth should not 500."""
    resp = client.get("/health/db")
    # Accept 200 or 503 (DB might not be reachable in unit test env)
    assert resp.status_code in (200, 503)
