from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

def verify_query():
    try:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        supabase: Client = create_client(url, key)
        
        # This is the logic used in the endpoint
        res = supabase.table("profiles").select("id", count="exact", head=True).execute()
        user_count = res.count if res.count is not None else 0
        
        print(f"Query Result Count: {user_count}")
        print(f"Data length: {len(res.data)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_query()
