import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.sqlalchemy_client import engine

def init_patent_tables():
    if not engine:
        print("Error: DATABASE_URL not found in .env")
        return

    schema_sql = """
    -- 1. Patent Clients Table
    CREATE TABLE IF NOT EXISTS patent_clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        industry TEXT,
        tier TEXT CHECK (tier IN ('Tier 1', 'Tier 2', 'Tier 3')),
        revenue DECIMAL(12, 2) DEFAULT 0.0,
        logo_letter VARCHAR(2),
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- 2. Patent Applications Table
    CREATE TABLE IF NOT EXISTS patent_applications (
        id TEXT PRIMARY KEY,
        client_id UUID REFERENCES patent_clients(id),
        title TEXT NOT NULL,
        type TEXT,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        last_updated TIMESTAMPTZ DEFAULT now(),
        assigned_to TEXT,
        filing_type TEXT,
        priority TEXT CHECK (priority IN ('urgent', 'high', 'normal')),
        created_at TIMESTAMPTZ DEFAULT now()
    );

    -- 3. Patent Firm Activity Table
    CREATE TABLE IF NOT EXISTS patent_firm_activity (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        client_name TEXT,
        description TEXT,
        activity_type TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    );
    """

    seed_sql = """
    INSERT INTO patent_clients (name, industry, tier, revenue, logo_letter)
    SELECT 'TechCo AI', 'Artificial Intelligence', 'Tier 3', 14997.00, 'TA'
    WHERE NOT EXISTS (SELECT 1 FROM patent_clients WHERE name = 'TechCo AI');

    INSERT INTO patent_clients (name, industry, tier, revenue, logo_letter)
    SELECT 'IoT Innovations', 'Hardware / IoT', 'Tier 2', 3998.00, 'II'
    WHERE NOT EXISTS (SELECT 1 FROM patent_clients WHERE name = 'IoT Innovations');

    INSERT INTO patent_clients (name, industry, tier, revenue, logo_letter)
    SELECT 'DataFlow Inc', 'Data Analytics', 'Tier 2', 1999.00, 'DF'
    WHERE NOT EXISTS (SELECT 1 FROM patent_clients WHERE name = 'DataFlow Inc');
    """

    with engine.connect() as connection:
        print("Initializing tables...")
        connection.execute(text(schema_sql))
        connection.commit()
        print("Seeding initial data...")
        connection.execute(text(seed_sql))
        connection.commit()
        print("Database initialization complete!")

if __name__ == "__main__":
    init_patent_tables()
