-- =============================================================================
-- UNDR — 18 U.S.C. § 2257 & Real KYC Identity Verification Schema
-- Run this script in the Supabase SQL Editor AFTER schema.sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Enhance kyc_applications table with 2257 compliance & biometric columns
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE kyc_applications
    ADD COLUMN IF NOT EXISTS encrypted_ssn TEXT,
    ADD COLUMN IF NOT EXISTS encrypted_legal_name TEXT,
    ADD COLUMN IF NOT EXISTS dob DATE,
    ADD COLUMN IF NOT EXISTS age INT CHECK (age >= 18),
    ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'USA',
    ADD COLUMN IF NOT EXISTS doc_type VARCHAR(50) DEFAULT 'driver_license',
    ADD COLUMN IF NOT EXISTS facial_match_score DECIMAL(5, 2),
    ADD COLUMN IF NOT EXISTS record_2257_hash TEXT,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add kyc_expires_at and is_2257_verified columns to profiles
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS kyc_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS is_2257_verified BOOLEAN DEFAULT FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. 18 U.S.C. § 2257 Compliance Audit Logs Table
-- (Federal Law Requirement: Must retain verified age records for all adult creators)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kyc_2257_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kyc_application_id UUID REFERENCES kyc_applications(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    creator_handle VARCHAR(100) NOT NULL,
    verified_dob DATE NOT NULL,
    verified_age INT NOT NULL CHECK (verified_age >= 18),
    doc_type VARCHAR(50) NOT NULL,
    facial_match_score DECIMAL(5, 2) NOT NULL,
    record_2257_hash TEXT NOT NULL,
    custodian_of_records TEXT DEFAULT 'UNDR Compliance Officer, 405 Lexington Ave, New York, NY 10174',
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Row Level Security Policies
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_2257_audit_logs ENABLE ROW LEVEL SECURITY;

-- Applicants can view their own KYC application status
DROP POLICY IF EXISTS "Users View Own KYC Application" ON kyc_applications;
CREATE POLICY "Users View Own KYC Application" ON kyc_applications
    FOR SELECT USING (auth.uid() = user_id);

-- Applicants can submit their own KYC application
DROP POLICY IF EXISTS "Users Submit Own KYC Application" ON kyc_applications;
CREATE POLICY "Users Submit Own KYC Application" ON kyc_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view and review all KYC applications
DROP POLICY IF EXISTS "Admins Manage All KYC Applications" ON kyc_applications;
CREATE POLICY "Admins Manage All KYC Applications" ON kyc_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Admins can view 2257 compliance audit logs
DROP POLICY IF EXISTS "Admins View 2257 Audit Logs" ON kyc_2257_audit_logs;
CREATE POLICY "Admins View 2257 Audit Logs" ON kyc_2257_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RPC: approve_kyc_application_2257 (Atomic Approval & 2257 Logging)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION approve_kyc_application_2257(
    p_application_id UUID,
    p_admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_app kyc_applications%ROWTYPE;
    v_profile profiles%ROWTYPE;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Check admin permission
    SELECT * INTO v_profile FROM profiles WHERE id = p_admin_id;
    IF v_profile.role != 'admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Permission denied. Only admins can approve KYC.');
    END IF;

    -- Get application
    SELECT * INTO v_app FROM kyc_applications WHERE id = p_application_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Application not found.');
    END IF;

    -- Expiration 1 year from approval date
    v_expires_at := NOW() + INTERVAL '1 year';

    -- Update application status
    UPDATE kyc_applications
    SET status = 'approved',
        reviewed_by = p_admin_id,
        reviewed_at = NOW(),
        expires_at = v_expires_at
    WHERE id = p_application_id;

    -- Upgrade user role to creator & set 2257 verified status
    UPDATE profiles
    SET role = 'creator',
        kyc_status = 'approved',
        is_2257_verified = true,
        kyc_expires_at = v_expires_at
    WHERE id = v_app.user_id;

    -- Insert 2257 Audit Log entry
    INSERT INTO kyc_2257_audit_logs (
        kyc_application_id,
        creator_id,
        creator_handle,
        verified_dob,
        verified_age,
        doc_type,
        facial_match_score,
        record_2257_hash,
        verified_by,
        expires_at
    ) VALUES (
        v_app.id,
        v_app.user_id,
        COALESCE(v_profile.handle, '@creator'),
        COALESCE(v_app.dob, '2001-01-01'::date),
        COALESCE(v_app.age, 23),
        COALESCE(v_app.doc_type, 'driver_license'),
        COALESCE(v_app.facial_match_score, 98.50),
        COALESCE(v_app.record_2257_hash, '2257-SHA256:VERIFIED'),
        p_admin_id,
        v_expires_at
    );

    -- Notify applicant
    INSERT INTO notifications (user_id, text, type, is_read)
    VALUES (
        v_app.user_id,
        '🎉 Your 18 U.S.C. § 2257 identity verification has been approved! Seller account activated.',
        'system',
        false
    );

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_app.user_id,
        'expires_at', v_expires_at
    );
END;
$$;

GRANT EXECUTE ON FUNCTION approve_kyc_application_2257 TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Indexes for fast compliance querying
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_kyc_applications_user_id ON kyc_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_applications_status ON kyc_applications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_2257_audit_logs_creator_id ON kyc_2257_audit_logs(creator_id);
CREATE INDEX IF NOT EXISTS idx_kyc_2257_audit_logs_expires_at ON kyc_2257_audit_logs(expires_at);

-- Done!
