"""
Arize Phoenix observability initialisation.

Call ``init_tracing(app)`` once at FastAPI startup.
Set ``PHOENIX_ENABLED=true`` in .env to activate.
When disabled (default in dev/test) the function is a no-op so no external
process or network socket is required.
"""
import os
import logging

logger = logging.getLogger(__name__)


def init_tracing(app=None) -> None:
    """Instrument CrewAI and LiteLLM pipelines with Arize Phoenix OpenTelemetry spans.

    Reads env vars:
        PHOENIX_ENABLED          — set to "true" to activate (default: false)
        PHOENIX_COLLECTOR_ENDPOINT — OTLP gRPC endpoint (default: http://localhost:4317)
        PHOENIX_PROJECT_NAME     — project label shown in the Phoenix UI
    """
    if os.getenv("PHOENIX_ENABLED", "false").lower() != "true":
        logger.debug("[tracing] Phoenix disabled — skipping instrumentation")
        return

    try:
        from phoenix.otel import register

        tracer_provider = register(
            project_name=os.getenv("PHOENIX_PROJECT_NAME", "ascendly-ai"),
            endpoint=os.getenv("PHOENIX_COLLECTOR_ENDPOINT", "http://localhost:4317"),
            auto_instrument=False,  # we instrument each library manually below
        )

        # ── CrewAI ──────────────────────────────────────────────────────────
        try:
            from openinference.instrumentation.crewai import CrewAIInstrumentor
            CrewAIInstrumentor().instrument(tracer_provider=tracer_provider)
            logger.info("[tracing] CrewAI instrumented")
        except ImportError:
            logger.warning("[tracing] openinference-instrumentation-crewai not installed — skipping")

        # ── LiteLLM ─────────────────────────────────────────────────────────
        try:
            from openinference.instrumentation.litellm import LiteLLMInstrumentor
            LiteLLMInstrumentor().instrument(tracer_provider=tracer_provider)
            logger.info("[tracing] LiteLLM instrumented")
        except ImportError:
            logger.warning("[tracing] openinference-instrumentation-litellm not installed — skipping")

        logger.info("[tracing] Arize Phoenix tracing active → project=%s",
                    os.getenv("PHOENIX_PROJECT_NAME", "ascendly-ai"))

    except ImportError:
        logger.warning(
            "[tracing] arize-phoenix-otel not installed — "
            "run: pip install arize-phoenix-otel openinference-instrumentation-crewai "
            "openinference-instrumentation-litellm"
        )
    except Exception as exc:
        # Tracing must never crash the server
        logger.error("[tracing] Initialisation failed (non-fatal): %s", exc)
