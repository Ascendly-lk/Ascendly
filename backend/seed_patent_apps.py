import asyncio
import os
import sys

# Add backend root to path to resolve "app" module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.supabase_client import get_supabase_client
from datetime import datetime, timedelta, timezone

async def seed():
    client = get_supabase_client()
    now = datetime.now(timezone.utc)
    
    try:
        # Get any client to attach these applications to
        res = client.table("patent_clients").select("id").execute()
        if not res.data:
            print("No clients found in the DB. Attempting to insert a dummy client first.")
            dummy_client = {"name": "Test Firm", "tier": "Startup", "revenue": 500000}
            c_res = client.table("patent_clients").insert(dummy_client).execute()
            client_id = c_res.data[0]["id"]
        else:
            client_id = res.data[0]["id"]
            
        # Let's seed an app for each state the user asked for to inflate the "In Progress", "Pending Review", and "Ready to File" counters.
        t_stamp = int(now.timestamp())
        apps = [
            {
                "id": f"PAT-{t_stamp}-01",
                "client_id": client_id,
                "title": "Quantum Encryption Protocol",
                "type": "Utility",
                "status": "pending_review",
                "progress": 30,
                "due_date": (now + timedelta(days=2)).isoformat(),
                "priority": "urgent",
                "filing_type": "Provisional"
            },
            {
                "id": f"PAT-{t_stamp}-02",
                "client_id": client_id,
                "title": "AI Image Optimization Model",
                "type": "Utility",
                "status": "in_progress",
                "progress": 55,
                "due_date": (now + timedelta(days=10)).isoformat(),
                "priority": "high",
                "filing_type": "Non-Provisional"
            },
            {
                "id": f"PAT-{t_stamp}-03",
                "client_id": client_id,
                "title": "Blockchain Ledgers System",
                "type": "Utility",
                "status": "filing_ready",
                "progress": 95,
                "due_date": (now + timedelta(days=5)).isoformat(),
                "priority": "normal",
                "filing_type": "Provisional"
            }
        ]
        
        for a in apps:
            client.table("patent_applications").insert(a).execute()
            
        print(f"Successfully injected {len(apps)} dummy patent applications!")
    except Exception as e:
        print(f"Error seeding DB: {e}")

if __name__ == "__main__":
    asyncio.run(seed())
