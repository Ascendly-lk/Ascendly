"""
Dashboard API Endpoints — metrics and analytics activity chart data.
"""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from database.supabase_client import require_auth, get_supabase_client

router = APIRouter(prefix="/api", tags=["Dashboard"])

MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def _format_bytes(size_bytes: int) -> str:
    """Convert bytes to human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 ** 2:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 ** 3:
        return f"{size_bytes / (1024 ** 2):.1f} MB"
    else:
        return f"{size_bytes / (1024 ** 3):.1f} GB"


def _calc_change(current: float, previous: float) -> float:
    """Calculate percentage change between two values."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)


@router.get("/dashboard/metrics")
async def get_dashboard_metrics(current_user=Depends(require_auth)):
    """
    Aggregated dashboard stats: files uploaded, AI queries,
    data processed, and active reports.
    """
    user_id = str(current_user.id)
    client = get_supabase_client()
    now = datetime.now(timezone.utc)
    thirty_days_ago = (now - timedelta(days=30)).isoformat()
    sixty_days_ago = (now - timedelta(days=60)).isoformat()

    def _safe_query(table, select, user_id):
        """Query a table safely — returns [] if table doesn't exist."""
        try:
            res = client.table(table).select(select).eq("user_id", user_id).execute()
            return res.data or []
        except Exception:
            return []

    all_data = _safe_query("uploaded_files", "id, file_size, uploaded_at", user_id)

    current_files = [f for f in all_data if f.get("uploaded_at", "") >= thirty_days_ago]
    previous_files = [f for f in all_data if sixty_days_ago <= f.get("uploaded_at", "") < thirty_days_ago]

    total_files = len(all_data)
    files_change = _calc_change(len(current_files), len(previous_files))

    total_bytes = sum(f.get("file_size", 0) or 0 for f in all_data)
    current_bytes = sum(f.get("file_size", 0) or 0 for f in current_files)
    previous_bytes = sum(f.get("file_size", 0) or 0 for f in previous_files)
    data_change = _calc_change(current_bytes, previous_bytes)

    all_logs_data = _safe_query("ai_logs", "id, created_at", user_id)
    total_queries = len(all_logs_data)
    current_queries = [l for l in all_logs_data if l.get("created_at", "") >= thirty_days_ago]
    previous_queries = [l for l in all_logs_data if sixty_days_ago <= l.get("created_at", "") < thirty_days_ago]
    queries_change = _calc_change(len(current_queries), len(previous_queries))

    all_insights_data = _safe_query("ai_insights", "id, created_at", user_id)
    total_reports = len(all_insights_data)
    current_reports = [r for r in all_insights_data if r.get("created_at", "") >= thirty_days_ago]
    previous_reports = [r for r in all_insights_data if sixty_days_ago <= r.get("created_at", "") < thirty_days_ago]
    reports_change = _calc_change(len(current_reports), len(previous_reports))

    return {
        "files_uploaded": {"value": total_files, "change_percent": files_change},
        "ai_queries": {"value": total_queries, "change_percent": queries_change},
        "data_processed": {"value": _format_bytes(total_bytes), "change_percent": data_change},
        "active_reports": {"value": total_reports, "change_percent": reports_change},
    }


@router.get("/analytics/activity")
async def get_analytics_activity(
    current_user=Depends(require_auth),
    period: str = Query(default="monthly", pattern="^(monthly|yearly)$"),
):
    """
    Chart data for AI analytics activity, grouped by month or year.
    Returns labels and data arrays for the frontend chart component.
    """
    user_id = str(current_user.id)
    client = get_supabase_client()
    now = datetime.now(timezone.utc)

    try:
        # Fetch financial records for revenue-based chart
        try:
            records = (
                client.table("financial_records")
                .select("month, revenue")
                .eq("user_id", user_id)
                .execute()
            )
            data = records.data or []
        except Exception:
            data = []

        if period == "monthly":
            # Group by month for the current year
            monthly = {i: 0.0 for i in range(1, 13)}
            for row in data:
                try:
                    date_str = row.get("month", "")
                    if date_str:
                        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                        if dt.year == now.year:
                            monthly[dt.month] += float(row.get("revenue", 0))
                except (ValueError, TypeError):
                    continue

            labels = MONTH_LABELS
            values = [round(monthly[i], 2) for i in range(1, 13)]
            total = round(sum(values), 2)

            # Normalize to percentages (for bar heights) if there's data
            max_val = max(values) if max(values) > 0 else 1
            heights = [round((v / max_val) * 100, 1) for v in values]

        else:  # yearly
            current_year = now.year
            years = list(range(current_year - 5, current_year + 1))
            yearly = {y: 0.0 for y in years}
            for row in data:
                try:
                    date_str = row.get("month", "")
                    if date_str:
                        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                        if dt.year in yearly:
                            yearly[dt.year] += float(row.get("revenue", 0))
                except (ValueError, TypeError):
                    continue

            labels = [str(y) for y in years]
            values = [round(yearly[y], 2) for y in years]
            total = round(sum(values), 2)

            max_val = max(values) if max(values) > 0 else 1
            heights = [round((v / max_val) * 100, 1) for v in values]

        return {
            "period": period,
            "labels": labels,
            "data": heights,
            "values": values,
            "total_value": total,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activity data: {str(e)}")
