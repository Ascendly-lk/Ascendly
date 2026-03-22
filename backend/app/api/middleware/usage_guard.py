"""
Usage Guard — enforces per-tier monthly limits on analyses and chat queries.

Usage:
    await check_usage_limit(user_id, "analysis")
    await check_usage_limit(user_id, "chat")

Raises HTTPException(429) with a structured payload when the limit is reached.
"""
from datetime import datetime, timezone
from fastapi import HTTPException
from cachetools import TTLCache
from database.supabase_client import get_supabase_admin

# Hardcoded fallback — used only when DB is unavailable.
# subscription_tiers table is the authoritative source of truth.
_FALLBACK_LIMITS = {
    "free":    {"analysis": 3,   "chat": 10},
    "starter": {"analysis": 10,  "chat": 50},
    "pro":     {"analysis": -1,  "chat": -1},
}

# Keep TIER_LIMITS exported for backward-compat imports in other modules
TIER_LIMITS = _FALLBACK_LIMITS

DEFAULT_TIER = "free"

# Cache tier limits from DB for 5 minutes to avoid per-request DB calls
_limits_cache: TTLCache = TTLCache(maxsize=1, ttl=300)


def _load_tier_limits(admin) -> dict:
    """
    Fetch tier limits from subscription_tiers table.
    Falls back to _FALLBACK_LIMITS on error.
    Cached for 5 minutes so pricing and enforcement share one source of truth.
    """
    cached = _limits_cache.get("limits")
    if cached is not None:
        return cached

    try:
        res = admin.table("subscription_tiers").select(
            "id,analyses_per_month,chat_queries_per_month"
        ).execute()
        if res.data:
            loaded = {
                row["id"]: {
                    "analysis": row["analyses_per_month"],
                    "chat": row["chat_queries_per_month"],
                }
                for row in res.data
            }
            _limits_cache["limits"] = loaded
            return loaded
    except Exception as e:
        print(f"[usage_guard] Failed to load tier limits from DB, using fallback: {e}")

    return _FALLBACK_LIMITS


def _get_profile(admin, user_id: str) -> dict:
    res = admin.table("profiles").select(
        "subscription_tier,billing_period_start"
    ).eq("id", user_id).single().execute()
    return res.data or {}


def _count_usage(admin, user_id: str, action: str, since: str) -> int:
    """Count ai_logs rows for this user since billing period start.

    agent_name values (set by chat.py):
      "chat-quick"    → quick chat queries
      "chat-analysis" → full CrewAI analysis pipeline
    """
    query = (
        admin.table("ai_logs")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .gte("created_at", since)
    )
    if action == "analysis":
        query = query.eq("agent_name", "chat-analysis")
    else:
        query = query.eq("agent_name", "chat-quick")

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

    tier_limits = _load_tier_limits(admin)
    limits = tier_limits.get(tier, tier_limits.get(DEFAULT_TIER, _FALLBACK_LIMITS[DEFAULT_TIER]))
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
