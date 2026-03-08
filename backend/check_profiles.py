import os
from dotenv import load_dotenv

load_dotenv()

from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

with open("db_dump.txt", "w") as f:
    f.write("--- PROFILES ---\n")
    response = supabase.table("profiles").select("id, email, auth_user_id").execute()
    for p in response.data:
        f.write(str(p) + "\n")

    f.write("\n--- AUTH USERS ---\n")
    auth_users = supabase.auth.admin.list_users()
    for u in auth_users:
        f.write(f"ID: {u.id}, Email: {u.email}\n")
