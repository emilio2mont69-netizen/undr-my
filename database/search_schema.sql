-- =============================================================================
-- UNDR — Real Server-Side Full-Text Search & Compound Filtering Schema
-- Run this script in the Supabase SQL Editor
-- =============================================================================

-- Step 1: Ensure columns exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_presale') THEN
        ALTER TABLE products ADD COLUMN is_presale BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_available_today') THEN
        ALTER TABLE products ADD COLUMN is_available_today BOOLEAN DEFAULT TRUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_new') THEN
        ALTER TABLE products ADD COLUMN is_new BOOLEAN DEFAULT TRUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_auction') THEN
        ALTER TABLE products ADD COLUMN is_auction BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Step 2: Add tsvector generated column for multi-lingual title, description and tags
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
    to_tsvector('english', 
        coalesce(title_en, '') || ' ' || 
        coalesce(description_en, '') || ' ' || 
        coalesce(style, '') || ' ' || 
        coalesce(extra_tag_en, '')
    ) || 
    to_tsvector('spanish', 
        coalesce(title_es, '') || ' ' || 
        coalesce(description_es, '') || ' ' || 
        coalesce(extra_tag_es, '')
    )
) STORED;

-- Create GIN index for high performance full-text search (<5ms queries)
CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING gin(fts);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
CREATE INDEX IF NOT EXISTS idx_products_style ON products(style);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 3: Atomic RPC search_products_server_side
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION search_products_server_side(
    p_query TEXT DEFAULT NULL,
    p_size VARCHAR(20) DEFAULT 'all',
    p_style VARCHAR(50) DEFAULT 'all',
    p_min_price DECIMAL(10, 2) DEFAULT 0.00,
    p_max_price DECIMAL(10, 2) DEFAULT 9999.00,
    p_creator_handle VARCHAR(100) DEFAULT 'all',
    p_availability VARCHAR(50) DEFAULT 'all',
    p_sort_by VARCHAR(50) DEFAULT 'newest',
    p_page INT DEFAULT 1,
    p_limit INT DEFAULT 12
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_offset INT;
    v_total_count INT;
    v_total_pages INT;
    v_products JSONB;
BEGIN
    v_offset := (p_page - 1) * p_limit;

    -- Count total matching rows
    SELECT COUNT(*) INTO v_total_count
    FROM products p
    JOIN profiles c ON p.creator_id = c.id
    WHERE p.status = 'active'
      AND (p_query IS NULL OR trim(p_query) = '' OR p.fts @@ websearch_to_tsquery('english', p_query) OR p.fts @@ websearch_to_tsquery('spanish', p_query))
      AND (p_size = 'all' OR p.size = p_size)
      AND (p_style = 'all' OR lower(p.style) = lower(p_style))
      AND (p.price >= p_min_price AND p.price <= p_max_price)
      AND (p_creator_handle = 'all' OR c.handle = p_creator_handle)
      AND (
          p_availability = 'all' OR
          (p_availability = 'available_today' AND p.is_available_today = true) OR
          (p_availability = 'new_arrivals' AND p.is_new = true) OR
          (p_availability = 'auctions' AND p.is_auction = true) OR
          (p_availability = 'presale' AND p.is_presale = true)
      );

    v_total_pages := GREATEST(CEIL(v_total_count::DECIMAL / p_limit::DECIMAL), 1);

    -- Fetch paginated products JSON array
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'id', p.id,
            'title', p.title_en,
            'en', jsonb_build_object('title', p.title_en, 'description', p.description_en),
            'es', jsonb_build_object('title', p.title_es, 'description', p.description_es),
            'price', p.price,
            'size', p.size,
            'style', p.style,
            'wearTime', p.wear_time,
            'image', p.image_url,
            'isFeatured', p.is_featured,
            'isNew', p.is_new,
            'isAvailableToday', p.is_available_today,
            'isAuction', p.is_auction,
            'isPresale', p.is_presale,
            'likesCount', p.likes_count,
            'creator', jsonb_build_object(
                'id', c.id,
                'name', c.username,
                'handle', c.handle,
                'avatar', c.avatar_url,
                'verified', (c.kyc_status = 'approved')
            )
        )
    ), '[]'::jsonb) INTO v_products
    FROM (
        SELECT p.*
        FROM products p
        JOIN profiles c ON p.creator_id = c.id
        WHERE p.status = 'active'
          AND (p_query IS NULL OR trim(p_query) = '' OR p.fts @@ websearch_to_tsquery('english', p_query) OR p.fts @@ websearch_to_tsquery('spanish', p_query))
          AND (p_size = 'all' OR p.size = p_size)
          AND (p_style = 'all' OR lower(p.style) = lower(p_style))
          AND (p.price >= p_min_price AND p.price <= p_max_price)
          AND (p_creator_handle = 'all' OR c.handle = p_creator_handle)
          AND (
              p_availability = 'all' OR
              (p_availability = 'available_today' AND p.is_available_today = true) OR
              (p_availability = 'new_arrivals' AND p.is_new = true) OR
              (p_availability = 'auctions' AND p.is_auction = true) OR
              (p_availability = 'presale' AND p.is_presale = true)
          )
        ORDER BY 
            CASE WHEN p_sort_by = 'price_asc' THEN p.price END ASC,
            CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
            CASE WHEN p_sort_by = 'popular' THEN p.likes_count END DESC,
            CASE WHEN p_sort_by = 'newest' OR p_sort_by IS NULL THEN p.created_at END DESC
        LIMIT p_limit OFFSET v_offset
    ) p
    JOIN profiles c ON p.creator_id = c.id;

    RETURN jsonb_build_object(
        'success', true,
        'products', v_products,
        'total_count', v_total_count,
        'page', p_page,
        'limit', p_limit,
        'total_pages', v_total_pages,
        'has_more', (p_page < v_total_pages)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION search_products_server_side TO authenticated;
GRANT EXECUTE ON FUNCTION search_products_server_side TO anon;
