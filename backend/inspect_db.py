import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor()

print("--- Triggers on auth.users ---")
cur.execute("""
    SELECT tgname, proname, prosrc 
    FROM pg_trigger 
    JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
    JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid 
    WHERE relname = 'users';
""")
for row in cur.fetchall():
    print(f"Trigger Name: {row[0]}")
    print(f"Function Name: {row[1]}")
    print(f"Source:\n{row[2]}\n")

print("--- Profiles Table Constraints / Columns ---")
cur.execute("""
    SELECT column_name, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND table_schema = 'public';
""")
for row in cur.fetchall():
    print(row)

cur.close()
conn.close()
