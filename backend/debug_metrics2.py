import os
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

def debug_metrics():
    try:
        from database.supabase_client import get_supabase_admin
        admin = get_supabase_admin()
        
        # 1. Active Users
        active_users = 0
        total_users = 0
        try:
            res = admin.table("profiles").select("id", count="exact").eq("is_active", True).execute()
            print(f"res.data: {res.data}, res.count: {res.count}")
            active_users = res.count if res.count is not None else len(res.data)
            
            res_total = admin.table("profiles").select("id", count="exact").execute()
            total_users = res_total.count if res_total.count is not None else len(res_total.data)
        except Exception as e:
            print(f"Error fetching users: {e}")
            
        print(f"Active: {active_users}, Total: {total_users}")

        # 3. Engagement Score
        engagement_score = 0
        if total_users > 0:
            engagement_score = min(int((active_users / total_users) * 100), 100)
            
        print(f"Engagement: {engagement_score}")

        # 4. Growth
        growth = 0
        try:
            now = datetime.now(timezone.utc)
            current_month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc).isoformat()
            
            last_month = now.month - 1 if now.month > 1 else 12
            last_year = now.year if now.month > 1 else now.year - 1
            last_month_start = datetime(last_year, last_month, 1, tzinfo=timezone.utc).isoformat()
            
            current_month_res = admin.table("profiles").select("id", count="exact").gte("created_at", current_month_start).execute()
            current_month_signups = current_month_res.count if current_month_res.count is not None else len(current_month_res.data)

            last_month_res = admin.table("profiles").select("id", count="exact").gte("created_at", last_month_start).lt("created_at", current_month_start).execute()
            last_month_signups = last_month_res.count if last_month_res.count is not None else len(last_month_res.data)
            
            if last_month_signups > 0:
                growth = round(((current_month_signups - last_month_signups) / last_month_signups) * 100, 1)
            elif current_month_signups > 0:
                growth = 100.0  # arbitrary representation for first month growth
        except Exception as e:
            print(f"Error calculating growth: {e}")
            
        print(f"Growth: {growth}")

    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_metrics()
