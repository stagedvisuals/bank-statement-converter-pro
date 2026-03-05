-- Simple free_scans table migration - Fort Knox Anti-Abuse
-- Migration: 20260305102700_simple_free_scans.sql

-- Create free_scans table if not exists
CREATE TABLE IF NOT EXISTS free_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  cookie_id TEXT NOT NULL,
  localStorage_id TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Unique constraint to prevent duplicate scans
  UNIQUE(ip_address, cookie_id, localStorage_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_free_scans_ip ON free_scans(ip_address);
CREATE INDEX IF NOT EXISTS idx_free_scans_cookie ON free_scans(cookie_id);
CREATE INDEX IF NOT EXISTS idx_free_scans_localstorage ON free_scans(localStorage_id);
CREATE INDEX IF NOT EXISTS idx_free_scans_expires ON free_scans(expires_at);

-- Enable Row Level Security
ALTER TABLE free_scans ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Enable insert for all users" ON free_scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for service role" ON free_scans
  FOR SELECT USING (auth.role() = 'service_role');

-- Simple function to check if scan is allowed
CREATE OR REPLACE FUNCTION can_perform_free_scan(
  p_ip_address TEXT,
  p_cookie_id TEXT,
  p_localStorage_id TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM free_scans 
    WHERE (ip_address = p_ip_address OR cookie_id = p_cookie_id OR localStorage_id = p_localStorage_id)
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple function to record a free scan
CREATE OR REPLACE FUNCTION record_free_scan(
  p_ip_address TEXT,
  p_cookie_id TEXT,
  p_localStorage_id TEXT,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_scan_id UUID;
BEGIN
  INSERT INTO free_scans (ip_address, cookie_id, localStorage_id, user_agent)
  VALUES (p_ip_address, p_cookie_id, p_localStorage_id, p_user_agent)
  ON CONFLICT (ip_address, cookie_id, localStorage_id) 
  DO UPDATE SET created_at = NOW(), expires_at = NOW() + INTERVAL '24 hours'
  RETURNING id INTO v_scan_id;
  
  RETURN v_scan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify table creation
COMMENT ON TABLE free_scans IS 'Fort Knox Anti-Abuse: Tracks free scans with 24-hour expiry';
