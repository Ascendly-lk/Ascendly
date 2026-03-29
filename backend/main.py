"""
Ascendly MVP - FastAPI Backend
Profiles table: id, email, full_name, avatar_url, is_active, created_at, updated_at,
                auth_user_id (added), role (added)
"""
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db, get_supabase_client
from database.supabase_client import (
    sign_up, sign_in, sign_out, require_auth,
    create_profile, get_profile_by_auth_id
)
from app.api.endpoints.analysis import router as analysis_router
from app.api.endpoints.dashboard import router as dashboard_router
from app.api.endpoints.chat import router as chat_router
from app.api.insights import router as insights_router
<<<<<<< HEAD
from app.api.endpoints.patent_firm import router as patent_firm_router
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)

app = FastAPI(
    title="Ascendly API",
    description="AI-powered SaaS platform",
    version="1.0.0",
)

<<<<<<< HEAD
# CORS — allow Vite frontend dev server (port 5173, etc)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$",
=======
# CORS — allow Vite frontend dev server (port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
>>>>>>> parent of ae17c912 (Update by deleting some files)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ ROUTERS ============
app.include_router(analysis_router)
app.include_router(dashboard_router)
app.include_router(chat_router)
app.include_router(insights_router)
<<<<<<< HEAD
app.include_router(patent_firm_router)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)


# ============ SCHEMAS ============

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfileCompleteRequest(BaseModel):
    first_name: str
    last_name: str
    role: str


# ============ HEALTH CHECK ============

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Ascendly API"}


@app.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============ AUTH ENDPOINTS ============

@app.post("/auth/signup", status_code=201)
async def register(payload: RegisterRequest):
    """
    Register a new user:
    1. Create Supabase Auth user
    2. Insert row into existing profiles table (auth_user_id, email, full_name, role)
    """
    valid_roles = {"Startup Founder", "Investor", "Marketing Agency", "Business Advisor", "Admin"}
    if payload.role not in valid_roles:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid role. Choose from: {', '.join(valid_roles)}"
        )

    # Step 1: Create Supabase Auth user
    try:
        auth_response = sign_up(payload.email, payload.password)
    except Exception as e:
        err = str(e).lower()
        if "already registered" in err or "already exists" in err or "email" in err:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        raise HTTPException(status_code=400, detail="Registration failed. Please try again.")

    if not auth_response.user:
        raise HTTPException(status_code=400, detail="Registration failed. Please try again.")

    auth_user_id = str(auth_response.user.id)
    # Combine first + last name into full_name to match existing 'full_name' column
    full_name = f"{payload.first_name.strip()} {payload.last_name.strip()}".strip()

    # Step 2: Upsert into existing profiles table
    try:
        create_profile({
            "id": auth_user_id,               # Matches the PK created by the Supabase Auth trigger
            "auth_user_id": auth_user_id,     # new column (see ALTER TABLE SQL)
            "email": payload.email,
            "full_name": full_name,            # existing column
            "role": payload.role,              # new column (see ALTER TABLE SQL)
            "is_active": True,                 # existing column
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        print("PROFILE CREATION ERROR:", str(e))
        err_str = str(e).lower()
        if "duplicate key" in err_str or "already exists" in err_str:
            raise HTTPException(
                status_code=409,
                detail="This email is already registered. Please log in."
            )
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while setting up your profile. Please try again."
        )

    return {
        "id": auth_user_id,
        "email": payload.email,
        "message": "Account created successfully.",
    }


def safe_update_activity(auth_user_id: str, profile_data: dict):
    from database.supabase_client import update_profile
    try:
        update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
        if profile_data:
            if "login_count" in profile_data:
                current_count = profile_data.get("login_count")
                update_data["login_count"] = (current_count if isinstance(current_count, int) else 0) + 1
            else:
                print("[METRICS DEBUG] 'login_count' field missing in profile data.")
            
            # Using 'last_login_at' as expected by metrics if present
            if "last_login_at" in profile_data:
                update_data["last_login_at"] = datetime.now(timezone.utc).isoformat()
            else:
                print("[METRICS DEBUG] 'last_login_at' field missing in profile data.")
                
        print(f"[METRICS DEBUG] Updating profile {auth_user_id} with: {update_data}")
        update_profile(auth_user_id, update_data)
    except Exception as e:
        print(f"[METRICS DEBUG] Failed to update activity for {auth_user_id}: {str(e)}")


@app.post("/auth/signin")
async def login(payload: LoginRequest):
    """
    Sign in an existing user.
    Returns access token + user info including role from profiles table.
    """
    try:
        auth_response = sign_in(payload.email, payload.password)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not auth_response.user or not auth_response.session:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    auth_user_id = str(auth_response.user.id)
    access_token = auth_response.session.access_token

    # Fetch profile to get full_name and role (non-fatal if missing)
    try:
        profile = get_profile_by_auth_id(auth_user_id)
    except Exception as e:
        print(f"[login] Profile fetch failed: {e}")
        profile = None

    # Safe activity update (fire and forget)
    safe_update_activity(auth_user_id, profile)

    # Split full_name back into first/last for the frontend
    full_name = profile.get("full_name", "") if profile else ""
    name_parts = full_name.split(" ", 1) if full_name else ["", ""]

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": auth_user_id,
            "email": auth_response.user.email,
            "full_name": full_name,
            "first_name": name_parts[0],
            "last_name": name_parts[1] if len(name_parts) > 1 else "",
            "role": profile.get("role") if profile else None,
            "is_active": profile.get("is_active") if profile else True,
            "onboarding_completed": bool(profile and profile.get("role")),
        },
    }


@app.post("/auth/signout")
async def logout():
    """Sign out current user"""
    try:
        sign_out()
        return {"message": "Signed out successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Sign out failed. Please try again.")


@app.get("/auth/me")
async def get_me(current_user=Depends(require_auth)):
    """
    Protected endpoint — returns current user's profile.
    Automatically provisions/syncs the profile if it was created via Google OAuth.
    Requires: Authorization: Bearer <token>
    """
    auth_user_id = str(current_user.id)
    profile = get_profile_by_auth_id(auth_user_id)
    is_newly_synced = False
    
    # If using Google Auth, a bare profile might have been created by the DB trigger
    # but without a role or name. Let's pre-fill the name from Google Metadata if present.
    if profile is None or (not profile.get("full_name") and current_user.user_metadata):
        metadata = current_user.user_metadata or {}
        # Pre-fill name and avatar if provided by Google
        full_name = metadata.get("name") or metadata.get("full_name") or ""
        avatar_url = metadata.get("avatar_url") or metadata.get("picture") or ""
        
        upsert_data = {
            "id": auth_user_id,
            "auth_user_id": auth_user_id,
            "email": current_user.email,
            "full_name": full_name,
            "avatar_url": avatar_url,
            "is_active": True
        }
        
        # Merge existing profile keys so we don't accidentally erase roles
        if profile:
            upsert_data.update({
                "role": profile.get("role"),
            })
        else:
            upsert_data["created_at"] = datetime.now(timezone.utc).isoformat()
            
        try:
<<<<<<< HEAD
            print(f"[get_me] Syncing profile for {auth_user_id} ({current_user.email})")
            create_profile(upsert_data)
        except Exception as e:
            print(f"[get_me] Profile sync FAILED for {auth_user_id}: {str(e)}")
            # `profile` holds the record fetched before the sync attempt.
            # If it was None the user has no existing profile row, so a sync
            # failure is fatal — raise immediately.  If a profile already existed,
            # the user can still log in with that record.
            if not profile:
                raise HTTPException(status_code=500, detail=f"Profile synchronization failed: {str(e)}")
=======
            create_profile(upsert_data)
        except Exception:
            pass # Suppress issues if the trigger already handles portions of this seamlessly
>>>>>>> parent of ae17c912 (Update by deleting some files)
            
        profile = get_profile_by_auth_id(auth_user_id)
        is_newly_synced = True

    if not profile:
<<<<<<< HEAD
        print(f"[get_me] Profile NOT FOUND in DB for auth_id: {auth_user_id}")
        raise HTTPException(status_code=404, detail="Profile not found in our database. Please try registering again.")
=======
        raise HTTPException(status_code=404, detail="Profile not found.")
>>>>>>> parent of ae17c912 (Update by deleting some files)

    full_name = profile.get("full_name", "")
    name_parts = full_name.split(" ", 1) if full_name else ["", ""]
    
    # Onboarding is done if the user has selected a valid role
    onboarding_completed = bool(profile.get("role"))

    return {
        "id": auth_user_id,
        "email": current_user.email,
        "full_name": full_name,
        "first_name": name_parts[0],
        "last_name": name_parts[1] if len(name_parts) > 1 else "",
        "role": profile.get("role"),
        "avatar_url": profile.get("avatar_url"),
        "is_active": profile.get("is_active"),
        "created_at": profile.get("created_at"),
        "onboarding_completed": onboarding_completed,
        "provider": current_user.app_metadata.get("provider", "email") if hasattr(current_user, "app_metadata") else "email"
    }


@app.post("/auth/profile/complete")
async def complete_profile(payload: ProfileCompleteRequest, current_user=Depends(require_auth)):
    """
    Called after Google Signup/Signin if the onboarding_completed flag is false.
    Assigns the newly onboarded user their role.
    """
    valid_roles = {"Startup Founder", "Investor", "Marketing Agency", "Business Advisor", "Admin"}
    if payload.role not in valid_roles:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid role. Choose from: {', '.join(valid_roles)}"
        )
        
    auth_user_id = str(current_user.id)
    full_name = f"{payload.first_name.strip()} {payload.last_name.strip()}".strip()
    
    from database.supabase_client import update_profile
    try:
        update_profile(auth_user_id, {
            "full_name": full_name,
            "role": payload.role,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to complete profile. Try again.")
        
    return {
        "message": "Profile complete",
        "onboarding_completed": True,
        "role": payload.role
    }


@app.get("/dashboard/user-count")
async def get_user_count(current_user=Depends(require_auth)):
    """Fetch the total count of registered users from the profiles table."""
    from database.supabase_client import get_supabase_admin
    admin = get_supabase_admin()
    try:
        # Fetch the count efficiently using count='exact' and head=True to avoid returning data
        res = admin.table("profiles").select("id", count="exact", head=True).execute()
        user_count = res.count if res.count is not None else 0
        print(f"[DEBUG] User count fetched: {user_count}")
        return {"user_count": user_count}
    except Exception as e:
        print(f"[ERROR] Failed to fetch user count: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching user count.")


@app.get("/dashboard/metrics")
async def get_dashboard_metrics(current_user=Depends(require_auth)):
    from database.supabase_client import get_supabase_admin
    admin = get_supabase_admin()
    
    # 1. Active Users (Showing total user count as requested for dashboard)
    active_users = 0
    total_users = 0
    try:
        # Fetch the total count efficiently for "Active users" card
        res_total = admin.table("profiles").select("id", count="exact", head=True).execute()
        total_users = res_total.count if res_total.count is not None else 0
        active_users = total_users  # Show total count as active users in dashboard
        
        print(f"[METRICS DEBUG] Queried 'profiles'. total_count={total_users}")
    except Exception as e:
        print(f"[METRICS DEBUG] Error fetching users from 'profiles': {e}")
        pass

<<<<<<< HEAD
    now = datetime.now(timezone.utc)

    # 2. Monthly Revenue — sum `amount` from `monthly_revenue` for current month + year.
    #    If no rows exist for the current month, fall back to the most recent month with data.
    monthly_revenue = 0.0
    try:
        # We query the monthly_revenue table
        res_rev = admin.table("monthly_revenue").select("amount,revenue_month,revenue_year").execute()
        if res_rev.data:
            # Check for current month first
            current_month_data = [r for r in res_rev.data if r.get("revenue_month") == now.month and r.get("revenue_year") == now.year]
            if current_month_data:
                monthly_revenue = sum(float(r.get("amount", 0) or 0) for r in current_month_data)
                print(f"[METRICS DEBUG] Monthly revenue (current month): {monthly_revenue}")
            else:
                # No data for current month, aggregate total as fallback / test
                monthly_revenue = sum(float(r.get("amount", 0) or 0) for r in res_rev.data)
                print(f"[METRICS DEBUG] Monthly revenue (fallback aggregate): {monthly_revenue}")
        else:
            print("[METRICS DEBUG] monthly_revenue table is empty.")
    except Exception as e:
        print(f"[METRICS DEBUG] Error fetching monthly_revenue: {e}")

    # 3. Engagement Score — from `ai_logs` (last 30 days)
    engagement_score = 0
    try:
        from datetime import timedelta
        thirty_days_ago = (now - timedelta(days=30)).isoformat()
        res_eng = admin.table("ai_logs").select("created_at") \
            .gte("created_at", thirty_days_ago) \
            .execute()
        recent = len(res_eng.data) if res_eng.data else 0
        if recent > 0:
            engagement_score = min(recent * 10, 100)
        else:
            # fallback: use all-time count (5 pts each, max 100)
            res_all = admin.table("ai_logs").select("id", count="exact", head=True).execute()
            if res_all.count:
                engagement_score = min(res_all.count * 5, 100)
        print(f"[METRICS DEBUG] Engagement score: {engagement_score} (recent_activities={recent})")
    except Exception as e:
        print(f"[METRICS DEBUG] Error fetching ai_logs: {e}")

    # 4. Growth — compare current-month vs previous-month signups in `profiles`.`created_at`
    growth = 0
    try:
        current_month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc).isoformat()
        last_month = now.month - 1 if now.month > 1 else 12
        last_year = now.year if now.month > 1 else now.year - 1
        last_month_start = datetime(last_year, last_month, 1, tzinfo=timezone.utc).isoformat()

        cur_res = admin.table("profiles").select("id", count="exact", head=True) \
            .gte("created_at", current_month_start).execute()
        cur_signups = cur_res.count or 0

        prev_res = admin.table("profiles").select("id", count="exact", head=True) \
            .gte("created_at", last_month_start).lt("created_at", current_month_start).execute()
        prev_signups = prev_res.count or 0

        if prev_signups > 0:
            growth = round(((cur_signups - prev_signups) / prev_signups) * 100, 1)
        elif cur_signups > 0:
            growth = 100.0  # first-month baseline: no prior data means 100% growth
        print(f"[METRICS DEBUG] Growth: {growth}% (this_month={cur_signups}, last_month={prev_signups})")
    except Exception as e:
        print(f"[METRICS DEBUG] Error calculating growth from 'profiles': {e}")
=======
    # 2. Monthly Revenue (Defaulting to 0 since no payments table exists yet)
    monthly_revenue = 0

    # 3. Engagement Score
    engagement_score = 0
    if total_users > 0:
        engagement_score = min(int((active_users / total_users) * 100), 100)
    
    # 4. Growth (Defaulting to simple logic to prevent crashing)
    # Ideally compare this month's registrants with last month
    growth = 0
    try:
        now = datetime.now(timezone.utc)
        current_month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc).isoformat()
        
        last_month = now.month - 1 if now.month > 1 else 12
        last_year = now.year if now.month > 1 else now.year - 1
        last_month_start = datetime(last_year, last_month, 1, tzinfo=timezone.utc).isoformat()
        
        current_month_res = admin.table("profiles").select("id", count="exact").gte("created_at", current_month_start).execute()
        current_month_signups = current_month_res.count if current_month_res.count is not None else len(current_month_res.data)

        last_month_res = admin.table("profiles").select("id", count="exact").gte("created_at", last_month_start).lt("created_at", current_month_start).execute()
        last_month_signups = last_month_res.count if last_month_res.count is not None else len(last_month_res.data)
        
        if last_month_signups > 0:
            growth = round(((current_month_signups - last_month_signups) / last_month_signups) * 100, 1)
        elif current_month_signups > 0:
            growth = 100.0  # arbitrary representation for first month growth
            
        print(f"[METRICS DEBUG] Growth calculated: current_month={current_month_signups}, last_month={last_month_signups}, growth={growth}%")
    except Exception as e:
        print(f"[METRICS DEBUG] Error calculating growth from 'profiles': {e}")
        pass
>>>>>>> parent of ae17c912 (Update by deleting some files)

    return {
        "active_users": active_users,
        "monthly_revenue": monthly_revenue,
        "engagement_score": engagement_score,
        "growth": growth
    }


# ============ RUN SERVER ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
