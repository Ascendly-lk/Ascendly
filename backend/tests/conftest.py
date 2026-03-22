"""
Shared pytest fixtures for Ascendly backend tests.

The `mock_llm` fixture patches the LLM at the crew import site — request it
explicitly in tests that instantiate Agents/Crews.  Deterministic tests
(parse_outputs, SARIMAX) do not need it because they never call _make_llm.
Set ASCENDLY_LIVE_TESTS=true to skip mocking and run against real Azure GPT-4o.
"""
import json
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Ensure backend/ is on the path
sys.path.insert(0, str(Path(__file__).parent.parent))

# ── Fixtures ──────────────────────────────────────────────────────────────────

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture()
def analyst_fixture() -> dict:
    """Pre-built analyst output matching the schema expected by the Forecaster."""
    with open(FIXTURES_DIR / "analyst_input.json") as f:
        return json.load(f)


@pytest.fixture()
def analyst_output_str(analyst_fixture) -> str:
    return json.dumps(analyst_fixture)


@pytest.fixture()
def mock_llm():
    """Patch _make_llm at the crew import site so no Azure credentials are required.

    crew.py does `from ai_engine.provider import get_crewai_llm as _make_llm`,
    so we must patch `ai_engine.crew._make_llm` (the already-imported name),
    not the original `ai_engine.provider.get_crewai_llm`.
    """
    mock = MagicMock()
    mock.call.return_value = "mocked LLM response"
    with patch("ai_engine.crew._make_llm", return_value=mock):
        yield mock


@pytest.fixture()
def growth_revenue_series() -> list[float]:
    """Steady 10 % month-on-month growth over 18 months."""
    base = 10_000.0
    return [round(base * (1.10 ** i), 2) for i in range(18)]


@pytest.fixture()
def seasonal_revenue_series() -> list[float]:
    """Revenue with a clear annual seasonality peak in month 12."""
    import math
    base = 15_000.0
    return [
        round(base + 5_000 * math.sin(2 * math.pi * i / 12), 2)
        for i in range(24)
    ]


@pytest.fixture()
def volatile_revenue_series() -> list[float]:
    """Noisy / volatile series — SARIMAX must still beat naive carry-forward."""
    import random
    random.seed(42)
    return [round(12_000 + random.gauss(0, 2_000), 2) for _ in range(18)]
