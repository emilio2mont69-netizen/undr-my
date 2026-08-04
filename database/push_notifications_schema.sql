-- =============================================================================
-- UNDR — Push Notifications Schema
-- Run this in the Supabase SQL Editor AFTER realtime_policies.sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. push_subscriptions table (Web Push VAPID endpoint storage)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own subscriptions
DROP POLICY IF EXISTS "push_subscriptions_select" ON push_subscriptions;
CREATE POLICY "push_subscriptions_select" ON push_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_insert" ON push_subscriptions;
CREATE POLICY "push_subscriptions_insert" ON push_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_upsert" ON push_subscriptions;
CREATE POLICY "push_subscriptions_upsert" ON push_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_delete" ON push_subscriptions;
CREATE POLICY "push_subscriptions_delete" ON push_subscriptions
    FOR DELETE USING (auth.uid() = user_id);

-- Service role (Edge Functions) can read all subscriptions to send pushes
-- This is used by the Edge Function trigger — it runs as service_role
-- so the above policies don't apply to it.

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Index for efficient lookup
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
