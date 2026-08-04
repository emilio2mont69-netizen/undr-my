-- =============================================================================
-- UNDR — Real Server-Side Auctions & Anti-Sniping Schema
-- Run this script in the Supabase SQL Editor
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Auctions Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auctions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    creator_handle VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    starting_price DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    current_bid DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    min_bid_increment DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
    highest_bidder_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    highest_bidder_handle VARCHAR(100) DEFAULT '@none',
    bids_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL,
    anti_snipe_extensions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- Read policy: Anyone can view live auctions
DROP POLICY IF EXISTS "Public Read Auctions" ON auctions;
CREATE POLICY "Public Read Auctions" ON auctions
    FOR SELECT USING (true);

-- Insert policy: Creators can create auctions
DROP POLICY IF EXISTS "Creators Insert Auctions" ON auctions;
CREATE POLICY "Creators Insert Auctions" ON auctions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Update policy: System / Authenticated users via RPC
DROP POLICY IF EXISTS "System Update Auctions" ON auctions;
CREATE POLICY "System Update Auctions" ON auctions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Auction Bids Log Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auction_bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
    bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    bidder_handle VARCHAR(100) NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    is_anti_snipe BOOLEAN DEFAULT FALSE,
    placed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Bids" ON auction_bids;
CREATE POLICY "Public Read Bids" ON auction_bids
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Insert Bids" ON auction_bids;
CREATE POLICY "Authenticated Insert Bids" ON auction_bids
    FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Atomic RPC: place_auction_bid_server_side
-- Validates balance, verifies auction active status, enforces min increment,
-- extends +2 minutes if bid placed in last 30s (Anti-Sniping), and notifies outbid user.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION place_auction_bid_server_side(
    p_auction_id UUID,
    p_bidder_id UUID,
    p_bid_amount DECIMAL(10, 2)
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_auction auctions%ROWTYPE;
    v_bidder profiles%ROWTYPE;
    v_prev_bidder_id UUID;
    v_prev_bidder_handle VARCHAR(100);
    v_min_required DECIMAL(10, 2);
    v_time_remaining_sec INT;
    v_anti_snipe_triggered BOOLEAN := FALSE;
    v_new_end_time TIMESTAMPTZ;
BEGIN
    -- 1. Lock auction row FOR UPDATE to prevent race conditions
    SELECT * INTO v_auction FROM auctions WHERE id = p_auction_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auction not found');
    END IF;

    -- 2. Check auction active status
    IF v_auction.status != 'active' THEN
        RETURN jsonb_build_object('success', false, 'error', 'This auction is no longer active');
    END IF;

    -- 3. Server-side expiration check (against database NOW())
    IF NOW() >= v_auction.end_time THEN
        -- Mark as ended
        UPDATE auctions SET status = 'ended' WHERE id = p_auction_id;
        RETURN jsonb_build_object('success', false, 'error', 'Auction closed! Bidding has ended.');
    END IF;

    -- 4. Get bidder profile & check balance
    SELECT * INTO v_bidder FROM profiles WHERE id = p_bidder_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bidder profile not found');
    END IF;

    IF v_bidder.balance < p_bid_amount THEN
        RETURN jsonb_build_object('success', false, 'error', format('Insufficient balance ($%s required)', p_bid_amount));
    END IF;

    -- 5. Calculate minimum required bid
    IF v_auction.bids_count = 0 THEN
        v_min_required := v_auction.starting_price;
    ELSE
        v_min_required := v_auction.current_bid + v_auction.min_bid_increment;
    END IF;

    IF p_bid_amount < v_min_required THEN
        RETURN jsonb_build_object('success', false, 'error', format('Bid must be at least $%s USD', v_min_required));
    END IF;

    -- 6. Anti-Sniping Auto-Extension:
    -- If bid is placed in the last 30 seconds of auction, extend end_time by +2 minutes (120s)
    v_time_remaining_sec := EXTRACT(EPOCH FROM (v_auction.end_time - NOW()))::INT;
    v_new_end_time := v_auction.end_time;

    IF v_time_remaining_sec <= 30 THEN
        v_new_end_time := v_auction.end_time + INTERVAL '2 minutes';
        v_anti_snipe_triggered := TRUE;
    END IF;

    -- Store previous highest bidder for outbid notification
    v_prev_bidder_id := v_auction.highest_bidder_id;
    v_prev_bidder_handle := v_auction.highest_bidder_handle;

    -- 7. Update auction record
    UPDATE auctions
    SET current_bid = p_bid_amount,
        highest_bidder_id = p_bidder_id,
        highest_bidder_handle = v_bidder.handle,
        bids_count = bids_count + 1,
        end_time = v_new_end_time,
        anti_snipe_extensions = CASE WHEN v_anti_snipe_triggered THEN anti_snipe_extensions + 1 ELSE anti_snipe_extensions END
    WHERE id = p_auction_id;

    -- 8. Record bid log
    INSERT INTO auction_bids (auction_id, bidder_id, bidder_handle, bid_amount, is_anti_snipe)
    VALUES (p_auction_id, p_bidder_id, v_bidder.handle, p_bid_amount, v_anti_snipe_triggered);

    -- 9. Notify previous bidder if outbid
    IF v_prev_bidder_id IS NOT NULL AND v_prev_bidder_id != p_bidder_id THEN
        INSERT INTO notifications (user_id, text, type, is_read)
        VALUES (
            v_prev_bidder_id,
            format('⚠️ Outbid Alert! Someone placed a higher bid of $%s on auction "%s". Bid again to win!', p_bid_amount, v_auction.title),
            'auction_outbid',
            false
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'auction_id', p_auction_id,
        'current_bid', p_bid_amount,
        'highest_bidder_handle', v_bidder.handle,
        'bids_count', v_auction.bids_count + 1,
        'end_time', v_new_end_time,
        'anti_snipe_triggered', v_anti_snipe_triggered,
        'server_time', NOW()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION place_auction_bid_server_side TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Atomic RPC: settle_finished_auction
-- Transfers winning bid from winner to creator, ends auction, sends notifications.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION settle_finished_auction(p_auction_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_auction auctions%ROWTYPE;
    v_winner profiles%ROWTYPE;
    v_creator_earning DECIMAL(10, 2);
BEGIN
    SELECT * INTO v_auction FROM auctions WHERE id = p_auction_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auction not found');
    END IF;

    IF v_auction.status = 'ended' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Auction already settled');
    END IF;

    -- Mark auction as ended
    UPDATE auctions SET status = 'ended' WHERE id = p_auction_id;

    -- If no bidder, close without settlement
    IF v_auction.highest_bidder_id IS NULL OR v_auction.highest_bidder_handle = '@none' THEN
        RETURN jsonb_build_object('success', true, 'winner', null, 'message', 'Auction closed with no bids');
    END IF;

    -- Check winner balance
    SELECT * INTO v_winner FROM profiles WHERE id = v_auction.highest_bidder_id;
    IF v_winner.balance >= v_auction.current_bid THEN
        v_creator_earning := v_auction.current_bid * 0.80;

        -- Transfer funds
        UPDATE profiles SET balance = balance - v_auction.current_bid WHERE id = v_winner.id;
        UPDATE profiles SET balance = balance + v_creator_earning WHERE id = v_auction.creator_id;

        -- Winner Notification
        INSERT INTO notifications (user_id, text, type, is_read)
        VALUES (
            v_winner.id,
            format('🎉 Congratulations! You won the auction for "%s" with a final bid of $%s USD!', v_auction.title, v_auction.current_bid),
            'auction_win',
            false
        );

        -- Creator Notification
        INSERT INTO notifications (user_id, text, type, is_read)
        VALUES (
            v_auction.creator_id,
            format('💰 Your auction for "%s" ended at $%s USD! Added $%s to your account.', v_auction.title, v_auction.current_bid, v_creator_earning),
            'auction_sale',
            false
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'auction_id', p_auction_id,
        'winner_handle', v_winner.handle,
        'final_bid', v_auction.current_bid
    );
END;
$$;

GRANT EXECUTE ON FUNCTION settle_finished_auction TO authenticated;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_auctions_status_end_time ON auctions(status, end_time);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id);
