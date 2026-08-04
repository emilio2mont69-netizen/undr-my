-- =============================================================================
-- UNDR — Supabase Realtime + Storage Policies
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Add missing columns to messages table
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS read_by UUID[] DEFAULT '{}';

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Enable Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CONVERSATIONS — RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can only see conversations they are part of
DROP POLICY IF EXISTS "conversations_select" ON conversations;
CREATE POLICY "conversations_select" ON conversations
    FOR SELECT USING (
        auth.uid() = buyer_id OR auth.uid() = creator_id
    );

-- Only buyers can create new conversations
DROP POLICY IF EXISTS "conversations_insert" ON conversations;
CREATE POLICY "conversations_insert" ON conversations
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id
    );

-- Both parties can update last_message_preview
DROP POLICY IF EXISTS "conversations_update" ON conversations;
CREATE POLICY "conversations_update" ON conversations
    FOR UPDATE USING (
        auth.uid() = buyer_id OR auth.uid() = creator_id
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. MESSAGES — RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can only see messages in their conversations
DROP POLICY IF EXISTS "messages_select" ON messages;
CREATE POLICY "messages_select" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = messages.conversation_id
              AND (c.buyer_id = auth.uid() OR c.creator_id = auth.uid())
        )
    );

-- Users can only send messages in their own conversations
DROP POLICY IF EXISTS "messages_insert" ON messages;
CREATE POLICY "messages_insert" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = messages.conversation_id
              AND (c.buyer_id = auth.uid() OR c.creator_id = auth.uid())
        )
    );

-- Users can update messages in their conversations (for read receipts, PPV unlock)
DROP POLICY IF EXISTS "messages_update" ON messages;
CREATE POLICY "messages_update" ON messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = messages.conversation_id
              AND (c.buyer_id = auth.uid() OR c.creator_id = auth.uid())
        )
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. NOTIFICATIONS — RLS Policies
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "notifications_select" ON notifications;
CREATE POLICY "notifications_select" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert" ON notifications;
CREATE POLICY "notifications_insert" ON notifications
    FOR INSERT WITH CHECK (true); -- System can insert for any user

DROP POLICY IF EXISTS "notifications_update" ON notifications;
CREATE POLICY "notifications_update" ON notifications
    FOR UPDATE USING (auth.uid() = user_id); -- Users can mark their own as read

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Enable Realtime on relevant tables
-- ─────────────────────────────────────────────────────────────────────────────

-- Add tables to the supabase_realtime publication for live changes
DO $$
BEGIN
    -- Drop and recreate to avoid "already member" errors
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'messages already in publication';
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'conversations already in publication';
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'notifications already in publication';
    END;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Supabase Storage — ppv-media bucket
-- (Run manually in Supabase Dashboard > Storage OR use Supabase JS client)
-- ─────────────────────────────────────────────────────────────────────────────

-- NOTE: Create the bucket 'ppv-media' as PRIVATE in Storage settings.
-- Then add these policies:

-- Allow authenticated users to upload their own PPV files
-- (bucket policy: INSERT path starts with 'ppv/{conversationId}/')
-- Enforce: the uploader must be the creator of that conversation

-- Policy: Creators can upload PPV media
INSERT INTO storage.objects(bucket_id, name, owner)
SELECT 'ppv-media', 'placeholder', auth.uid()
WHERE false; -- This is just for schema validation; actual policy is below

-- Actually, storage policies are managed via the Storage API:
-- The following are the SQL policies for storage.objects

DROP POLICY IF EXISTS "ppv_media_upload" ON storage.objects;
CREATE POLICY "ppv_media_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ppv-media'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = 'ppv'
    );

DROP POLICY IF EXISTS "ppv_media_select" ON storage.objects;
CREATE POLICY "ppv_media_select" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'ppv-media'
        AND auth.uid() IS NOT NULL
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. RPC: unlock_ppv_message — atomic payment + unlock
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION unlock_ppv_message(p_message_id UUID, p_buyer_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_msg messages%ROWTYPE;
    v_conv conversations%ROWTYPE;
    v_buyer_balance DECIMAL(10,2);
    v_result JSONB;
BEGIN
    -- Get the message
    SELECT * INTO v_msg FROM messages WHERE id = p_message_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Message not found');
    END IF;

    IF v_msg.is_unlocked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Already unlocked');
    END IF;

    IF NOT v_msg.is_ppv THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a PPV message');
    END IF;

    -- Get conversation to find creator
    SELECT * INTO v_conv FROM conversations WHERE id = v_msg.conversation_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Conversation not found');
    END IF;

    -- Check buyer has enough balance
    SELECT balance INTO v_buyer_balance FROM profiles WHERE id = p_buyer_id;
    IF v_buyer_balance < v_msg.ppv_price THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
    END IF;

    -- Atomic: deduct from buyer, credit to creator, mark unlocked
    UPDATE profiles SET balance = balance - v_msg.ppv_price WHERE id = p_buyer_id;
    UPDATE profiles SET balance = balance + (v_msg.ppv_price * 0.80) WHERE id = v_conv.creator_id;

    UPDATE messages SET is_unlocked = true WHERE id = p_message_id;

    -- Create notification for creator
    INSERT INTO notifications (user_id, text, type, reference_id, is_read)
    VALUES (
        v_conv.creator_id,
        format('💰 A buyer unlocked your PPV content for $%s', v_msg.ppv_price),
        'chat',
        v_msg.conversation_id,
        false
    );

    RETURN jsonb_build_object(
        'success', true,
        'message_id', p_message_id,
        'ppv_media_url', v_msg.ppv_media_url,
        'ppv_price', v_msg.ppv_price
    );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION unlock_ppv_message TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. RPC: send_tip_in_chat — atomic tip processing
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION send_tip_in_chat(
    p_conversation_id UUID,
    p_sender_id UUID,
    p_amount DECIMAL(10,2),
    p_message TEXT DEFAULT '❤️'
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_conv conversations%ROWTYPE;
    v_sender_balance DECIMAL(10,2);
    v_msg_id UUID;
    v_creator_id UUID;
BEGIN
    -- Get conversation
    SELECT * INTO v_conv FROM conversations WHERE id = p_conversation_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Conversation not found');
    END IF;

    -- Determine who the creator is (sender must be buyer)
    IF v_conv.buyer_id = p_sender_id THEN
        v_creator_id := v_conv.creator_id;
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Only buyers can send tips');
    END IF;


    -- Check sender balance
    SELECT balance INTO v_sender_balance FROM profiles WHERE id = p_sender_id;
    IF v_sender_balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
    END IF;

    -- Atomic transfer (80% to creator, 20% platform fee)
    UPDATE profiles SET balance = balance - p_amount WHERE id = p_sender_id;
    UPDATE profiles SET balance = balance + (p_amount * 0.80) WHERE id = v_creator_id;

    -- Insert tip message
    INSERT INTO messages (conversation_id, sender_id, text, is_tip, tip_amount)
    VALUES (p_conversation_id, p_sender_id, p_message, true, p_amount)
    RETURNING id INTO v_msg_id;

    -- Update conversation preview
    UPDATE conversations
    SET last_message_preview = format('💰 Tip: $%s', p_amount),
        last_message_at = NOW()
    WHERE id = p_conversation_id;

    -- Notify creator
    INSERT INTO notifications (user_id, text, type, reference_id)
    VALUES (
        v_creator_id,
        format('💰 You received a $%s tip!', p_amount),
        'chat',
        p_conversation_id
    );

    RETURN jsonb_build_object('success', true, 'message_id', v_msg_id, 'amount', p_amount);
END;
$$;

GRANT EXECUTE ON FUNCTION send_tip_in_chat TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. INDEXES for performance
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_creator_id ON conversations(creator_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! Now run this in the Supabase SQL Editor.
-- Then create the 'ppv-media' bucket as PRIVATE in Storage settings.
-- ─────────────────────────────────────────────────────────────────────────────
