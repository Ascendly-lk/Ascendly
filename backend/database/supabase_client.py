"""
Supabase Client - Use for Authentication & Simple CRUD operations
"""
import os
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Whitelist of tables allowed for CRUD operations (prevents SQL injection via table names)
ALLOWED_TABLES = {
    "financial_records", "ai_logs", "ai_insights",
    "datasets", "data_rows", "benchmarks", "profiles"
}

supabase: Client = None


def get_supabase_client() -> Client:
    """Get or create Supabase client instance"""
    global supabase
    if supabase is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase


def _validate_table(table: str):
    if table not in ALLOWED_TABLES:
        raise ValueError(f"Invalid table: {table}")


# ============ AUTH HELPERS ============

def sign_up(email: str, password: str):
    """Register a new user"""
    client = get_supabase_client()
    return client.auth.sign_up({"email": email, "password": password})


def sign_in(email: str, password: str):
    """Sign in existing user"""
    client = get_supabase_client()
    return client.auth.sign_in_with_password({"email": email, "password": password})


def sign_out():
    """Sign out current user"""
    client = get_supabase_client()
    return client.auth.sign_out()


def get_current_user(token: str):
    """Verify JWT token and return user"""
    client = get_supabase_client()
    return client.auth.get_user(token)


# ============ FASTAPI AUTH DEPENDENCY ============

def require_auth(authorization: str = Header(...)):
    """FastAPI dependency — validates Bearer token and returns the authenticated user."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
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


# ============ CRUD HELPERS ============

def insert_record(table: str, data: dict):
    """Insert a record into a table"""
    _validate_table(table)
    client = get_supabase_client()
    return client.table(table).insert(data).execute()


def get_records(table: str, filters: dict = None):
    """Get records from a table with optional filters"""
    _validate_table(table)
    client = get_supabase_client()
    query = client.table(table).select("*")
    if filters:
        for key, value in filters.items():
            query = query.eq(key, value)
    return query.execute()


def update_record(table: str, record_id: str, data: dict):
    """Update a record by ID"""
    _validate_table(table)
    client = get_supabase_client()
    return client.table(table).update(data).eq("id", record_id).execute()


def delete_record(table: str, record_id: str):
    """Delete a record by ID"""
    _validate_table(table)
    client = get_supabase_client()
    return client.table(table).delete().eq("id", record_id).execute()
