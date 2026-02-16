"""
Analysis API Endpoint — POST /api/analyze
Accepts CSV upload, validates, runs AI pipeline, returns results.
"""
import os
import uuid
import shutil
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from database.supabase_client import insert_record, require_auth
from ai_engine.tasks import run_analysis

router = APIRouter(prefix="/api", tags=["Analysis"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/analyze")
async def analyze_financial_data(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    current_user=Depends(require_auth),
):
    """
    Upload a CSV file and get AI-powered financial analysis.
    Returns historical data, 3-month forecast, and strategic advice.
    """
    # Verify user can only analyze their own data
    if user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden")

    # 1. File type check
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only .csv files are accepted."
        )

    # 2. Read file and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")

    # 3. Save to temp location (basename prevents path traversal)
    temp_dir = tempfile.mkdtemp()
    safe_filename = os.path.basename(file.filename)
    temp_path = os.path.join(temp_dir, safe_filename)
    try:
        with open(temp_path, "wb") as f:
            f.write(contents)
    except Exception:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail="Failed to process uploaded file.")

    # 4. Run the AI analysis pipeline
    try:
        result = run_analysis(temp_path)
    except Exception:
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

    # 5. Save historical data to financial_records
    try:
        for record in result.get("data", {}).get("historical", []):
            insert_record("financial_records", {
                "user_id": user_id,
                "month": record.get("date"),
                "revenue": record.get("revenue"),
                "expenses": record.get("expenses"),
            })
    except Exception:
        pass  # Don't fail the request if DB save fails

    # 6. Save agent logs to ai_logs
    try:
        request_id = result.get("request_id", str(uuid.uuid4()))
        for log in result.get("agent_logs", []):
            insert_record("ai_logs", {
                "request_id": request_id,
                "agent_name": log["agent_name"],
                "tool_output": log.get("output", ""),
                "final_answer": log.get("output", ""),
            })
    except Exception:
        pass  # Don't fail the request if logging fails

    # 7. Remove internal logs from response
    result.pop("agent_logs", None)
    result.pop("request_id", None)

    return result
