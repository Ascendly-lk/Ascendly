import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch 1 row from each to infer columns
print("financial_records:")
print(supabase.table('financial_records').select('*').limit(1).execute().data)

print("\nai_logs:")
print(supabase.table('ai_logs').select('*').limit(1).execute().data)
