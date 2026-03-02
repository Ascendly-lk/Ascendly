"""
Ascendly MVP - FastAPI Backend
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db, get_supabase_client
from database.supabase_client import sign_up, sign_in, sign_out, require_auth
from app.api.endpoints.analysis import router as analysis_router
from app.api.endpoints.dashboard import router as dashboard_router
from app.api.endpoints.chat import router as chat_router
from app.api.insights import router as insights_router

app = FastAPI(
    title="Ascendly API",
    description="AI-powered SaaS platform",
    version="1.0.0",
)

# CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
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

class UserAuth(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    message: str


# ============ HEALTH CHECK ============

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Ascendly API"}


@app.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    """Check database connection"""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============ AUTH ENDPOINTS ============

@app.post("/auth/signup", response_model=UserResponse)
async def register(user: UserAuth):
    """Register a new user"""
    try:
        response = sign_up(user.email, user.password)
        if response.user:
            return UserResponse(
                id=str(response.user.id),
                email=response.user.email,
                message="User created successfully. Check email for verification.",
            )
        raise HTTPException(status_code=400, detail="Registration failed")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Registration failed. Please try again.")


@app.post("/auth/signin")
async def login(user: UserAuth):
    """Sign in existing user"""
    try:
        response = sign_in(user.email, user.password)
        if response.user:
            return {
                "user": {
                    "id": str(response.user.id),
                    "email": response.user.email,
                },
                "access_token": response.session.access_token,
                "token_type": "bearer",
            }
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.post("/auth/signout")
async def logout():
    """Sign out current user"""
    try:
        sign_out()
        return {"message": "Signed out successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Sign out failed. Please try again.")


# ============ RUN SERVER ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
