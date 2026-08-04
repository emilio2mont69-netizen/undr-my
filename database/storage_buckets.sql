-- =============================================================================
-- UNDR — Storage Buckets & Policies SQL Setup
-- Run this script in the Supabase SQL Editor
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Create Buckets in storage.buckets
-- ─────────────────────────────────────────────────────────────────────────────

-- Bucket 1: product-images (Public - Catalog items)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images', 
    'product-images', 
    true, 
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket 2: avatars (Public - User & Creator profile photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars', 
    'avatars', 
    true, 
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket 3: kyc-documents (Private - Identity cards & selfie verification)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'kyc-documents', 
    'kyc-documents', 
    false, -- Private!
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket 4: ppv-media (Private - Locked chat packs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'ppv-media', 
    'ppv-media', 
    false, -- Private!
    20971520, -- 20MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Storage Security RLS Policies on storage.objects
-- ─────────────────────────────────────────────────────────────────────────────

-- A. PUBLIC PRODUCT IMAGES POLICIES
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated Upload Product Images" ON storage.objects;
CREATE POLICY "Authenticated Upload Product Images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Creators Delete Product Images" ON storage.objects;
CREATE POLICY "Creators Delete Product Images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

-- B. PUBLIC AVATARS POLICIES
DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;
CREATE POLICY "Public Read Avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated Upload Avatars" ON storage.objects;
CREATE POLICY "Authenticated Upload Avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Users Update Own Avatars" ON storage.objects;
CREATE POLICY "Users Update Own Avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
    );

-- C. PRIVATE KYC DOCUMENTS POLICIES
DROP POLICY IF EXISTS "Users Upload Own KYC Docs" ON storage.objects;
CREATE POLICY "Users Upload Own KYC Docs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'kyc-documents' 
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Users Read Own KYC Docs or Admin" ON storage.objects;
CREATE POLICY "Users Read Own KYC Docs or Admin" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'kyc-documents' 
        AND (
            auth.uid()::text = (storage.foldername(name))[2]
            OR EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
        )
    );

-- D. PRIVATE PPV MEDIA POLICIES
DROP POLICY IF EXISTS "Creators Upload PPV Media" ON storage.objects;
CREATE POLICY "Creators Upload PPV Media" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ppv-media' 
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Conversation Participants Read PPV Media" ON storage.objects;
CREATE POLICY "Conversation Participants Read PPV Media" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'ppv-media' 
        AND auth.role() = 'authenticated'
    );

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! Buckets and RLS policies are now active.
-- ─────────────────────────────────────────────────────────────────────────────
