import os
from dotenv import load_dotenv
from database.supabase_client import get_supabase_admin
from fastapi.testclient import TestClient
from main import app, get_dashboard_metrics
import asyncio

load_dotenv()

async def test():
    # Attempt to run the exact calculation from main.py
    try:
        metrics = await get_dashboard_metrics()
        print("Success!", metrics)
    except Exception as e:
        print("Failed!", str(e))

if __name__ == "__main__":
    asyncio.run(test())
