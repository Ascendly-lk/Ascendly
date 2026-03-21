"""
Seed script — loads Startup Dataset.csv into Supabase startup_benchmarks table.
Run once from the backend/ directory:
    python database/seed_startup_benchmarks.py
"""

import csv
import logging
import os
import re
import sys

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# Allow running from backend/ dir
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database.supabase_client import get_supabase_admin

CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Startup Dataset.csv")
BATCH_SIZE = 100

_ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def parse_revenue(val: str) -> float | None:
    """Convert $10M / $500k / $0 → float USD. Returns None if unparseable."""
    if not val:
        return None
    val = val.strip().replace("$", "").replace(",", "")
    if val in ("", "0"):
        return 0.0
    try:
        if val.endswith("M"):
            return float(val[:-1]) * 1_000_000
        elif val.endswith("k"):
            return float(val[:-1]) * 1_000
        return float(val)
    except ValueError:
        return None


def parse_date(val: str) -> str | None:
    """Return date string only if it matches YYYY-MM-DD, else None."""
    if not val or not val.strip():
        return None
    val = val.strip()
    return val if _ISO_DATE.match(val) else None


def load_csv(path: str) -> list[dict]:
    rows = []
    skipped = 0
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get("Name", "").strip()
            if not name:
                skipped += 1
                continue  # skip rows with no name — violates NOT NULL constraint
            status = row.get("Current Status", "").strip()
            if status not in ("Successful", "Failed", "Acquired"):
                status = None
            rows.append({
                "name":           name,
                "country":        row.get("Country", "").strip() or None,
                "description":    row.get("Description", "").strip() or None,
                "launch_date":    parse_date(row.get("Launch Date", "")),
                "founders":       row.get("Founders", "").strip() or None,
                "revenue_year1":  parse_revenue(row.get("Revenue Year 1", "")),
                "revenue_year2":  parse_revenue(row.get("Revenue Year 2", "")),
                "revenue_year3":  parse_revenue(row.get("Revenue Year 3", "")),
                "current_status": status,
            })
    if skipped:
        logger.warning("Skipped %d rows with missing name", skipped)
    return rows


def seed():
    logger.info("Reading CSV: %s", CSV_PATH)
    rows = load_csv(CSV_PATH)
    logger.info("Loaded %d rows", len(rows))

    client = get_supabase_admin()

    # Clear existing data
    client.table("startup_benchmarks").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    logger.info("Cleared existing rows")

    inserted = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        client.table("startup_benchmarks").insert(batch).execute()
        inserted += len(batch)
        logger.info("Inserted %d/%d...", inserted, len(rows))

    logger.info("Done. %d rows seeded into startup_benchmarks.", inserted)


if __name__ == "__main__":
    seed()
