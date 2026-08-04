-- =============================================================================
-- UNDR — Real Legal Pages, 2257 Compliance & DMCA Takedowns Schema
-- Run this script in the Supabase SQL Editor
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Legal Documents Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doc_key VARCHAR(50) UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_es TEXT NOT NULL,
    version VARCHAR(20) DEFAULT '1.0.0',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Legal Documents" ON legal_documents;
CREATE POLICY "Public Read Legal Documents" ON legal_documents FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. DMCA Takedown Requests Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dmca_takedown_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complainant_name VARCHAR(255) NOT NULL,
    complainant_email VARCHAR(255) NOT NULL,
    infringing_url TEXT NOT NULL,
    copyright_proof_description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'removed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dmca_takedown_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins Read DMCA Claims" ON dmca_takedown_requests;
CREATE POLICY "Admins Read DMCA Claims" ON dmca_takedown_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Atomic RPC: submit_dmca_takedown_request
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION submit_dmca_takedown_request(
    p_name VARCHAR(255),
    p_email VARCHAR(255),
    p_url TEXT,
    p_proof TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO dmca_takedown_requests (complainant_name, complainant_email, infringing_url, copyright_proof_description)
    VALUES (p_name, p_email, p_url, p_proof);

    RETURN jsonb_build_object('success', true, 'message', 'DMCA Takedown Notice logged successfully.');
END;
$$;

GRANT EXECUTE ON FUNCTION submit_dmca_takedown_request TO authenticated;
GRANT EXECUTE ON FUNCTION submit_dmca_takedown_request TO anon;
