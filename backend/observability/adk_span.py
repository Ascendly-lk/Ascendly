"""
Manual OpenTelemetry span wrapper for Google ADK benchmark runs.

Usage (in orchestrator.py):
    from observability.adk_span import benchmark_span

    with benchmark_span("industry", category="saas"):
        result = await agent.run(...)
"""
import os
from contextlib import contextmanager


@contextmanager
def benchmark_span(agent_name: str, **attributes):
    """Context manager that wraps an ADK agent call with an OTEL span.

    When PHOENIX_ENABLED is false (or arize-phoenix-otel is not installed)
    this is a pure no-op — the wrapped code runs normally.
    """
    if os.getenv("PHOENIX_ENABLED", "false").lower() != "true":
        yield
        return

    try:
        from opentelemetry import trace

        tracer = trace.get_tracer("ascendly.adk")
        with tracer.start_as_current_span(f"adk.{agent_name}") as span:
            span.set_attribute("adk.agent", agent_name)
            for key, val in attributes.items():
                span.set_attribute(f"adk.{key}", str(val))
            yield span
    except Exception:
        # Span creation must never break the agent call
        yield
