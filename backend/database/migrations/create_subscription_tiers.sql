-- Migration: subscription support
-- Run in Supabase SQL editor before starting the server

-- 1. Add subscription columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS billing_period_start TIMESTAMPTZ DEFAULT NOW();

-- 2. Subscription tiers reference table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id                      TEXT PRIMARY KEY,      -- 'free', 'starter', 'pro'
  name                    TEXT NOT NULL,
  price_monthly           NUMERIC NOT NULL DEFAULT 0,
  analyses_per_month      INTEGER NOT NULL DEFAULT 3,   -- -1 = unlimited
  chat_queries_per_month  INTEGER NOT NULL DEFAULT 10,  -- -1 = unlimited
  features                JSONB,
  is_popular              BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed default tiers
INSERT INTO subscription_tiers (id, name, price_monthly, analyses_per_month, chat_queries_per_month, is_popular)
VALUES
  ('free',    'Free',    0,    3,  10, FALSE),
  ('starter', 'Starter', 29,  10,  50, TRUE),
  ('pro',     'Pro',     79,  -1,  -1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Set features using json_build_array (avoids copy-paste newline issues)
UPDATE subscription_tiers SET features = json_build_array('3 analyses/month','10 chats/month','Revenue forecasting','Industry benchmarks') WHERE id = 'free';
UPDATE subscription_tiers SET features = json_build_array('10 analyses/month','50 chats/month','Revenue forecasting','Industry benchmarks','Priority support') WHERE id = 'starter';
UPDATE subscription_tiers SET features = json_build_array('Unlimited analyses','Unlimited chat','Revenue forecasting','Industry benchmarks','Priority support','Custom integrations') WHERE id = 'pro';
