"""
AI-powered tier suggestion endpoint.
GET /api/subscription/suggest

Analyses the user's last 30 days of usage and recommends an upgrade tier
using a lightweight GPT-4o call.
"""
import json
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from database.supabase_client import require_auth, get_supabase_admin
from app.api.middleware.usage_guard import _load_tier_limits, _count_usage
from ai_engine.provider import get_litellm_params
import litellm

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])

SUGGESTION_PROMPT = """You are a business advisor for Ascendly, an AI analytics platform for startups.

A user has the following usage in the last 30 days:
- Current tier: {tier}
- Analyses run: {analysis_used} (limit: {analysis_limit})
- Chat queries: {chat_used} (limit: {chat_limit})

Available tiers:
- free: 3 analyses/month, 10 chat queries/month — $0
- starter: 10 analyses/month, 50 chat queries/month — $29/month
- pro: unlimited analyses, unlimited chat — $79/month

Based on this usage, respond with a JSON object (no markdown, pure JSON):
{{
  "suggested_tier": "<free|starter|pro>",
  "reason": "<one sentence explaining why, mention specific numbers>"
}}

Rules:
- If usage is below 50% of current limits → suggest same tier or lower
- If usage is 70%+ of current limits → suggest next tier up
- Be direct and specific about the numbers
"""


@router.get("/suggest")
async def suggest_tier(current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    user_id = str(current_user.id)

    profile_res = admin.table("profiles").select(
        "subscription_tier,billing_period_start"
    ).eq("id", user_id).single().execute()

    profile = profile_res.data or {}
    tier = profile.get("subscription_tier") or "free"

    now = datetime.now(timezone.utc)
    thirty_days_ago = (now - timedelta(days=30)).isoformat()

    limits = _load_tier_limits(admin).get(tier, _load_tier_limits(admin).get("free", {"analysis": 3, "chat": 10}))
    analysis_used = _count_usage(admin, user_id, "analysis", thirty_days_ago)
    chat_used = _count_usage(admin, user_id, "chat", thirty_days_ago)

    analysis_limit = limits["analysis"] if limits["analysis"] != -1 else "unlimited"
    chat_limit = limits["chat"] if limits["chat"] != -1 else "unlimited"

    prompt = SUGGESTION_PROMPT.format(
        tier=tier,
        analysis_used=analysis_used,
        analysis_limit=analysis_limit,
        chat_used=chat_used,
        chat_limit=chat_limit,
    )

    try:
        params = get_litellm_params()
        response = await litellm.acompletion(
            model=params["model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.3,
            **{k: v for k, v in params.items() if k != "model"},
        )
        raw = response.choices[0].message.content.strip()
        result = json.loads(raw)
        suggested_tier = result.get("suggested_tier", tier)
        reason = result.get("reason", "Your current plan looks appropriate for your usage.")
    except Exception as e:
        print(f"[tier_suggestion] LLM call failed: {e}")
        # Fallback: simple rule-based suggestion
        suggested_tier = tier
        reason = f"You've used {analysis_used} analyses and {chat_used} chat queries recently."

        a_limit = limits["analysis"]
        c_limit = limits["chat"]

        if a_limit != -1 and analysis_used >= a_limit * 0.7:
            tiers = ["free", "starter", "pro"]
            idx = tiers.index(tier) if tier in tiers else 0
            if idx < len(tiers) - 1:
                suggested_tier = tiers[idx + 1]
                reason = f"You're using {analysis_used}/{a_limit} analyses — upgrading would give you more room."
        elif c_limit != -1 and chat_used >= c_limit * 0.7:
            tiers = ["free", "starter", "pro"]
            idx = tiers.index(tier) if tier in tiers else 0
            if idx < len(tiers) - 1:
                suggested_tier = tiers[idx + 1]
                reason = f"You're using {chat_used}/{c_limit} chat queries — upgrading would give you more room."

    return {
        "current_tier": tier,
        "suggested_tier": suggested_tier,
        "reason": reason,
        "usage": {
            "analyses": {"used": analysis_used, "limit": analysis_limit},
            "chat_queries": {"used": chat_used, "limit": chat_limit},
        },
    }
