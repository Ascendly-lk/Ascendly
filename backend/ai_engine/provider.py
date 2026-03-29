"""
AI Provider Configuration — Centralized provider abstraction.

Reads AI_PROVIDER env var to determine whether to use OpenAI or Azure OpenAI.
All other backend modules import from here instead of reading env vars directly.

Usage:
    from ai_engine.provider import get_litellm_params, get_crewai_llm

    # For litellm streaming (chat.py):
    params = get_litellm_params()
    response = await litellm.acompletion(messages=..., stream=True, **params)

    # For CrewAI agents (crew.py):
    llm = get_crewai_llm()
    agent = Agent(..., llm=llm)
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── Provider detection ────────────────────────────────────────────────────────

AI_PROVIDER = os.getenv("AI_PROVIDER", "openai").lower().strip()

_REQUIRED_VARS = {
    "openai": ["OPENAI_API_KEY", "OPENAI_MODEL"],
    "azure":  ["AZURE_API_KEY", "AZURE_ENDPOINT", "AZURE_API_VERSION", "AZURE_DEPLOYMENT_NAME"],
}


def validate_provider() -> list[str]:
    """Return list of missing env vars for the active provider. Empty = all good."""
    required = _REQUIRED_VARS.get(AI_PROVIDER, [])
    return [v for v in required if not os.getenv(v)]


# ── Startup log ───────────────────────────────────────────────────────────────

_missing = validate_provider()
if AI_PROVIDER not in _REQUIRED_VARS:
    print(f"[provider] ⚠️  Unknown AI_PROVIDER='{AI_PROVIDER}'. Must be 'openai' or 'azure'.")
elif _missing:
    print(f"[provider] ⚠️  AI_PROVIDER={AI_PROVIDER} — missing env vars: {', '.join(_missing)}")
    print("[provider]    AI chat will fail until these are set in backend/.env")
else:
    _model = (
        os.getenv("OPENAI_MODEL") if AI_PROVIDER == "openai"
        else f"azure/{os.getenv('AZURE_DEPLOYMENT_NAME')}"
    )
    print(f"[provider] ✅ AI configured — provider: {AI_PROVIDER}, model: {_model}")


# ── LiteLLM params (used by chat.py) ─────────────────────────────────────────

def get_litellm_params() -> dict:
    """
    Return a dict of kwargs to pass to litellm.acompletion().
    Includes model, api_key, and provider-specific fields.
    Raises EnvironmentError if required vars are missing.
    """
    missing = validate_provider()
    if missing:
        raise EnvironmentError(
            f"AI_PROVIDER={AI_PROVIDER} requires: {', '.join(missing)}. "
            "Set them in backend/.env and restart."
        )

    if AI_PROVIDER == "azure":
        endpoint = os.getenv("AZURE_ENDPOINT", "")
        # Azure AI Foundry /v1 endpoints don't accept api-version as a query param
        uses_v1_path = endpoint.rstrip("/").endswith("/v1")
        params = {
            "model": f"openai/{os.getenv('AZURE_DEPLOYMENT_NAME')}" if uses_v1_path else f"azure/{os.getenv('AZURE_DEPLOYMENT_NAME')}",
            "api_key": os.getenv("AZURE_API_KEY"),
            "api_base": endpoint,
        }
        if not uses_v1_path:
            params["api_version"] = os.getenv("AZURE_API_VERSION")
        return params

    # OpenAI (default)
    return {
        "model": os.getenv("OPENAI_MODEL", "gpt-4o"),
        "api_key": os.getenv("OPENAI_API_KEY"),
    }


# ── CrewAI LLM (used by crew.py) ─────────────────────────────────────────────

def get_crewai_llm():
    """
    Return a CrewAI LLM instance configured for the active provider.
    Raises EnvironmentError if required vars are missing.
    """
    from crewai import LLM

    missing = validate_provider()
    if missing:
        raise EnvironmentError(
            f"AI_PROVIDER={AI_PROVIDER} requires: {', '.join(missing)}. "
            "Set them in backend/.env and restart."
        )

    if AI_PROVIDER == "azure":
        endpoint = os.getenv("AZURE_ENDPOINT", "")
        uses_v1_path = endpoint.rstrip("/").endswith("/v1")
        if uses_v1_path:
            return LLM(
                model=f"openai/{os.getenv('AZURE_DEPLOYMENT_NAME')}",
                api_key=os.getenv("AZURE_API_KEY"),
                base_url=endpoint,
            )
        return LLM(
            model=f"azure/{os.getenv('AZURE_DEPLOYMENT_NAME')}",
            api_key=os.getenv("AZURE_API_KEY"),
            endpoint=endpoint,
            api_version=os.getenv("AZURE_API_VERSION"),
        )

    # OpenAI (default)
    return LLM(
        model=os.getenv("OPENAI_MODEL", "gpt-4o"),
        api_key=os.getenv("OPENAI_API_KEY"),
    )
