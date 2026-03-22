-- Startup Benchmarks Table
-- Seeded from Startup Dataset.csv (1050 rows)
-- Used by benchmark_tool.py Layer 2 (local lookup before ADK agents)

-- Ensure gen_random_uuid() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS startup_benchmarks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    country         TEXT,
    description     TEXT,
    launch_date     DATE,
    founders        TEXT,
    revenue_year1   NUMERIC,   -- USD
    revenue_year2   NUMERIC,
    revenue_year3   NUMERIC,
    current_status  TEXT CHECK (current_status IN ('Successful', 'Failed', 'Acquired')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for benchmark queries
CREATE INDEX IF NOT EXISTS idx_startup_benchmarks_country  ON startup_benchmarks (country);
CREATE INDEX IF NOT EXISTS idx_startup_benchmarks_status   ON startup_benchmarks (current_status);
CREATE INDEX IF NOT EXISTS idx_startup_benchmarks_revenue3 ON startup_benchmarks (revenue_year3);
