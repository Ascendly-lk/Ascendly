"""
Supabase Client - Use for Authentication & Simple CRUD operations
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = None


def get_supabase_client() -> Client:
    """Get or create Supabase client instance"""
    global supabase
    if supabase is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase


# ============ AUTH HELPERS ============

async def sign_up(email: str, password: str):
    """Register a new user"""
    client = get_supabase_client()
    response = client.auth.sign_up({"email": email, "password": password})
    return response


async def sign_in(email: str, password: str):
    """Sign in existing user"""
    client = get_supabase_client()
    response = client.auth.sign_in_with_password({"email": email, "password": password})
    return response


async def sign_out():
    """Sign out current user"""
    client = get_supabase_client()
    response = client.auth.sign_out()
    return response


async def get_current_user():
    """Get currently authenticated user"""
    client = get_supabase_client()
    response = client.auth.get_user()
    return response


# ============ CRUD HELPERS ============

def insert_record(table: str, data: dict):
    """Insert a record into a table"""
    client = get_supabase_client()
    return client.table(table).insert(data).execute()


def get_records(table: str, filters: dict = None):
    """Get records from a table with optional filters"""
    client = get_supabase_client()
    query = client.table(table).select("*")
    if filters:
        for key, value in filters.items():
            query = query.eq(key, value)
    return query.execute()


def update_record(table: str, record_id: str, data: dict):
    """Update a record by ID"""
    client = get_supabase_client()
    return client.table(table).update(data).eq("id", record_id).execute()


def delete_record(table: str, record_id: str):
    """Delete a record by ID"""
    client = get_supabase_client()
    return client.table(table).delete().eq("id", record_id).execute()
