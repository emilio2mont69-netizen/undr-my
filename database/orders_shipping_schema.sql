-- =============================================================================
-- UNDR — Real Orders, Shipping & Escrow Disputes Schema
-- Run this script in the Supabase SQL Editor
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Orders Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    buyer_handle VARCHAR(100) NOT NULL,
    creator_handle VARCHAR(100) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    product_image TEXT,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    addons_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'paid' CHECK (status IN ('paid', 'processing', 'shipped', 'in_transit', 'delivered', 'disputed', 'refunded', 'cancelled')),
    shipping_carrier VARCHAR(50) DEFAULT 'USPS',
    shipping_service VARCHAR(100) DEFAULT 'USPS Priority Mail 2-Day (Discreet)',
    tracking_number VARCHAR(100),
    label_url TEXT,
    shipping_address JSONB,
    dispute_reason TEXT,
    dispute_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own orders
DROP POLICY IF EXISTS "Buyers View Own Orders" ON orders;
CREATE POLICY "Buyers View Own Orders" ON orders
    FOR SELECT USING (auth.uid() = buyer_id);

-- Creators can view orders for their products
DROP POLICY IF EXISTS "Creators View Received Orders" ON orders;
CREATE POLICY "Creators View Received Orders" ON orders
    FOR SELECT USING (auth.uid() = creator_id);

-- Admins can view all orders
DROP POLICY IF EXISTS "Admins View All Orders" ON orders;
CREATE POLICY "Admins View All Orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Order Tracking Events Log Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_tracking_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255) DEFAULT 'USPS Regional Sorting Facility',
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_tracking_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Tracking Events" ON order_tracking_events;
CREATE POLICY "Public Read Tracking Events" ON order_tracking_events
    FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Atomic RPC: generate_shipping_label_server_side
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION generate_shipping_label_server_side(
    p_order_id UUID,
    p_carrier VARCHAR(50),
    p_tracking_number VARCHAR(100),
    p_label_url TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_order orders%ROWTYPE;
BEGIN
    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    UPDATE orders
    SET status = 'processing',
        shipping_carrier = p_carrier,
        tracking_number = p_tracking_number,
        label_url = p_label_url
    WHERE id = p_order_id;

    INSERT INTO order_tracking_events (order_id, status, description)
    VALUES (
        p_order_id,
        'processing',
        format('Shipping Label generated via %s. Pre-Shipment Info Sent to Postal Service.', p_carrier)
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'tracking_number', p_tracking_number,
        'label_url', p_label_url
    );
END;
$$;

GRANT EXECUTE ON FUNCTION generate_shipping_label_server_side TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Atomic RPC: update_order_status_server_side
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_order_status_server_side(
    p_order_id UUID,
    p_status VARCHAR(50),
    p_description TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_order orders%ROWTYPE;
BEGIN
    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    UPDATE orders
    SET status = p_status,
        shipped_at = CASE WHEN p_status = 'shipped' THEN NOW() ELSE shipped_at END,
        delivered_at = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END
    WHERE id = p_order_id;

    INSERT INTO order_tracking_events (order_id, status, description)
    VALUES (p_order_id, p_status, p_description);

    -- Notify buyer
    INSERT INTO notifications (user_id, text, type, is_read)
    VALUES (v_order.buyer_id, p_description, 'order_update', false);

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'status', p_status
    );
END;
$$;

GRANT EXECUTE ON FUNCTION update_order_status_server_side TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Atomic RPC: resolve_order_dispute_server_side
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION resolve_order_dispute_server_side(
    p_order_id UUID,
    p_resolution VARCHAR(50),
    p_admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_order orders%ROWTYPE;
    v_admin profiles%ROWTYPE;
    v_creator_earning DECIMAL(10, 2);
BEGIN
    SELECT * INTO v_admin FROM profiles WHERE id = p_admin_id;
    IF v_admin.role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Permission denied. Admin role required.');
    END IF;

    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    IF p_resolution = 'refund_buyer' THEN
        -- Refund buyer
        UPDATE profiles SET balance = balance + v_order.total_amount WHERE id = v_order.buyer_id;
        UPDATE orders SET status = 'refunded', dispute_status = 'resolved_refunded' WHERE id = p_order_id;

        INSERT INTO notifications (user_id, text, type, is_read)
        VALUES (v_order.buyer_id, format('💸 Dispute Resolved: $%s USD has been refunded to your account balance.', v_order.total_amount), 'order_refund', false);

    ELSIF p_resolution = 'release_creator' THEN
        -- Release 80% to creator
        v_creator_earning := v_order.total_amount * 0.80;
        UPDATE profiles SET balance = balance + v_creator_earning WHERE id = v_order.creator_id;
        UPDATE orders SET status = 'delivered', dispute_status = 'resolved_creator_paid' WHERE id = p_order_id;

        INSERT INTO notifications (user_id, text, type, is_read)
        VALUES (v_order.creator_id, format('💰 Dispute Resolved: Escrow funds of $%s USD released to your balance.', v_creator_earning), 'order_payout', false);
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'resolution', p_resolution
    );
END;
$$;

GRANT EXECUTE ON FUNCTION resolve_order_dispute_server_side TO authenticated;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_creator_id ON orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
