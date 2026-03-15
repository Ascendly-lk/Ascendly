import os
from dotenv import load_dotenv

load_dotenv()

def debug_queries():
    try:
        from database.supabase_client import get_supabase_admin
        admin = get_supabase_admin()
        
        print("--- Active Users Query ---")
        res = admin.table("profiles").select("id", count="exact").eq("is_active", True).execute()
        print(f"res: {res}")
        print(f"res.count: {res.count}")
        print(f"res.data: {res.data}")
        print(f"len data: {len(res.data)}")
        
        print("--- Total Users Query ---")
        res_total = admin.table("profiles").select("id", count="exact").execute()
        print(f"res_total: {res_total}")
        print(f"res_total.count: {res_total.count}")
        print(f"res_total.data: {res_total.data}")
        
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_queries()
