import os
import json
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

def check_data():
    from database.supabase_client import get_supabase_admin
    admin = get_supabase_admin()
    
    out = {}
    
    # Check monthly_revenue data
    try:
        res = admin.table("monthly_revenue").select("*").execute()
        out["monthly_revenue_count"] = len(res.data)
        if res.data:
            out["monthly_revenue_sample"] = res.data[0]
            # Sum up amount for current month
            now = datetime.now(timezone.utc)
            current_month = now.month
            current_year = now.year
            month_sum = sum(float(r["amount"]) for r in res.data if r["revenue_month"] == current_month and r["revenue_year"] == current_year)
            out["monthly_revenue_calculated"] = month_sum
    except Exception as e:
        out["monthly_revenue_error"] = str(e)
        
    # Check engagement_metrics
    try:
        res = admin.table("engagement_metrics").select("*").execute()
        out["engagement_metrics_count"] = len(res.data)
        if len(res.data) > 0:
            out["engagement_metrics_sample"] = res.data[0]
            
            # Count activities in last 30 days
            from datetime import timedelta
            thirty_days_ago = now - timedelta(days=30)
            recent_activities = [r for r in res.data if r.get("activity_date") and datetime.fromisoformat(r["activity_date"].replace('Z', '+00:00')) >= thirty_days_ago]
            out["engagement_metrics_recent_count"] = len(recent_activities)
            
            # Simple score: 10 points per recent activity, max 100
            score = min(len(recent_activities) * 10, 100)
            if score == 0 and len(res.data) > 0:
                score = min(len(res.data) * 5, 100) # fallback
            out["engagement_metrics_calculated"] = score
    except Exception as e:
        out["engagement_metrics_error"] = str(e)
            
    print(json.dumps(out, indent=2))

if __name__ == "__main__":
    check_data()
