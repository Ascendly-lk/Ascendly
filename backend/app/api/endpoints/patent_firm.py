from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from database.supabase_client import require_auth, get_supabase_client

router = APIRouter(prefix="/api/patent-firm", tags=["Patent Firm"])

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user=Depends(require_auth)):
    """
    Fetch aggregated stats for the Patent Firm dashboard.
    """
    client = get_supabase_client()
    try:
        # 1. Active Applications
        apps_res = client.table("patent_applications").select("id", count="exact").eq("status", "Expert Review").execute()
        active_apps_count = apps_res.count if apps_res.count is not None else len(apps_res.data)

        # 2. Total Clients
        clients_res = client.table("patent_clients").select("id", count="exact").execute()
        total_clients_count = clients_res.count if clients_res.count is not None else len(clients_res.data)

        # 3. Pending Reviews
        pending_res = client.table("patent_applications").select("id", count="exact").eq("status", "Pending Review").execute()
        pending_count = pending_res.count if pending_res.count is not None else len(pending_res.data)

        # 4. Revenue (Mock for now, or sum from clients)
        revenue_res = client.table("patent_clients").select("revenue").execute()
        total_revenue = sum(float(c["revenue"]) for c in (revenue_res.data or []))

        return {
            "active_applications": active_apps_count,
            "total_clients": total_clients_count,
            "pending_reviews": pending_count,
            "revenue_mtd": f"${total_revenue/1000:.1f}K",
            "revenue_growth": "+12%"
        }
    except Exception as e:
        # Fallback to mock data if tables don't exist yet or other error
        print(f"Error fetching stats: {e}")
        return {
            "active_applications": 18,
            "total_clients": 42,
            "pending_reviews": 7,
            "revenue_mtd": "$85K",
            "revenue_growth": "+12%"
        }

@router.get("/dashboard/activity")
async def get_recent_activity(current_user=Depends(require_auth)):
    """
    Fetch recent activity logs for the dashboard.
    """
    client = get_supabase_client()
    try:
        res = client.table("patent_firm_activity").select("*").order("created_at", desc=True).limit(5).execute()
        if not res.data:
            raise ValueError("No activity found")
        return res.data
    except Exception:
        # Fallback mock data
        return [
            {"title": "New application submitted by TechCo AI", "client_name": "TechCo AI", "time_ago": "2 hours ago", "type": "submission"},
            {"title": "Completed novelty assessment for IoT Innovations", "client_name": "IoT Innovations", "time_ago": "5 hours ago", "type": "completion"},
            {"title": "Scheduled consultation with DataFlow Inc", "client_name": "DataFlow Inc", "time_ago": "1 day ago", "type": "scheduling"}
        ]

@router.get("/applications")
async def get_applications(
    current_user=Depends(require_auth),
    status: str = Query(None),
    client_name: str = Query(None)
):
    """
    List all patent applications with optional filtering.
    """
    client = get_supabase_client()
    try:
        query = client.table("patent_applications").select("*")
        if status:
            query = query.eq("status", status)
        if client_name:
            query = query.ilike("client", f"%{client_name}%")
        
        res = query.order("last_updated", desc=True).execute()
        if not res.data:
            raise ValueError("No data")
        return res.data
    except Exception:
        # Fallback mock data
        return [
            { "id": "PAT-2026-001", "title": "AI-Powered Task Automation Engine", "client": "TechCo AI", "type": "Software", "status": "Expert Review", "progress": 60, "lastUpdated": "March 3, 2026", "assignedTo": "You", "tier": "Tier 3", "filingType": "Non-Provisional", "priority": "high" },
            { "id": "PAT-2026-002", "title": "Smart IoT Sensor Hardware Design", "client": "IoT Innovations", "type": "Hardware", "status": "Drafting", "progress": 30, "lastUpdated": "March 5, 2026", "assignedTo": "Michael Rodriguez", "tier": "Tier 2", "filingType": "Provisional", "priority": "normal" },
            { "id": "PAT-2026-003", "title": "Blockchain Data Verification System", "client": "DataFlow Inc", "type": "Software", "status": "Filing", "progress": 85, "lastUpdated": "March 4, 2026", "assignedTo": "Emily Watson", "tier": "Tier 2", "filingType": "Non-Provisional", "priority": "normal" },
            { "id": "PAT-2026-004", "title": "Gene Editing Mechanism", "client": "BioTech Labs", "type": "Biotechnology", "status": "Pending Review", "progress": 10, "lastUpdated": "March 6, 2026", "assignedTo": "Unassigned", "tier": "Tier 3", "filingType": "Non-Provisional", "priority": "urgent" }
        ]

@router.get("/clients")
async def get_clients(current_user=Depends(require_auth)):
    """
    List all patent firm clients.
    """
    client = get_supabase_client()
    try:
        res = client.table("patent_clients").select("*").order("name").execute()
        if not res.data:
             raise ValueError("No data")
        return res.data
    except Exception:
        # Fallback mock data
        return [
            { "id": "CL-001", "name": "TechCo AI", "industry": "Artificial Intelligence", "tier": "Tier 3", "activeApplications": 3, "revenue": "$14,997", "since": "Jan 2025", "status": "Active", "logo": "TA" },
            { "id": "CL-002", "name": "IoT Innovations", "industry": "Hardware / IoT", "tier": "Tier 2", "activeApplications": 2, "revenue": "$3,998", "since": "Feb 2025", "status": "Active", "logo": "II" },
            { "id": "CL-003", "name": "DataFlow Inc", "industry": "Data Analytics", "tier": "Tier 2", "activeApplications": 1, "revenue": "$1,999", "since": "Mar 2026", "status": "Active", "logo": "DF" }
        ]
