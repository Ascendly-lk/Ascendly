from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

def verify_active_status():
    try:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        supabase: Client = create_client(url, key)
        
        # Total count
        total_res = supabase.table("profiles").select("id", count="exact", head=True).execute()
        total_count = total_res.count
        
        # Active count
        active_res = supabase.table("profiles").select("id", count="exact", head=True).eq("is_active", True).execute()
        active_count = active_res.count
        
        print(f"Total Users: {total_count}")
        print(f"Active Users (is_active=True): {active_count}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_active_status()
