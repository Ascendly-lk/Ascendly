import os
from dotenv import load_dotenv

load_dotenv()

from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

try:
    print("Attempting to create a test user to capture the database trigger error...")
    response = supabase.auth.admin.create_user({
        "email": "test_google_trigger_debug@example.com",
        "password": "Password123!",
        "email_confirm": True,
        "user_metadata": {
            "name": "Test Google User",
            "avatar_url": "https://example.com/avatar.jpg"
        }
    })
    print("User created successfully (unexpected!):")
    print(response.user)
except Exception as e:
    print(f"FAILED with Exception: {type(e).__name__}")
    print(f"Error details: {e}")
