-- Create the velocity_readings table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE velocity_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  velocity INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pitching', 'pulldown', 'infield', 'knees')),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster date-based queries
CREATE INDEX idx_velocity_readings_date ON velocity_readings(date DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE velocity_readings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for simple use case)
-- For production, you'd want to add user authentication
CREATE POLICY "Allow all operations" ON velocity_readings
  FOR ALL
  USING (true)
  WITH CHECK (true);
