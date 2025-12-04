-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/eahhtcxerkysxlejqyww/sql

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "from" VARCHAR(255),
  "to" VARCHAR(255),
  description TEXT,
  images TEXT[] DEFAULT '{}',
  "hotelAccommodation" VARCHAR(255),
  "roundTripFlights" VARCHAR(255),
  transportation VARCHAR(255),
  meals VARCHAR(255),
  "visaAssistance" VARCHAR(255),
  "expertGuides" VARCHAR(255),
  "supportServices" VARCHAR(255),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  "imageUrl" VARCHAR(500) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tours table
DROP TRIGGER IF EXISTS update_tours_updated_at ON tours;
CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON tours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
