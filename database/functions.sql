-- ============================================================================
-- UNDR Marketplace - Server-Side Database Functions (RPCs)
-- ============================================================================
-- These PostgreSQL functions run on the Supabase server and handle
-- sensitive operations that should NEVER be executed directly from the client.
-- They ensure atomicity, security, and data integrity.
--
-- Call from client: supabase.rpc('function_name', { arg1: val1, arg2: val2 })
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROCESS PURCHASE
-- Atomically: deduct buyer balance, credit creator, create order, update product
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION process_purchase(
    p_buyer_id UUID,
    p_product_id UUID,
    p_shipping_address JSONB DEFAULT NULL,
    p_addons_cost DECIMAL DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_product RECORD;
    v_buyer RECORD;
    v_order_id UUID;
    v_shipping_cost DECIMAL;
    v_grand_total DECIMAL;
    v_platform_fee DECIMAL;
    v_creator_payout DECIMAL;
BEGIN
    -- Lock the product row to prevent race conditions
    SELECT * INTO v_product FROM products WHERE id = p_product_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product not found');
    END IF;
    IF v_product.status != 'active' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product is no longer available');
    END IF;

    -- Lock the buyer row
    SELECT * INTO v_buyer FROM profiles WHERE id = p_buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Buyer not found');
    END IF;

    -- Calculate costs
    v_shipping_cost := CASE WHEN v_product.price + p_addons_cost < 150 THEN 15.00 ELSE 0.00 END;
    v_grand_total := v_product.price + p_addons_cost + v_shipping_cost;

    -- Check buyer has sufficient balance
    IF v_buyer.balance < v_grand_total THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance',
            'required', v_grand_total, 'available', v_buyer.balance);
    END IF;

    -- Platform fee (10%)
    v_platform_fee := v_product.price * 0.10;
    v_creator_payout := v_product.price - v_platform_fee;

    -- Deduct buyer balance
    UPDATE profiles SET balance = balance - v_grand_total WHERE id = p_buyer_id;

    -- Credit creator balance
    UPDATE profiles SET balance = balance + v_creator_payout WHERE id = v_product.creator_id;

    -- Mark product as sold
    UPDATE products SET status = 'sold' WHERE id = p_product_id;

    -- Create the order
    INSERT INTO orders (buyer_id, product_id, creator_id, subtotal, shipping_cost, addons_cost, grand_total, status, shipping_address)
    VALUES (p_buyer_id, p_product_id, v_product.creator_id, v_product.price, v_shipping_cost, p_addons_cost, v_grand_total, 'paid', p_shipping_address)
    RETURNING id INTO v_order_id;

    -- Record transactions
    INSERT INTO transactions (user_id, type, amount, reference_id, description)
    VALUES
        (p_buyer_id, 'purchase', -v_grand_total, v_order_id, 'Purchase: ' || v_product.title_en),
        (v_product.creator_id, 'sale', v_creator_payout, v_order_id, 'Sale: ' || v_product.title_en);

    -- Create notifications
    INSERT INTO notifications (user_id, text, type, reference_id) VALUES
        (v_product.creator_id, 'New order received! ' || v_product.title_en || ' has been purchased.', 'order', v_order_id),
        (p_buyer_id, 'Order confirmed! Your purchase of ' || v_product.title_en || ' is being prepared.', 'order', v_order_id);

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'grand_total', v_grand_total,
        'creator_payout', v_creator_payout,
        'platform_fee', v_platform_fee
    );
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PROCESS TIP
-- Atomically: deduct buyer balance, credit creator, record transaction
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION process_tip(
    p_sender_id UUID,
    p_recipient_id UUID,
    p_amount DECIMAL,
    p_conversation_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sender_balance DECIMAL;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tip amount must be positive');
    END IF;

    -- Lock and check sender balance
    SELECT balance INTO v_sender_balance FROM profiles WHERE id = p_sender_id FOR UPDATE;
    IF v_sender_balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
    END IF;

    -- Deduct from sender
    UPDATE profiles SET balance = balance - p_amount WHERE id = p_sender_id;

    -- Credit recipient (platform takes 5% of tips)
    UPDATE profiles SET balance = balance + (p_amount * 0.95) WHERE id = p_recipient_id;

    -- Record transactions
    INSERT INTO transactions (user_id, type, amount, reference_id, description) VALUES
        (p_sender_id, 'tip', -p_amount, p_conversation_id, 'Tip sent'),
        (p_recipient_id, 'tip', p_amount * 0.95, p_conversation_id, 'Tip received');

    -- Add tip message to conversation if provided
    IF p_conversation_id IS NOT NULL THEN
        INSERT INTO messages (conversation_id, sender_id, text, is_tip, tip_amount)
        VALUES (p_conversation_id, p_sender_id, 'Sent a tip!', true, p_amount);

        -- Update conversation preview
        UPDATE conversations SET last_message_preview = '💰 Tip: $' || p_amount::TEXT, last_message_at = NOW()
        WHERE id = p_conversation_id;
    END IF;

    -- Notify recipient
    INSERT INTO notifications (user_id, text, type, reference_id)
    VALUES (p_recipient_id, 'You received a $' || p_amount::TEXT || ' tip!', 'chat', p_conversation_id);

    RETURN jsonb_build_object('success', true, 'amount', p_amount);
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PROCESS PPV UNLOCK
-- Atomically: charge buyer, credit creator, unlock media
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION process_ppv_unlock(
    p_buyer_id UUID,
    p_message_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_message RECORD;
    v_conversation RECORD;
    v_buyer_balance DECIMAL;
BEGIN
    -- Get the PPV message
    SELECT * INTO v_message FROM messages WHERE id = p_message_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Message not found');
    END IF;
    IF NOT v_message.is_ppv THEN
        RETURN jsonb_build_object('success', false, 'error', 'This is not a PPV message');
    END IF;
    IF v_message.is_unlocked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Already unlocked');
    END IF;

    -- Get conversation to find the creator
    SELECT * INTO v_conversation FROM conversations WHERE id = v_message.conversation_id;

    -- Check buyer balance
    SELECT balance INTO v_buyer_balance FROM profiles WHERE id = p_buyer_id FOR UPDATE;
    IF v_buyer_balance < v_message.ppv_price THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
    END IF;

    -- Deduct buyer
    UPDATE profiles SET balance = balance - v_message.ppv_price WHERE id = p_buyer_id;

    -- Credit creator (platform takes 10%)
    UPDATE profiles SET balance = balance + (v_message.ppv_price * 0.90) WHERE id = v_message.sender_id;

    -- Unlock the message
    UPDATE messages SET is_unlocked = true WHERE id = p_message_id;

    -- Record transactions
    INSERT INTO transactions (user_id, type, amount, reference_id, description) VALUES
        (p_buyer_id, 'ppv_unlock', -v_message.ppv_price, p_message_id, 'PPV content unlocked'),
        (v_message.sender_id, 'ppv_unlock', v_message.ppv_price * 0.90, p_message_id, 'PPV content sold');

    RETURN jsonb_build_object('success', true, 'media_url', v_message.ppv_media_url, 'price', v_message.ppv_price);
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PLACE AUCTION BID
-- Atomically: validate bid, update auction, record bid
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION place_auction_bid(
    p_bidder_id UUID,
    p_auction_id UUID,
    p_amount DECIMAL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_auction RECORD;
    v_bidder_balance DECIMAL;
BEGIN
    -- Lock and get the auction product
    SELECT * INTO v_auction FROM products WHERE id = p_auction_id AND is_auction = true FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auction not found');
    END IF;

    -- Check auction is still active
    IF v_auction.auction_end_time IS NOT NULL AND v_auction.auction_end_time < NOW() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auction has ended');
    END IF;

    -- Check bid is higher than current price
    IF p_amount <= v_auction.price THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bid must be higher than current price',
            'current_price', v_auction.price);
    END IF;

    -- Check bidder balance
    SELECT balance INTO v_bidder_balance FROM profiles WHERE id = p_bidder_id FOR UPDATE;
    IF v_bidder_balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance for bid');
    END IF;

    -- Can't bid on your own auction
    IF v_auction.creator_id = p_bidder_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cannot bid on your own auction');
    END IF;

    -- Record the bid
    INSERT INTO bids (auction_id, bidder_id, amount) VALUES (p_auction_id, p_bidder_id, p_amount);

    -- Update auction state
    UPDATE products SET
        price = p_amount,
        top_bidder_id = p_bidder_id,
        bids_count = bids_count + 1,
        -- Auto-extend: if bid placed within last 30 seconds, extend by 30 seconds
        auction_end_time = CASE
            WHEN auction_end_time IS NOT NULL AND auction_end_time - NOW() < INTERVAL '30 seconds'
            THEN auction_end_time + INTERVAL '30 seconds'
            ELSE auction_end_time
        END
    WHERE id = p_auction_id;

    -- Notify the creator
    INSERT INTO notifications (user_id, text, type, reference_id)
    VALUES (v_auction.creator_id, 'New bid of $' || p_amount::TEXT || ' on your auction: ' || v_auction.title_en, 'auction', p_auction_id);

    -- Notify the previous top bidder if there was one
    IF v_auction.top_bidder_id IS NOT NULL AND v_auction.top_bidder_id != p_bidder_id THEN
        INSERT INTO notifications (user_id, text, type, reference_id)
        VALUES (v_auction.top_bidder_id, 'You have been outbid on ' || v_auction.title_en || '. New price: $' || p_amount::TEXT, 'auction', p_auction_id);
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'bid_amount', p_amount,
        'new_price', p_amount,
        'bids_count', v_auction.bids_count + 1
    );
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. PROCESS CREATOR WITHDRAWAL
-- Atomically: deduct creator balance, record transaction
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION process_withdrawal(
    p_creator_id UUID,
    p_amount DECIMAL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_creator RECORD;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Withdrawal amount must be positive');
    END IF;

    -- Minimum withdrawal
    IF p_amount < 20.00 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Minimum withdrawal is $20.00');
    END IF;

    -- Lock and check creator
    SELECT * INTO v_creator FROM profiles WHERE id = p_creator_id AND role = 'creator' FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Creator account not found');
    END IF;

    IF v_creator.kyc_status != 'approved' THEN
        RETURN jsonb_build_object('success', false, 'error', 'KYC verification required for withdrawals');
    END IF;

    IF v_creator.balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance',
            'available', v_creator.balance, 'requested', p_amount);
    END IF;

    -- Deduct balance
    UPDATE profiles SET balance = balance - p_amount WHERE id = p_creator_id;

    -- Record transaction
    INSERT INTO transactions (user_id, type, amount, description)
    VALUES (p_creator_id, 'withdrawal', -p_amount, 'ACH withdrawal to bank account');

    -- Notify
    INSERT INTO notifications (user_id, text, type)
    VALUES (p_creator_id, 'Withdrawal of $' || p_amount::TEXT || ' initiated. Allow 3-5 business days for processing.', 'system');

    RETURN jsonb_build_object('success', true, 'withdrawn', p_amount, 'remaining_balance', v_creator.balance - p_amount);
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. GET PLATFORM STATS (Admin Dashboard)
-- Returns aggregated statistics for the admin panel
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_gmv DECIMAL;
    v_total_revenue DECIMAL;
    v_total_users INTEGER;
    v_total_creators INTEGER;
    v_total_products INTEGER;
    v_active_auctions INTEGER;
    v_pending_kyc INTEGER;
    v_orders_today INTEGER;
BEGIN
    -- Total GMV (Gross Merchandise Volume)
    SELECT COALESCE(SUM(grand_total), 0) INTO v_total_gmv FROM orders WHERE status NOT IN ('refunded', 'disputed');

    -- Platform revenue (from fees recorded in transactions)
    v_total_revenue := v_total_gmv * 0.10;

    -- User counts
    SELECT COUNT(*) INTO v_total_users FROM profiles;
    SELECT COUNT(*) INTO v_total_creators FROM profiles WHERE role = 'creator';

    -- Product counts
    SELECT COUNT(*) INTO v_total_products FROM products WHERE status = 'active';
    SELECT COUNT(*) INTO v_active_auctions FROM products WHERE is_auction = true AND status = 'active' AND (auction_end_time IS NULL OR auction_end_time > NOW());

    -- Pending KYC
    SELECT COUNT(*) INTO v_pending_kyc FROM kyc_applications WHERE status = 'pending';

    -- Orders today
    SELECT COUNT(*) INTO v_orders_today FROM orders WHERE created_at::DATE = CURRENT_DATE;

    RETURN jsonb_build_object(
        'total_gmv', v_total_gmv,
        'total_revenue', v_total_revenue,
        'total_users', v_total_users,
        'total_creators', v_total_creators,
        'total_products', v_total_products,
        'active_auctions', v_active_auctions,
        'pending_kyc', v_pending_kyc,
        'orders_today', v_orders_today
    );
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. PROCESS SUBSCRIPTION
-- Atomically: charge buyer, credit creator, create subscription record
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION process_subscription(
    p_buyer_id UUID,
    p_creator_id UUID,
    p_price DECIMAL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_buyer_balance DECIMAL;
    v_sub_id UUID;
    v_existing RECORD;
BEGIN
    -- Check for existing active subscription
    SELECT * INTO v_existing FROM subscriptions
    WHERE buyer_id = p_buyer_id AND creator_id = p_creator_id AND status = 'active';
    IF FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Already subscribed to this creator');
    END IF;

    -- Validate price
    IF p_price <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Subscription price must be positive');
    END IF;

    -- Check buyer balance
    SELECT balance INTO v_buyer_balance FROM profiles WHERE id = p_buyer_id FOR UPDATE;
    IF v_buyer_balance < p_price THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
    END IF;

    -- Deduct buyer
    UPDATE profiles SET balance = balance - p_price WHERE id = p_buyer_id;

    -- Credit creator (platform takes 15% of subscriptions)
    UPDATE profiles SET balance = balance + (p_price * 0.85) WHERE id = p_creator_id;

    -- Create subscription
    INSERT INTO subscriptions (buyer_id, creator_id, price, status)
    VALUES (p_buyer_id, p_creator_id, p_price, 'active')
    RETURNING id INTO v_sub_id;

    -- Record transactions
    INSERT INTO transactions (user_id, type, amount, reference_id, description) VALUES
        (p_buyer_id, 'subscription', -p_price, v_sub_id, 'Subscription started'),
        (p_creator_id, 'subscription', p_price * 0.85, v_sub_id, 'New subscriber');

    -- Notify creator
    INSERT INTO notifications (user_id, text, type, reference_id)
    VALUES (p_creator_id, 'You have a new subscriber!', 'system', v_sub_id);

    RETURN jsonb_build_object('success', true, 'subscription_id', v_sub_id);
END;
$$;
