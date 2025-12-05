-- ============================================
-- QUICK SETUP: Journey API
-- ============================================
-- Copy and run these queries in Supabase SQL Editor
-- ============================================

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS journey (
    id SERIAL PRIMARY KEY,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" VARCHAR(10) NOT NULL CHECK ("mediaType" IN ('image', 'video')),
    "fileName" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_journey_created_at ON journey("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_journey_media_type ON journey("mediaType");

-- 3. VERIFY TABLE CREATED
SELECT * FROM journey;

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================
-- Run these AFTER creating the 'journey' bucket in Supabase Storage UI
-- ============================================

-- Policy 1: Public Read Access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'journey' );

-- Policy 2: Authenticated Upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'journey' AND auth.role() = 'authenticated' );

-- Policy 3: Authenticated Delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'journey' AND auth.role() = 'authenticated' );

-- ============================================
-- MANUAL BUCKET CREATION (if needed via SQL)
-- ============================================
-- Note: It's easier to create bucket via Supabase UI
-- But if you need SQL:
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('journey', 'journey', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TESTING QUERIES
-- ============================================

-- View all journey items
SELECT * FROM journey ORDER BY "createdAt" DESC;

-- Count items by type
SELECT "mediaType", COUNT(*) as count 
FROM journey 
GROUP BY "mediaType";

-- Get recent uploads (last 7 days)
SELECT * FROM journey 
WHERE "createdAt" >= NOW() - INTERVAL '7 days'
ORDER BY "createdAt" DESC;

-- Delete specific item (replace ID)
DELETE FROM journey WHERE id = 1;

-- Clear all journey items (use with caution!)
-- TRUNCATE TABLE journey RESTART IDENTITY;
