"""
Seed script — loads Startup Dataset.csv into the startup_benchmarks Supabase table.

Run once from the backend/ directory:
    python database/seed_startup_benchmarks.py

Requires:
  - startup_benchmarks table already created (run migrations/create_startup_benchmarks.sql)
  - 'Startup Dataset.csv' in the repo root (one level above backend/)
  - SUPABASE_URL and SUPABASE_SERVICE_KEY set in backend/.env
"""
import os
import re
import csv
import logging
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

# CSV is in repo root, one level above backend/
CSV_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "Startup Dataset.csv",
)

ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
MONEY_RE = re.compile(r"^\$?([\d,.]+)\s*([kmb]?)$", re.IGNORECASE)

VALID_STATUSES = {"Successful", "Failed", "Acquired"}


def parse_money(value: str):
    """Convert '$10M', '$500K', '1,200,000' etc. to a float (USD)."""
    if not value or value.strip() in ("", "N/A", "-"):
        return None
    m = MONEY_RE.match(value.strip().replace(",", ""))
    if not m:
        return None
    amount = float(m.group(1))
    suffix = m.group(2).lower()
    if suffix == "k":
        amount *= 1_000
    elif suffix == "m":
        amount *= 1_000_000
    elif suffix == "b":
        amount *= 1_000_000_000
    return amount


def parse_date(value: str):
    """Return ISO date string or None if invalid."""
    if not value or value.strip() in ("", "N/A", "-"):
        return None
    v = value.strip()
    if ISO_DATE_RE.match(v):
        return v
    return None


def main():
    if not os.path.exists(CSV_PATH):
        log.error("CSV not found at: %s", CSV_PATH)
        sys.exit(1)

    from supabase import create_client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        log.error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
        sys.exit(1)

    client = create_client(url, key)

    rows = []
    skipped = 0

    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):  # row 1 = header
            name = (row.get("Name") or row.get("name") or "").strip()
            if not name:
                log.warning("Row %d: empty name — skipping", i)
                skipped += 1
                continue

            status_raw = (row.get("Current Status") or row.get("current_status") or "").strip()
            status = status_raw if status_raw in VALID_STATUSES else None

            rows.append({
                "name":          name,
                "country":       (row.get("Country") or row.get("country") or "").strip() or None,
                "description":   (row.get("Description") or row.get("description") or "").strip() or None,
                "launch_date":   parse_date(row.get("Launch Date") or row.get("launch_date") or ""),
                "founders":      (row.get("Founders") or row.get("founders") or "").strip() or None,
                "revenue_year1": parse_money(row.get("Revenue Year 1") or row.get("revenue_year1") or ""),
                "revenue_year2": parse_money(row.get("Revenue Year 2") or row.get("revenue_year2") or ""),
                "revenue_year3": parse_money(row.get("Revenue Year 3") or row.get("revenue_year3") or ""),
                "current_status": status,
            })

    if not rows:
        log.error("No valid rows found in CSV.")
        sys.exit(1)

    log.info("Inserting %d rows (%d skipped)...", len(rows), skipped)

    # Insert in batches of 100
    batch_size = 100
    inserted = 0
    for start in range(0, len(rows), batch_size):
        batch = rows[start:start + batch_size]
        result = client.table("startup_benchmarks").insert(batch).execute()
        inserted += len(result.data) if result.data else len(batch)
        log.info("  inserted rows %d–%d", start + 1, start + len(batch))

    log.info("Done. %d rows inserted into startup_benchmarks.", inserted)


if __name__ == "__main__":
    main()
