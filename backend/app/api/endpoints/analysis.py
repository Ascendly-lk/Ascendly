"""
Analysis API Endpoints — file upload, analysis, and file listing.
"""
import os
import io
import json
import uuid
import shutil
import tempfile
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Query
import pandas as pd
from database.supabase_client import insert_record, get_records, require_auth, get_supabase_client, get_supabase_admin
from ai_engine.tasks import run_analysis

# File types that can be parsed into tabular data
PARSEABLE_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json"}

router = APIRouter(prefix="/api", tags=["Analysis"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json", ".pdf", ".txt"}
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "uploads")


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


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user=Depends(require_auth),
):
    """
    Upload a dataset file (CSV, XLSX, XLS, JSON, PDF, TXT). Max 50MB.
    Saves file to disk and metadata to uploaded_files table.
    """
    user_id = str(current_user.id)

    # 1. Validate file extension
    safe_filename = os.path.basename(file.filename)
    _, ext = os.path.splitext(safe_filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 2. Read and check size
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")

    # 3. Save file to uploads directory
    file_id = str(uuid.uuid4())
    stored_filename = f"{file_id}{ext.lower()}"
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    file_path = os.path.join(UPLOADS_DIR, stored_filename)

    try:
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save uploaded file.")

    # 4. Save metadata to uploaded_files table.
    # Uses admin client (service role key) to bypass RLS.
    # Requires SUPABASE_SERVICE_KEY to be set — falls back to anon key if missing,
    # which will be blocked by RLS policies.
    now = datetime.now(timezone.utc).isoformat()
    file_status = "uploaded"
    try:
        get_supabase_admin().table("uploaded_files").insert({
            "id": file_id,
            "user_id": user_id,
            "filename": safe_filename,
            "file_size": len(contents),
            "file_type": ext.lower().lstrip("."),
            "status": file_status,
            "uploaded_at": now,
        }).execute()
    except Exception as e:
        os.remove(file_path)
        print(f"[upload] Failed to save file metadata: {e}")
        raise HTTPException(status_code=500, detail="Failed to save file metadata. Please try again.")

    # 5. Parse tabular files and store rows in data_rows for agent pipeline
    if ext.lower() in PARSEABLE_EXTENSIONS:
        try:
            df = _parse_file_to_dataframe(contents, ext.lower())
            if df is not None and not df.empty:
                client = get_supabase_admin()
                rows_to_insert = []
                for idx, row in df.iterrows():
                    row_data = {}
                    for col in df.columns:
                        val = row[col]
                        # Convert pandas types to JSON-safe Python types
                        if pd.isna(val):
                            row_data[col] = None
                        elif hasattr(val, 'isoformat'):
                            row_data[col] = val.isoformat()
                        else:
                            row_data[col] = val if isinstance(val, (str, int, float, bool)) else str(val)
                    rows_to_insert.append({
                        "dataset_id": file_id,
                        "row_index": int(idx),
                        "data": row_data,
                    })

                # Batch insert (chunks of 100 to avoid payload limits)
                for i in range(0, len(rows_to_insert), 100):
                    batch = rows_to_insert[i:i + 100]
                    client.table("data_rows").insert(batch).execute()

                file_status = "processed"
                get_supabase_admin().table("uploaded_files").update({"status": "processed"}).eq("id", file_id).execute()
        except Exception:
            pass  # Don't fail upload if parsing fails — file is still saved

    return {
        "file_id": file_id,
        "filename": safe_filename,
        "size_bytes": len(contents),
        "uploaded_at": now,
        "status": file_status,
    }


def _parse_file_to_dataframe(contents: bytes, ext: str):
    """Parse file bytes into a pandas DataFrame based on extension."""
    try:
        buf = io.BytesIO(contents)
        if ext == ".csv":
            return pd.read_csv(buf)
        elif ext in (".xlsx", ".xls"):
            return pd.read_excel(buf)
        elif ext == ".json":
            text = contents.decode("utf-8")
            data = json.loads(text)
            if isinstance(data, list):
                return pd.DataFrame(data)
            elif isinstance(data, dict):
                return pd.DataFrame([data])
        return None
    except Exception:
        return None


@router.get("/files/recent")
async def get_recent_files(
    current_user=Depends(require_auth),
    limit: int = Query(default=10, le=50),
):
    """
    Get the current user's recently uploaded files, newest first.
    """
    user_id = str(current_user.id)

    try:
        client = get_supabase_client()
        response = (
            client.table("uploaded_files")
            .select("id, filename, file_size, file_type, status, uploaded_at")
            .eq("user_id", user_id)
            .order("uploaded_at", desc=True)
            .limit(limit)
            .execute()
        )
        files = [
            {
                "file_id": row["id"],
                "name": row["filename"],
                "size_bytes": row.get("file_size", 0),
                "file_type": row.get("file_type", ""),
                "status": row.get("status", "uploaded"),
                "uploaded_at": row.get("uploaded_at", ""),
            }
            for row in (response.data or [])
        ]
        return {"files": files, "count": len(files)}
    except Exception:
        return {"files": [], "count": 0}
