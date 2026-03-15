import os
import json
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
    
    out = {}
    for table in tables:
        try:
            res = admin.table(table).select("*").limit(1).execute()
            if res.data:
                out[table] = list(res.data[0].keys())
            else:
                out[table] = "empty"
        except Exception as e:
            out[table] = f"error: {str(e)}"
            
    print(json.dumps(out, indent=2))

if __name__ == "__main__":
    check_tables()
