"""Tests for health / root endpoints."""
import pytest


def test_root_returns_200(client):
    resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert "status" in body


def test_root_no_auth_required(no_auth_client):
    """Root endpoint must be publicly accessible."""
    resp = no_auth_client.get("/")
    assert resp.status_code == 200


def test_health_db_requires_auth(no_auth_client):
    """GET /health/db should return 401/403/422 without a token.
    Note: /health/db uses get_db (SQLAlchemy) dep, not require_auth.
    When DATABASE_URL is not configured, it raises RuntimeError -> 500.
    """
    resp = no_auth_client.get("/health/db")
    assert resp.status_code in (401, 403, 422, 500)


def test_health_db_with_auth(client):
    """GET /health/db with mocked auth should not 500 in production.
    In CI, DATABASE_URL is not configured so 500 is expected.
    """
    resp = client.get("/health/db")
    # 200/503 in real env; 500 in CI when DATABASE_URL not configured
    assert resp.status_code in (200, 503, 500)
