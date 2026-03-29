-- Conversation threads
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    dataset_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual messages within a conversation
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    msg_type TEXT NOT NULL DEFAULT 'text' CHECK (msg_type IN ('text', 'c1', 'error')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own conversations" ON conversations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see messages in own conversations" ON chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = chat_messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- ── Subscription tier columns on profiles ─────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS billing_period_start TIMESTAMPTZ DEFAULT NOW();

-- ── Subscription tiers reference table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly NUMERIC NOT NULL DEFAULT 0,
  analyses_per_month INTEGER NOT NULL DEFAULT 3,   -- -1 = unlimited
  chat_queries_per_month INTEGER NOT NULL DEFAULT 20,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT FALSE
);

-- Seed tiers (idempotent)
INSERT INTO subscription_tiers (id, name, price_monthly, analyses_per_month, chat_queries_per_month, features, is_popular)
VALUES
  ('free',    'Free',       0,   3,   20,  '["3 dataset analyses/month","20 AI chat queries","Basic forecasting","CSV upload (5MB max)"]'::jsonb, false),
  ('starter', 'Starter',   19,  15,  100, '["15 dataset analyses/month","100 AI chat queries","SARIMAX forecasting","CSV/Excel upload (25MB)","Benchmark comparisons"]'::jsonb, false),
  ('pro',     'Pro',       49,  60,  500, '["60 dataset analyses/month","500 AI chat queries","Full forecast suite","50MB uploads","ADK live benchmarks","Priority support"]'::jsonb, true),
  ('business','Business', 149,  -1,   -1, '["Unlimited analyses","Unlimited chat","All features","100MB uploads","Custom integrations","Dedicated support"]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
