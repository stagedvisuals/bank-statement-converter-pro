-- Enhanced free_scans table with RLS policies and proper indexes
-- Migration: 20260305095000_enhanced_free_scans_with_rls.sql

-- Drop existing table if exists (for clean migration)
DROP TABLE IF EXISTS free_scans CASCADE;

-- Create free_scans table with enhanced tracking
CREATE TABLE free_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  cookie_id TEXT NOT NULL,
  localStorage_id TEXT NOT NULL,
  user_agent TEXT,
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Add lead tracking columns for CFO-mode
  conversion_attempted BOOLEAN DEFAULT FALSE,
  conversion_attempted_at TIMESTAMP WITH TIME ZONE,
  lead_source TEXT DEFAULT 'free_scan',
  
  -- Add indexes for performance
  CONSTRAINT free_scans_unique_tracking UNIQUE(ip_address, cookie_id, localStorage_id)
);

-- Create indexes for fast lookups
CREATE INDEX idx_free_scans_ip ON free_scans(ip_address);
CREATE INDEX idx_free_scans_cookie ON free_scans(cookie_id);
CREATE INDEX idx_free_scans_localstorage ON free_scans(localStorage_id);
CREATE INDEX idx_free_scans_expires ON free_scans(expires_at);
CREATE INDEX idx_free_scans_conversion ON free_scans(conversion_attempted);

-- Enable Row Level Security
ALTER TABLE free_scans ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Service role can do everything
CREATE POLICY "Service role full access" ON free_scans
  FOR ALL USING (auth.role() = 'service_role');

-- Anonymous users can only insert new scans (for recording)
CREATE POLICY "Anonymous can insert scans" ON free_scans
  FOR INSERT WITH CHECK (true);

-- Anonymous users can check if they already scanned (read access to their own data)
CREATE POLICY "Anonymous can read own scans" ON free_scans
  FOR SELECT USING (
    ip_address = current_setting('request.headers')::json->>'x-forwarded-for' OR
    cookie_id = current_setting('request.headers')::json->>'cookie' OR
    localStorage_id = current_setting('request.headers')::json->>'x-localstorage-id'
  );

-- Create function to check if scan is allowed
CREATE OR REPLACE FUNCTION can_perform_free_scan(
  p_ip_address TEXT,
  p_cookie_id TEXT,
  p_localStorage_id TEXT
)
RETURNS TABLE (
  allowed BOOLEAN,
  scan_id UUID,
  blocked BOOLEAN,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN TRUE
      ELSE FALSE
    END as allowed,
    f.id as scan_id,
    f.blocked,
    f.expires_at
  FROM free_scans f
  WHERE (
    f.ip_address = p_ip_address OR
    f.cookie_id = p_cookie_id OR
    f.localStorage_id = p_localStorage_id
  )
  AND f.expires_at > NOW()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to record a free scan
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
  INSERT INTO free_scans (
    ip_address,
    cookie_id,
    localStorage_id,
    user_agent,
    created_at,
    expires_at
  ) VALUES (
    p_ip_address,
    p_cookie_id,
    p_localStorage_id,
    p_user_agent,
    NOW(),
    NOW() + INTERVAL '24 hours'
  )
  ON CONFLICT (ip_address, cookie_id, localStorage_id) 
  DO UPDATE SET
    created_at = NOW(),
    expires_at = NOW() + INTERVAL '24 hours',
    user_agent = EXCLUDED.user_agent
  RETURNING id INTO v_scan_id;
  
  RETURN v_scan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to record conversion attempt (for CFO-mode tracking)
CREATE OR REPLACE FUNCTION record_conversion_attempt(
  p_scan_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE free_scans
  SET 
    conversion_attempted = TRUE,
    conversion_attempted_at = NOW()
  WHERE id = p_scan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for lead analytics (CFO-mode)
CREATE VIEW lead_analytics AS
SELECT 
  DATE(created_at) as scan_date,
  COUNT(*) as total_scans,
  COUNT(CASE WHEN conversion_attempted THEN 1 END) as conversion_attempts,
  ROUND(
    COUNT(CASE WHEN conversion_attempted THEN 1 END)::DECIMAL / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as conversion_rate_percent,
  lead_source,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT cookie_id) as unique_cookies
FROM free_scans
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), lead_source
ORDER BY scan_date DESC;

-- Add comment for documentation
COMMENT ON TABLE free_scans IS 'Tracks free scan usage with anti-abuse protection and lead conversion tracking';
COMMENT ON COLUMN free_scans.conversion_attempted IS 'CFO-mode: Track when user hits paywall and attempts to convert';
COMMENT ON COLUMN free_scans.lead_source IS 'Source of lead (free_scan, referral, etc.)';

