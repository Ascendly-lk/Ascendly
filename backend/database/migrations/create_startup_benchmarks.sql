-- Migration: create startup_benchmarks table
-- Run once in Supabase SQL editor before executing seed_startup_benchmarks.py

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS startup_benchmarks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    country         TEXT,
    description     TEXT,
    launch_date     DATE,
    founders        TEXT,
    revenue_year1   NUMERIC,
    revenue_year2   NUMERIC,
    revenue_year3   NUMERIC,
    current_status  TEXT        CHECK (current_status IN ('Successful', 'Failed', 'Acquired')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
