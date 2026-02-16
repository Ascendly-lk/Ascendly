"""
Analysis API Endpoint — POST /api/analyze
Accepts CSV upload, validates, runs AI pipeline, returns results.
"""
import os
import uuid
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database.supabase_client import insert_record
from ai_engine.tasks import run_analysis

router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post("/analyze")
async def analyze_financial_data(
    file: UploadFile = File(...),
    user_id: str = Form(...),
):
    """
    Upload a CSV file and get AI-powered financial analysis.
    Returns historical data, 3-month forecast, and strategic advice.
    """
    # --- Input Validation ---

    # 1. File type check
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only .csv files are accepted."
        )

    # 2. Save uploaded file to temp location
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    try:
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # 3. Run the AI analysis pipeline
    try:
        result = run_analysis(temp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)

    # 4. Save historical data to financial_records
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

    # 5. Save agent logs to ai_logs
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

    # 6. Remove internal logs from response
    result.pop("agent_logs", None)
    result.pop("request_id", None)

    return result
