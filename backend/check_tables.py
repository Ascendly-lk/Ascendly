import os
from dotenv import load_dotenv

load_dotenv()

def check_tables():
    from database.supabase_client import get_supabase_admin
    admin = get_supabase_admin()
    
    tables = [
        "monthly_revenue",
        "financial_records",
        "engagement_metrics",
        "user_activity_logs",
        "profiles"
    ]
    
    for table in tables:
        print(f"\n--- Checking table: {table} ---")
        try:
            res = admin.table(table).select("*").limit(1).execute()
            if res.data:
                print(f"Columns: {list(res.data[0].keys())}")
                print(f"Row 1: {res.data[0]}")
            else:
                print("Table exists but is empty.")
        except Exception as e:
            print(f"Error querying {table}: {e}")

if __name__ == "__main__":
    check_tables()
