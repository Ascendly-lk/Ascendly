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

app = FastAPI(
    title="Ascendly API",
    description="AI-powered SaaS platform",
    version="1.0.0",
)

# CORS — allow Vite frontend dev server (port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ ROUTERS ============
app.include_router(analysis_router)
app.include_router(dashboard_router)
app.include_router(chat_router)
app.include_router(insights_router)


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

    # Step 2: Insert into existing profiles table
    try:
        create_profile({
            "auth_user_id": auth_user_id,     # new column (see ALTER TABLE SQL)
            "email": payload.email,
            "full_name": full_name,            # existing column
            "role": payload.role,              # new column (see ALTER TABLE SQL)
            "is_active": True,                 # existing column
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        print("PROFILE CREATION ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Account created but profile setup failed. Please contact support. Error: " + str(e)
        )

    return {
        "id": auth_user_id,
        "email": payload.email,
        "message": "Account created successfully.",
    }


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

    # Fetch profile to get full_name and role
    profile = get_profile_by_auth_id(auth_user_id)

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
    Requires: Authorization: Bearer <token>
    """
    auth_user_id = str(current_user.id)
    profile = get_profile_by_auth_id(auth_user_id)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    full_name = profile.get("full_name", "")
    name_parts = full_name.split(" ", 1) if full_name else ["", ""]

    return {
        "id": auth_user_id,
        "email": current_user.email,
        "full_name": full_name,
        "first_name": name_parts[0],
        "last_name": name_parts[1] if len(name_parts) > 1 else "",
        "role": profile.get("role"),
        "is_active": profile.get("is_active"),
        "created_at": profile.get("created_at"),
    }


# ============ RUN SERVER ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
