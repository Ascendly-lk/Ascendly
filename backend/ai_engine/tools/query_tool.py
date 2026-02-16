"""
Dataset Query Tool for CrewAI
Reads dataset rows from the Supabase data_rows table.
"""
import json
import sys
import os

# Allow imports from backend root when running directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from crewai.tools import tool


@tool("query_dataset")
def query_dataset(dataset_id: str) -> str:
    """
    Load all rows for a dataset from the Supabase database.
    Input: dataset_id (UUID string)
    Output: JSON array of data records from the dataset.
    Example: query_dataset("550e8400-e29b-41d4-a716-446655440000")
    """
    try:
        from database.supabase_client import get_records

        response = get_records("data_rows", {"dataset_id": dataset_id})
        rows = response.data if response and response.data else []

        if not rows:
            return json.dumps({"error": f"No data found for dataset_id={dataset_id}."})

        # Extract the JSONB 'data' field from each row, sorted by row_index
        records = []
        for row in sorted(rows, key=lambda r: r.get("row_index", 0)):
            record = row.get("data", {})
            records.append(record)

        return json.dumps(records)

    except Exception as e:
        return json.dumps({"error": f"Failed to query dataset: {str(e)}"})
