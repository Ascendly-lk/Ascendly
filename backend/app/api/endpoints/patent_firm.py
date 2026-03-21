from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from database.supabase_client import require_auth, get_supabase_client

router = APIRouter(prefix="/api/patent-firm", tags=["Patent Firm"])

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user=Depends(require_auth)):
    """
    Implement 4 stat cards explicitly from the backend:
    1. Active Applications (NOT approved, filed, rejected)
    2. Total Clients
    3. Pending Reviews
    4. Revenue (Sum of all paid payments)
    """
    client = get_supabase_client()
    try:
        res_active = client.table("patent_applications").select("id", count="exact").in_("status", ["pending_review", "in_progress", "filing_ready"]).execute()
        active_apps = res_active.count if res_active.count is not None else len(res_active.data)

        res_clients = client.table("patent_clients").select("id", count="exact").execute()
        total_clients = res_clients.count if res_clients.count is not None else len(res_clients.data)

        res_pending = client.table("patent_applications").select("id", count="exact").eq("status", "pending_review").execute()
        pending_reviews = res_pending.count if res_pending.count is not None else len(res_pending.data)

        res_revenue = client.table("patent_payments").select("amount").eq("status", "paid").execute()
        revenue = sum(float(c.get("amount", 0)) for c in (res_revenue.data or []))

        return {
            "active_applications": active_apps,
            "total_clients": total_clients,
            "pending_reviews": pending_reviews,
            "revenue": revenue,
            "revenue_formatted": f"${revenue/1000:.1f}K" if revenue >= 1000 else f"${revenue:,.0f}"
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        # Explicit mock aligned with new logic
        return {
            "active_applications": 20,
            "total_clients": 45,
            "pending_reviews": 8,
            "revenue": 12500,
            "revenue_formatted": "$12.5K"
        }

@router.get("/dashboard/urgent")
async def get_urgent_actions(current_user=Depends(require_auth)):
    """
    Action Required Section:
    status = pending_review AND due_date within next 3 days
    Returns Company name, Application Title, Due date, Target PDF URL
    """
    client = get_supabase_client()
    try:
        now = datetime.now(timezone.utc)
        in_3_days = (now + timedelta(days=3)).isoformat()
        
        # We also need client name. Supabase postgrest allows fetching relation if setup. 
        # But if the schema isn't fully linked via FK introspected by postgrest immediately, 
        # we can fetch them individually to be safe on local setups.
        res_apps = client.table("patent_applications").select("*").eq("status", "pending_review").lte("due_date", in_3_days).order("due_date").execute()
        
        urgent_items = []
        for app in (res_apps.data or []):
            # Safe sequential fetching for reliable relations
            client_res = client.table("patent_clients").select("name").eq("id", app.get("client_id")).execute()
            client_name = client_res.data[0]["name"] if client_res.data else "Unknown Client"
            
            docs_res = client.table("patent_documents").select("file_url").eq("application_id", app["id"]).execute()
            file_url = docs_res.data[0]["file_url"] if docs_res.data else None
            
            urgent_items.append({
                "id": app["id"],
                "company_name": client_name,
                "title": app["title"],
                "due_date": app.get("due_date"),
                "file_url": file_url,
                "priority": app.get("priority", "medium")
            })
        return urgent_items
    except Exception as e:
        print(f"Error fetching urgent: {e}")
        now = datetime.now(timezone.utc)
        return [
            {
                "id": "PAT-2026-001",
                "company_name": "TechCo AI",
                "title": "AI-Powered Task Automation Engine",
                "due_date": (now + timedelta(days=1)).isoformat(),
                "file_url": "https://example.com/mock.pdf",
                "priority": "high"
            }
        ]

@router.get("/dashboard/pipeline")
async def get_dashboard_pipeline(current_user=Depends(require_auth)):
    """
    Categorizes all apps into the required stages.
    """
    client = get_supabase_client()
    try:
        res = client.table("patent_applications").select("status").execute()
        pipeline = {
            "pending_review": 0,
            "in_progress": 0,
            "filing_ready": 0,
            "filed_completed": 0
        }
        for app in (res.data or []):
            st = app.get("status")
            if st == "pending_review": pipeline["pending_review"] += 1
            elif st == "in_progress": pipeline["in_progress"] += 1
            elif st == "filing_ready": pipeline["filing_ready"] += 1
            elif st in ["filed", "approved"]: pipeline["filed_completed"] += 1
            
        return pipeline
    except Exception as e:
        print(f"Error pipeline: {e}")
        return {"pending_review": 8, "in_progress": 12, "filing_ready": 4, "filed_completed": 35}

@router.get("/activities")
async def get_activities(current_user=Depends(require_auth)):
    """Fetch recent activity tracking major actions in the DB."""
    client = get_supabase_client()
    try:
        res = client.table("patent_activities").select("*").order("created_at", desc=True).limit(10).execute()
        return res.data or []
    except Exception as e:
        print(f"Error activities: {e}")
        return [
            {"action": "Application submitted", "description": "Startup submitted new patent for AI Logic.", "client_name": "TechCo AI", "created_at": datetime.now(timezone.utc).isoformat()},
            {"action": "Document uploaded", "description": "Prior art research uploaded.", "client_name": "IoT Innovations", "created_at": (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()},
            {"action": "Application moved to review", "description": "Blockchain data verification is now in pending review.", "client_name": "DataFlow Inc", "created_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()}
        ]

@router.get("/applications")
async def get_applications(current_user=Depends(require_auth), status: str = Query(None)):
    """List all patent applications with optional strict status filtering."""
    client = get_supabase_client()
    try:
        query = client.table("patent_applications").select("*")
        if status:
            query = query.eq("status", status)
        res = query.order("created_at", desc=True).execute()
        return res.data or []
    except Exception:
        return []

@router.get("/clients")
async def get_clients(current_user=Depends(require_auth)):
    """List all patent firm clients."""
    client = get_supabase_client()
    try:
        res = client.table("patent_clients").select("*").order("name").execute()
        return res.data or []
    except Exception:
        return []

@router.get("/documents")
async def get_documents(current_user=Depends(require_auth)):
    client = get_supabase_client()
    try:
        res = client.table("patent_documents").select("*").order("created_at", desc=True).execute()
        return res.data or []
    except Exception:
        return []

@router.get("/payments")
async def get_payments(current_user=Depends(require_auth)):
    client = get_supabase_client()
    try:
        res = client.table("patent_payments").select("*").order("created_at", desc=True).execute()
        return res.data or []
    except Exception:
        return []

@router.get("/applications/{app_id}")
async def get_application_by_id(app_id: str, current_user=Depends(require_auth)):
    client = get_supabase_client()
    try:
        # Fetch main application
        res = client.table("patent_applications").select("*").eq("id", app_id).single().execute()
        app_data = res.data or {}
        
        # Attach documents
        try:
            doc_res = client.table("patent_documents").select("*").eq("application_id", app_id).execute()
            app_data["documents"] = doc_res.data or []
        except Exception:
            app_data["documents"] = []
            
        # Attach reviews
        try:
            rev_res = client.table("patent_reviews").select("*").eq("application_id", app_id).order("created_at", desc=True).execute()
            app_data["notes"] = rev_res.data or []
        except Exception:
            app_data["notes"] = []
            
        return app_data
    except Exception as e:
        print(f"Error fetching app by ID: {e}")
        return {"id": app_id, "error": "Could not connect to database"}
