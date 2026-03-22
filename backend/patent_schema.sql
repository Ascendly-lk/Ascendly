    DROP TABLE IF EXISTS patent_activities CASCADE;
    DROP TABLE IF EXISTS patent_payments CASCADE;
    DROP TABLE IF EXISTS patent_reviews CASCADE;
    DROP TABLE IF EXISTS patent_documents CASCADE;
    DROP TABLE IF EXISTS patent_applications CASCADE;
    DROP TABLE IF EXISTS patent_clients CASCADE;
    DROP TYPE IF EXISTS patent_app_status CASCADE;
    DROP TYPE IF EXISTS patent_priority CASCADE;
    DROP TYPE IF EXISTS payment_status CASCADE;

    CREATE TYPE patent_app_status AS ENUM (
        'pending_review', 'in_progress', 'filing_ready', 'filed', 'approved', 'rejected'
    );
    CREATE TYPE patent_priority AS ENUM ('low', 'medium', 'high', 'urgent');
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue');

    CREATE TABLE patent_clients (
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

    CREATE TABLE patent_applications (
        id TEXT PRIMARY KEY,
        client_id UUID REFERENCES patent_clients(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        type TEXT,
        status patent_app_status DEFAULT 'pending_review',
        progress INTEGER DEFAULT 0,
        due_date TIMESTAMPTZ,
        assigned_to TEXT,
        filing_type TEXT,
        priority patent_priority DEFAULT 'medium',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE patent_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id TEXT REFERENCES patent_applications(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        type TEXT,
        size TEXT,
        file_url TEXT,
        status TEXT,
        reviewer TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE patent_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id TEXT REFERENCES patent_applications(id) ON DELETE CASCADE,
        reviewer TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE patent_payments (
        id TEXT PRIMARY KEY,
        client_id UUID REFERENCES patent_clients(id) ON DELETE CASCADE,
        application_id TEXT REFERENCES patent_applications(id) ON DELETE CASCADE,
        service TEXT,
        tier TEXT,
        due_date TIMESTAMPTZ,
        paid_date TIMESTAMPTZ,
        amount DECIMAL(12, 2),
        status payment_status DEFAULT 'pending',
        payment_method TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE patent_activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action TEXT NOT NULL,
        description TEXT,
        application_id TEXT REFERENCES patent_applications(id) ON DELETE CASCADE,
        client_name TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    WITH ins_client1 AS (
        INSERT INTO patent_clients (name, industry, tier, revenue, logo_letter)
        VALUES ('TechCo AI', 'Artificial Intelligence', 'Tier 3', 14997.00, 'TA')
        RETURNING id
    ),
    ins_client2 AS (
        INSERT INTO patent_clients (name, industry, tier, revenue, logo_letter)
        VALUES ('IoT Innovations', 'Hardware / IoT', 'Tier 2', 3998.00, 'II')
        RETURNING id
    ),
    ins_client3 AS (
        INSERT INTO patent_clients (name, industry, tier, revenue, logo_letter)
        VALUES ('DataFlow Inc', 'Data Analytics', 'Tier 2', 1999.00, 'DF')
        RETURNING id
    ),
    ins_app1 AS (
        INSERT INTO patent_applications (id, client_id, title, type, status, progress, due_date, assigned_to, filing_type, priority, created_at)
        VALUES ('PAT-2026-001', (SELECT id FROM ins_client1), 'AI-Powered Task Automation Engine', 'Software', 'pending_review', 20, now() + interval '2 days', 'Dr. Sarah Chen', 'Non-Provisional', 'high', now() - interval '5 days')
        RETURNING id
    ),
    ins_app2 AS (
        INSERT INTO patent_applications (id, client_id, title, type, status, progress, due_date, assigned_to, filing_type, priority, created_at)
        VALUES ('PAT-2026-002', (SELECT id FROM ins_client2), 'Smart IoT Sensor Hardware Design', 'Hardware', 'in_progress', 60, now() + interval '10 days', 'Michael Rodriguez', 'Provisional', 'medium', now() - interval '5 days')
        RETURNING id
    ),
    ins_app3 AS (
        INSERT INTO patent_applications (id, client_id, title, type, status, progress, due_date, assigned_to, filing_type, priority, created_at)
        VALUES ('PAT-2026-003', (SELECT id FROM ins_client3), 'Blockchain Data Verification', 'Software', 'filing_ready', 90, now() + interval '10 days', 'Emily Watson', 'Non-Provisional', 'low', now() - interval '10 days')
        RETURNING id
    ),
    ins_app4 AS (
        INSERT INTO patent_applications (id, client_id, title, type, status, progress, due_date, assigned_to, filing_type, priority, created_at)
        VALUES ('PAT-2026-004', (SELECT id FROM ins_client1), 'Machine Learning Training Algorithm', 'Software', 'pending_review', 10, now() + interval '2 days', 'Unassigned', 'Provisional', 'urgent', now() - interval '2 days')
        RETURNING id
    ),
    ins_app5 AS (
        INSERT INTO patent_applications (id, client_id, title, type, status, progress, due_date, assigned_to, filing_type, priority, created_at)
        VALUES ('PAT-2026-005', (SELECT id FROM ins_client2), 'Automated Fleet Tracking', 'Software', 'approved', 100, now() - interval '10 days', 'System', 'Non-Provisional', 'high', now() - interval '10 days')
        RETURNING id
    ),
    ins_doc1 AS (
        INSERT INTO patent_documents (application_id, name, type, size, file_url, status, reviewer)
        VALUES ('PAT-2026-001', 'Technical Specifications.pdf', 'pdf', '2.4 MB', 'https://example.com/mock_file_1.pdf', 'uploaded', 'Dr. Sarah Chen')
    ),
    ins_doc2 AS (
        INSERT INTO patent_documents (application_id, name, type, size, file_url, status, reviewer)
        VALUES ('PAT-2026-004', 'Architecture Diagram.png', 'image', '1.1 MB', 'https://example.com/mock_file_2.png', 'uploaded', 'Unassigned')
    ),
    ins_pay1 AS (
        INSERT INTO patent_payments (id, client_id, application_id, service, tier, due_date, paid_date, amount, status, payment_method)
        VALUES ('INV-2026-001', (SELECT id FROM ins_client1), 'PAT-2026-001', 'Non-Provisional Filing', 'Tier 3', now() - interval '2 days', now() - interval '5 days', 4999.00, 'paid', 'Credit Card')
    ),
    ins_pay2 AS (
        INSERT INTO patent_payments (id, client_id, application_id, service, tier, due_date, paid_date, amount, status, payment_method)
        VALUES ('INV-2026-002', (SELECT id FROM ins_client2), 'PAT-2026-002', 'Provisional Patent', 'Tier 2', now() + interval '2 days', NULL, 1999.00, 'pending', 'Credit Card')
    ),
    ins_act1 AS (
        INSERT INTO patent_activities (action, description, application_id, client_name, created_at)
        VALUES ('Document uploaded', 'Technical Specifications.pdf was verified by our system.', 'PAT-2026-001', 'TechCo AI', now() - interval '2 days')
    ),
    ins_act2 AS (
        INSERT INTO patent_activities (action, description, application_id, client_name, created_at)
        VALUES ('Application submitted', 'New patent architecture drafted for ML Engine.', 'PAT-2026-004', 'TechCo AI', now() - interval '2 days')
    ),
    ins_act3 AS (
        INSERT INTO patent_activities (action, description, application_id, client_name, created_at)
        VALUES ('Application moved to review', 'Emily Watson approved the baseline claims for Blockchain system.', 'PAT-2026-003', 'DataFlow Inc', now() - interval '2 days')
    )
    SELECT 1;
