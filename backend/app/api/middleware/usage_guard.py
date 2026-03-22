"""
Usage Guard — enforces per-tier monthly limits on analyses and chat queries.

Usage:
    await check_usage_limit(user_id, "analysis")
    await check_usage_limit(user_id, "chat")

Raises HTTPException(429) with a structured payload when the limit is reached.
"""
from datetime import datetime, timezone
from fastapi import HTTPException
from database.supabase_client import get_supabase_admin

# Tier limits: -1 = unlimited
TIER_LIMITS = {
    "free":    {"analysis": 3,   "chat": 10},
    "starter": {"analysis": 10,  "chat": 50},
    "pro":     {"analysis": -1,  "chat": -1},
}

DEFAULT_TIER = "free"


def _get_profile(admin, user_id: str) -> dict:
    res = admin.table("profiles").select(
        "subscription_tier,billing_period_start"
    ).eq("id", user_id).single().execute()
    return res.data or {}


def _count_usage(admin, user_id: str, action: str, since: str) -> int:
    """Count ai_logs rows for this user since billing period start."""
    # action maps: "analysis" → agent_name contains "analyst"/"forecaster"/"strategist"
    #              "chat"     → agent_name = "quick_chat"
    query = (
        admin.table("ai_logs")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .gte("created_at", since)
    )
    if action == "analysis":
        # Any of the pipeline agents indicates one analysis step — count distinct sessions
        # Simpler: count rows where agent_name != 'quick_chat'
        query = query.neq("agent_name", "quick_chat")
    else:
        query = query.eq("agent_name", "quick_chat")

    res = query.execute()
    return res.count or 0


async def check_usage_limit(user_id: str, action: str) -> None:
    """
    Check if the user has exceeded their monthly limit for the given action.
    action: "analysis" or "chat"
    Raises HTTPException(429) if limit reached.
    """
    admin = get_supabase_admin()

    profile = _get_profile(admin, user_id)
    tier = profile.get("subscription_tier") or DEFAULT_TIER
    billing_start = profile.get("billing_period_start")

    limits = TIER_LIMITS.get(tier, TIER_LIMITS[DEFAULT_TIER])
    limit = limits.get(action, 0)

    # Unlimited tier — skip check
    if limit == -1:
        return

    # Default billing start to beginning of current month if missing
    if not billing_start:
        now = datetime.now(timezone.utc)
        billing_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc).isoformat()

    used = _count_usage(admin, user_id, action, billing_start)

    if used >= limit:
        raise HTTPException(
            status_code=429,
            detail={
                "code": "LIMIT_REACHED",
                "action": action,
                "tier": tier,
                "used": used,
                "limit": limit,
            },
        )
