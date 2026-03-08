import os
from dotenv import load_dotenv

load_dotenv()

from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

print("Fetching profiles and auth users...")

# Get all auth users
auth_users = supabase.auth.admin.list_users()
auth_user_ids = {u.id for u in auth_users}

# Get all profiles
profiles = supabase.table("profiles").select("id, email").execute()

orphans = [p for p in profiles.data if p["id"] not in auth_user_ids]

print(f"Found {len(orphans)} orphaned profiles.")
for orphan in orphans:
    print(f"Deleting orphaned profile: {orphan['email']} (ID: {orphan['id']})")
    try:
        supabase.table("profiles").delete().eq("id", orphan["id"]).execute()
        print(f"Successfully deleted {orphan['email']}")
    except Exception as e:
        print(f"Failed to delete {orphan['email']}: {e}")

print("Cleanup complete.")
