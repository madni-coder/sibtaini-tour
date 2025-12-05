-- Create Journey table for storing media files (images and videos)
-- Run this SQL query in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS journey (
    id SERIAL PRIMARY KEY,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" VARCHAR(10) NOT NULL CHECK ("mediaType" IN ('image', 'video')),
    "fileName" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on createdAt for faster sorting
CREATE INDEX IF NOT EXISTS idx_journey_created_at ON journey("createdAt" DESC);

-- Create index on mediaType for filtering
CREATE INDEX IF NOT EXISTS idx_journey_media_type ON journey("mediaType");

-- Add comment to table
COMMENT ON TABLE journey IS 'Stores journey media items (images and videos) uploaded to Supabase storage';
COMMENT ON COLUMN journey."mediaUrl" IS 'Public URL of the media file in Supabase storage';
COMMENT ON COLUMN journey."mediaType" IS 'Type of media: image or video';
COMMENT ON COLUMN journey."fileName" IS 'Original filename of the uploaded media';
COMMENT ON COLUMN journey."createdAt" IS 'Timestamp when the media was uploaded';
