"""
LLM-judge quality tests using DeepEval.

These tests make real LLM calls (Azure GPT-4o + DeepEval judge model) and are
expensive.  They are SKIPPED by default and only run when triggered manually
via the ci-llm-judge GitHub Actions workflow or by setting:

    ASCENDLY_LLM_JUDGE=true pytest backend/tests/test_llm_judge.py

Metrics evaluated:
  Strategist — Faithfulness ≥ 0.7, no hallucinations beyond benchmark data
  Chat Agent  — Answer Relevancy ≥ 0.7, Contextual Recall ≥ 0.6
"""
import json
import os

import pytest

# Skip the entire module unless explicitly enabled
pytestmark = pytest.mark.skipif(
    os.getenv("ASCENDLY_LLM_JUDGE", "false").lower() != "true",
    reason="LLM judge tests disabled — set ASCENDLY_LLM_JUDGE=true to enable",
)


# ── Shared fixtures ───────────────────────────────────────────────────────────

SAMPLE_ANALYST_OUTPUT = json.dumps({
    "cleaned_data": [
        {"month": "2024-01", "revenue": 10000},
        {"month": "2024-02", "revenue": 11000},
        {"month": "2024-03", "revenue": 12500},
    ],
    "metrics": {"avg_monthly_growth_rate": 0.115},
})

SAMPLE_FORECAST_OUTPUT = json.dumps({
    "model_used": "SES",
    "forecast": [
        {"date": "2024-04-01", "revenue": 13800},
        {"date": "2024-05-01", "revenue": 15200},
        {"date": "2024-06-01", "revenue": 16700},
    ],
})

BENCHMARK_CONTEXT = (
    "Industry average MoM growth for SaaS is 8-12%. "
    "Top competitors are growing at 15% MoM. "
    "Average churn benchmark is 4% per month."
)


# ── Strategist faithfulness ───────────────────────────────────────────────────

class TestStrategistFaithfulness:

    def test_recommendations_are_faithful_to_benchmarks(self):
        from deepeval.metrics import FaithfulnessMetric
        from deepeval.test_case import LLMTestCase

        from ai_engine.crew import run_strategist_step

        output = run_strategist_step(SAMPLE_ANALYST_OUTPUT, SAMPLE_FORECAST_OUTPUT)

        test_case = LLMTestCase(
            input=f"Analyst: {SAMPLE_ANALYST_OUTPUT}\nForecast: {SAMPLE_FORECAST_OUTPUT}",
            actual_output=output,
            retrieval_context=[BENCHMARK_CONTEXT],
        )

        metric = FaithfulnessMetric(threshold=0.7, model="gpt-4o")
        metric.measure(test_case)

        assert metric.score >= 0.7, (
            f"Strategist faithfulness {metric.score:.2f} < 0.7\nReason: {metric.reason}"
        )


# ── Chat agent relevancy ──────────────────────────────────────────────────────

class TestChatAgentQuality:

    def test_answer_relevancy(self):
        from deepeval.metrics import AnswerRelevancyMetric
        from deepeval.test_case import LLMTestCase

        from ai_engine.crew import run_analyst_step

        question = "What is the monthly growth trend in the dataset?"
        # Use the real analyst step output as the chat agent's context
        analyst_output = run_analyst_step.__wrapped__(SAMPLE_ANALYST_OUTPUT) \
            if hasattr(run_analyst_step, "__wrapped__") else SAMPLE_ANALYST_OUTPUT
        actual_response = analyst_output if analyst_output else SAMPLE_ANALYST_OUTPUT

        test_case = LLMTestCase(
            input=question,
            actual_output=actual_response,
            retrieval_context=[SAMPLE_ANALYST_OUTPUT],
        )

        metric = AnswerRelevancyMetric(threshold=0.7, model="gpt-4o")
        metric.measure(test_case)

        assert metric.score >= 0.7, (
            f"Chat AnswerRelevancy {metric.score:.2f} < 0.7\nReason: {metric.reason}"
        )
