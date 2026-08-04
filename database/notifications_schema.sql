-- =============================================================================
-- UNDR — Real Transactional Email & Push Notification Preferences Schema
-- Run this script in the Supabase SQL Editor
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. User Notification Preferences Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    email_orders BOOLEAN DEFAULT TRUE,
    email_chat BOOLEAN DEFAULT TRUE,
    push_dms BOOLEAN DEFAULT TRUE,
    push_auctions BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own preferences
DROP POLICY IF EXISTS "Users Read Own Preferences" ON user_notification_preferences;
CREATE POLICY "Users Read Own Preferences" ON user_notification_preferences
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert/update their own preferences
DROP POLICY IF EXISTS "Users Update Own Preferences" ON user_notification_preferences;
CREATE POLICY "Users Update Own Preferences" ON user_notification_preferences
    FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Email Dispatch Audit Log Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_dispatch_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    template_name VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'resend',
    status VARCHAR(50) DEFAULT 'dispatched',
    dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_dispatch_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins Read Email Logs" ON email_dispatch_logs;
CREATE POLICY "Admins Read Email Logs" ON email_dispatch_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Atomic RPC: update_notification_preferences
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_notification_preferences(
    p_email_orders BOOLEAN,
    p_email_chat BOOLEAN,
    p_push_dms BOOLEAN,
    p_push_auctions BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_notification_preferences (user_id, email_orders, email_chat, push_dms, push_auctions, updated_at)
    VALUES (auth.uid(), p_email_orders, p_email_chat, p_push_dms, p_push_auctions, NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET email_orders = EXCLUDED.email_orders,
        email_chat = EXCLUDED.email_chat,
        push_dms = EXCLUDED.push_dms,
        push_auctions = EXCLUDED.push_auctions,
        updated_at = NOW();

    RETURN jsonb_build_object('success', true, 'user_id', auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION update_notification_preferences TO authenticated;
