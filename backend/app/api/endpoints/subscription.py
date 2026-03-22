"""
Subscription endpoints:
  GET  /api/subscription/status   — current user tier + usage
  GET  /api/subscription/pricing  — all tiers from subscription_tiers table
  POST /api/subscription/upgrade  — placeholder (academic demo)
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database.supabase_client import require_auth, get_supabase_admin
from app.api.middleware.usage_guard import _load_tier_limits, _count_usage

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])


@router.get("/status")
async def get_subscription_status(current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    user_id = str(current_user.id)

    profile_res = admin.table("profiles").select(
        "subscription_tier,billing_period_start"
    ).eq("id", user_id).single().execute()

    profile = profile_res.data or {}
    tier = profile.get("subscription_tier") or "free"

    now = datetime.now(timezone.utc)
    billing_start = profile.get("billing_period_start") or datetime(
        now.year, now.month, 1, tzinfo=timezone.utc
    ).isoformat()

    tier_limits = _load_tier_limits(admin)
    limits = tier_limits.get(tier, tier_limits.get("free", {"analysis": 3, "chat": 10}))
    analysis_used = _count_usage(admin, user_id, "analysis", billing_start)
    chat_used = _count_usage(admin, user_id, "chat", billing_start)

    return {
        "tier": tier,
        "billing_period_start": billing_start,
        "usage": {
            "analyses": {
                "used": analysis_used,
                "limit": limits["analysis"],
            },
            "chat_queries": {
                "used": chat_used,
                "limit": limits["chat"],
            },
        },
    }


@router.get("/pricing")
async def get_pricing():
    """Returns all subscription tiers. No auth required — shown on upgrade modal."""
    admin = get_supabase_admin()
    res = admin.table("subscription_tiers").select("*").order("price_monthly").execute()
    if not res.data:
        raise HTTPException(status_code=503, detail="Pricing data unavailable")
    return {"tiers": res.data}


class UpgradeRequest(BaseModel):
    tier_id: str


@router.post("/upgrade")
async def upgrade_subscription(payload: UpgradeRequest, current_user=Depends(require_auth)):
    """
    Demo-mode upgrade endpoint.
    In a real app this would integrate with Stripe.
    """
    return {
        "status": "demo",
        "tier_id": payload.tier_id,
        "message": f"Payment integration coming soon. Contact us to upgrade to {payload.tier_id}.",
    }
