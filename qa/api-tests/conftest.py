"""
Pytest configuration for Ascendly backend API tests.

- Imports `app` from backend/main.py via TestClient (no real server needed)
- Overrides `require_auth` dependency so tests never need a real Supabase token
- Provides a `real_client` fixture that sends an actual Authorization header
  for integration tests that need to hit real Supabase (uses TEST_AUTH_TOKEN env var)
"""
import os
import sys
import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient

# Allow importing backend package from repo root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

from main import app  # noqa: E402
from database.supabase_client import require_auth  # noqa: E402


class MockUser:
    id = "test-user-uuid-1234"
    email = "testuser@ascendly.test"


def override_require_auth():
    return MockUser()


@pytest.fixture(scope="session")
def client():
    """TestClient with auth bypassed — use for all unit-style API tests."""
    app.dependency_overrides[require_auth] = override_require_auth
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def no_auth_client(client):
    """Reuses the session client but overrides auth to always return 401.

    Avoids creating a second TestClient (which conflicts with the session client's
    running lifespan) by just swapping the dependency override temporarily.
    """
    from fastapi import HTTPException as _HTTPException

    def _always_reject():
        raise _HTTPException(status_code=401, detail="Unauthorized")

    app.dependency_overrides[require_auth] = _always_reject
    yield client
    # Restore bypass override for remaining tests
    app.dependency_overrides[require_auth] = override_require_auth


@pytest.fixture(scope="session")
def real_client():
    """TestClient that sends a real token — for integration tests.

    Requires TEST_AUTH_TOKEN in qa/.env.
    Skip the test if the token is not set.
    """
    token = os.getenv("TEST_AUTH_TOKEN", "")
    if not token:
        pytest.skip("TEST_AUTH_TOKEN not set — skipping integration test")
    with TestClient(app) as c:
        c.headers.update({"Authorization": f"Bearer {token}"})
        yield c
