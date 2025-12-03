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

-- =====================================================
-- LIFT RECORDS TABLE
-- =====================================================

CREATE TABLE lift_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lift_type TEXT NOT NULL CHECK (lift_type IN (
    'deadlift', 'back_squat', 'front_squat', 'lunge', 'bench', 
    'dumbbell_bench', 'cable_throws', 'cable_pulls', 'rows', 
    'leg_press', 'tricep_extensions'
  )),
  weight INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 1,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster date-based queries
CREATE INDEX idx_lift_records_date ON lift_records(date DESC);

-- Enable Row Level Security
ALTER TABLE lift_records ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations" ON lift_records
  FOR ALL
  USING (true)
  WITH CHECK (true);
