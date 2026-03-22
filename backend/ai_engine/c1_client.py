"""
Thesys C1 API client — interactive UI rendering for analysis results.

C1 is only used in analysis mode (after the 3-agent CrewAI pipeline).
Quick chat stays on litellm / Azure GPT-4o.
"""
import os
import json
from pydantic import BaseModel, Field
from typing import Optional, List

C1_BASE_URL = "https://api.thesys.dev/v1/embed"
# claude-haiku-4.5: cheapest model compatible with genui-sdk 0.8.x ($1.00/$5.00 per 1M tokens)
C1_MODEL = os.environ.get("THESYS_C1_MODEL", "c1-exp/anthropic/claude-haiku-4.5")

# ── System prompt ──────────────────────────────────────────────────────────────

ASCENDLY_C1_SYSTEM_PROMPT = """\
You are Ascendly AI, a financial analytics assistant exclusively for startup business data.

STRICT TOPIC RESTRICTIONS:
- You ONLY answer questions about: financial metrics, revenue forecasting, business \
analytics, startup KPIs, dataset insights, and strategic business recommendations.
- If the user asks ANYTHING outside these topics (weather, coding help, general \
knowledge, personal advice, news, sports, entertainment, etc.) respond ONLY with:
  "I'm Ascendly AI, specialized in financial analytics for startups. I can only help \
with questions about your business data, revenue forecasting, and startup metrics."
- Do NOT engage with off-topic questions in any way. Do NOT apologize.

DATASET GUARD RULE:
If the user's question requires data analysis, forecasting, or dataset insights,
AND no dataset context is provided in this conversation,
render the FileUploadZone component with allowedTypes=["text/csv","application/vnd.ms-excel",
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] and maxSizeMB=50.
Accompany it with a short message explaining why the upload is needed.

YOUR TASK:
Generate an interactive financial dashboard UI to present the structured analysis \
results provided below. Include:
1. A revenue forecast chart (bar or line) from the forecast array — show confidence \
bands if conf_lower/conf_upper are present
2. KPI metric cards (growth rate, total revenue, forecast accuracy)
3. Strategic recommendation cards — one card per recommendation with title + description
4. A summary header with dataset name and analysis date

ANALYSIS DATA (use ONLY this data, do not invent numbers):
"""


# ── Custom component schemas ───────────────────────────────────────────────────

class FileUploadZoneSchema(BaseModel):
    allowedTypes: Optional[List[str]] = Field(
        None, description="Allowed file MIME types e.g. text/csv"
    )
    maxSizeMB: Optional[float] = Field(None, description="Max file size in MB")


C1_METADATA = {
    "thesys": json.dumps({
        "c1_custom_components": {
            "FileUploadZone": FileUploadZoneSchema.model_json_schema()
        }
    })
}


# ── Client factory ─────────────────────────────────────────────────────────────

def get_c1_client():
    """Return an AsyncOpenAI client pointed at the Thesys C1 endpoint."""
    from openai import AsyncOpenAI

    api_key = os.environ.get("THESYS_API_KEY")
    if not api_key:
        raise ValueError("THESYS_API_KEY is not set")

    return AsyncOpenAI(api_key=api_key, base_url=C1_BASE_URL)
