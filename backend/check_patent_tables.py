import os
import sys
from dotenv import load_dotenv

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.supabase_client import get_supabase_client

def check_tables():
    client = get_supabase_client()
    tables = ["patent_clients", "patent_applications", "patent_firm_activity"]
    
    for table in tables:
        try:
            res = client.table(table).select("count", count="exact").limit(1).execute()
            print(f"Table '{table}' exists. Count: {res.count}")
        except Exception as e:
            print(f"Table '{table}' might NOT exist or error: {e}")

if __name__ == "__main__":
    check_tables()
