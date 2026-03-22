import urllib.request
import json
import time

URL = "https://wjxotkseeuodkvfedszq.supabase.co/rest/v1"
KEY = "sb_publishable_r4qkWdkw8pLnxe4pFzRUoA_Bg_XG1cv"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# 1. Fetch a client
req = urllib.request.Request(f"{URL}/patent_clients?select=id&limit=1", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        clients = json.loads(response.read())
except Exception as e:
    clients = []

if not clients:
    # insert a client
    c_data = json.dumps([{"name": "Rest Firm", "tier": "Startup", "revenue": 100000}]).encode("utf-8")
    req = urllib.request.Request(f"{URL}/patent_clients", data=c_data, headers=headers, method="POST")
    with urllib.request.urlopen(req) as res:
        clients = json.loads(res.read())

client_id = clients[0]["id"]
now_ts = int(time.time())

apps = [
    {
        "client_id": client_id,
        "title": "Rest Protocol Injection",
        "type": "Utility",
        "status": "pending_review",
        "progress": 30,
        "priority": "urgent",
        "filing_type": "Provisional"
    },
    {
        "client_id": client_id,
        "title": "Quantum REST Processor",
        "type": "Utility",
        "status": "in_progress",
        "progress": 50,
        "priority": "normal",
        "filing_type": "Non-Provisional"
    },
    {
        "client_id": client_id,
        "title": "Neural Net Compression",
        "type": "Utility",
        "status": "filing_ready",
        "progress": 95,
        "priority": "high",
        "filing_type": "Provisional"
    }
]

app_data = json.dumps(apps).encode("utf-8")
req2 = urllib.request.Request(f"{URL}/patent_applications", data=app_data, headers=headers, method="POST")
try:
    with urllib.request.urlopen(req2) as r2:
        print("Success:", r2.status)
        print("Inserted 3 applications into Supabase!")
except Exception as e:
    print("Error inserting apps:", e)
