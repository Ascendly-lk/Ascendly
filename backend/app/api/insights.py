"""
AI Insights API
POST /api/datasets/{dataset_id}/analyze  — trigger CrewAI analysis on a stored dataset
GET  /api/datasets/{dataset_id}/insights — retrieve saved insights for a dataset
GET  /api/insights/{insight_id}          — get a single insight
"""
import uuid
from fastapi import APIRouter, HTTPException
from database.supabase_client import get_records, insert_record, update_record
from ai_engine.crew import run_dataset_analysis

router = APIRouter(prefix="/api", tags=["Insights"])


@router.post("/datasets/{dataset_id}/analyze")
async def analyze_dataset(dataset_id: str):
    """
    Trigger CrewAI analysis on a dataset stored in Supabase.
    Saves results to the ai_insights table and returns them.
    """
    # Verify the dataset exists
    try:
        ds_response = get_records("datasets", {"id": dataset_id})
        if not ds_response.data:
            raise HTTPException(status_code=404, detail=f"Dataset {dataset_id} not found.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Run the AI pipeline
    try:
        result = run_dataset_analysis(dataset_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    if result.get("status") != "success":
        raise HTTPException(status_code=500, detail="Analysis did not complete successfully.")

    data = result.get("data", {})
    request_id = result.get("request_id", str(uuid.uuid4()))

    # Save each insight type to ai_insights table
    saved_insights = []
    insight_types = [
        ("summary",        "Data Summary",          data.get("historical")),
        ("trend",          "Revenue Forecast",       data.get("forecast")),
        ("recommendation", "Strategic Advice",       data.get("strategic_advice")),
    ]

    for insight_type, title, content_data in insight_types:
        if not content_data:
            continue
        try:
            record = insert_record("ai_insights", {
                "dataset_id": dataset_id,
                "insight_type": insight_type,
                "title": title,
                "content": str(content_data),
                "metadata": {
                    "model_used": result.get("metadata", {}).get("model_used"),
                    "processing_time_ms": result.get("metadata", {}).get("processing_time_ms"),
                    "request_id": request_id,
                },
                "status": "completed",
            })
            if record.data:
                saved_insights.append(record.data[0])
        except Exception:
            pass  # Don't fail the whole request if saving one insight fails

    # Save agent logs
    try:
        for log in result.get("agent_logs", []):
            insert_record("ai_logs", {
                "request_id": request_id,
                "agent_name": log["agent_name"],
                "tool_output": log.get("output", ""),
                "final_answer": log.get("output", ""),
            })
    except Exception:
        pass

    return {
        "status": "success",
        "dataset_id": dataset_id,
        "metadata": result.get("metadata"),
        "data": data,
        "insights_saved": len(saved_insights),
    }


@router.get("/datasets/{dataset_id}/insights")
async def get_dataset_insights(dataset_id: str):
    """
    Retrieve all saved AI insights for a dataset.
    """
    try:
        response = get_records("ai_insights", {"dataset_id": dataset_id})
        insights = response.data if response and response.data else []
        return {"dataset_id": dataset_id, "insights": insights, "count": len(insights)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch insights: {str(e)}")


@router.get("/insights/{insight_id}")
async def get_insight(insight_id: str):
    """
    Retrieve a single insight by its ID.
    """
    try:
        response = get_records("ai_insights", {"id": insight_id})
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Insight {insight_id} not found.")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch insight: {str(e)}")
