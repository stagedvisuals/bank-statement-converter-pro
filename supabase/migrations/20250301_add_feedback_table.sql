-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  anonymous BOOLEAN DEFAULT false,
  conversion_id TEXT,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous feedback insert" ON feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view feedback
CREATE POLICY "Only admins can view feedback" ON feedback
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for faster queries
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
