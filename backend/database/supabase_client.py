"""
Supabase Client - Authentication & CRUD helpers
Profiles table schema (existing):
  id (uuid PK), email, full_name, avatar_url, is_active, created_at, updated_at,
  auth_user_id (added via ALTER TABLE), role (added via ALTER TABLE)
"""
import os
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Service role — bypasses RLS

# Whitelist of tables allowed for CRUD (prevents SQL injection via table names)
ALLOWED_TABLES = {
    "financial_records", "ai_logs", "ai_insights",
    "datasets", "data_rows", "benchmarks", "profiles"
}

supabase: Client = None
supabase_admin: Client = None  # Service-role client for server-side writes


def get_supabase_client() -> Client:
    """Get or create Supabase anon client"""
    global supabase
    if supabase is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase


def get_supabase_admin() -> Client:
    """
    Get or create service-role client (bypasses RLS).
    Falls back to anon key if SUPABASE_SERVICE_KEY is not set.
    """
    global supabase_admin
    if supabase_admin is None:
        key = SUPABASE_SERVICE_KEY or SUPABASE_KEY
        if not SUPABASE_URL or not key:
            raise ValueError("SUPABASE_URL must be set in .env")
        supabase_admin = create_client(SUPABASE_URL, key)
    return supabase_admin


def _validate_table(table: str):
    if table not in ALLOWED_TABLES:
        raise ValueError(f"Invalid table: {table}")


# ============ AUTH HELPERS ============

def sign_up(email: str, password: str):
    """Register a new user in Supabase Auth"""
    client = get_supabase_client()
    return client.auth.sign_up({"email": email, "password": password})


def sign_in(email: str, password: str):
    """Sign in an existing user"""
    client = get_supabase_client()
    return client.auth.sign_in_with_password({"email": email, "password": password})


def sign_out():
    """Sign out the current user"""
    client = get_supabase_client()
    return client.auth.sign_out()


def get_current_user(token: str):
    """Verify JWT token and return Supabase user object"""
    client = get_supabase_client()
    return client.auth.get_user(token)


# ============ PROFILE HELPERS ============

def create_profile(data: dict):
    """
    Insert a new row into the profiles table using the service-role client
    (bypasses RLS since the user has no session yet at registration time).
    """
    admin = get_supabase_admin()
    # Use UPSERT (update if exists) because a Supabase trigger might have already created a blank row
    return admin.table("profiles").upsert(data).execute()


def get_profile_by_auth_id(auth_user_id: str):
    """Fetch a profile row by Supabase auth user ID (auth_user_id column)"""
    admin = get_supabase_admin()
    result = admin.table("profiles").select("*").eq("auth_user_id", auth_user_id).maybe_single().execute()
    return result.data if result else None


# ============ FASTAPI AUTH DEPENDENCY ============

def require_auth(authorization: str = Header(...)):
    """
    FastAPI dependency — validates Bearer token and returns the Supabase user.
    Usage: current_user = Depends(require_auth)
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    token = authorization[7:]
    try:
        client = get_supabase_client()
        response = client.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return response.user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")


# ============ GENERIC CRUD HELPERS ============

def insert_record(table: str, data: dict):
    _validate_table(table)
    client = get_supabase_client()
    return client.table(table).insert(data).execute()


def get_records(table: str, filters: dict = None):
    _validate_table(table)
    client = get_supabase_client()
    query = client.table(table).select("*")
    if filters:
        for key, value in filters.items():
            query = query.eq(key, value)
    return query.execute()


def update_record(table: str, record_id: str, data: dict):
    _validate_table(table)
    client = get_supabase_client()
    return client.table(table).update(data).eq("id", record_id).execute()


def delete_record(table: str, record_id: str):
    _validate_table(table)
    client = get_supabase_client()
    return client.table(table).delete().eq("id", record_id).execute()
