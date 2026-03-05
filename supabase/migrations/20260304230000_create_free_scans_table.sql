-- Create free_scans table for PLG anti-abuse tracking
CREATE TABLE IF NOT EXISTS free_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  cookie_id VARCHAR(64),
  localStorage_id VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Composite index for fast lookups
  CONSTRAINT unique_tracking UNIQUE(ip_address, cookie_id, localStorage_id)
);

-- Index for IP-based lookups
CREATE INDEX IF NOT EXISTS idx_free_scans_ip ON free_scans(ip_address);
CREATE INDEX IF NOT EXISTS idx_free_scans_cookie ON free_scans(cookie_id);
CREATE INDEX IF NOT EXISTS idx_free_scans_localstorage ON free_scans(localStorage_id);
CREATE INDEX IF NOT EXISTS idx_free_scans_expires ON free_scans(expires_at);

-- Function to check if user can perform free scan
CREATE OR REPLACE FUNCTION can_perform_free_scan(
  p_ip_address INET,
  p_cookie_id VARCHAR(64),
  p_localStorage_id VARCHAR(64)
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if any of the tracking methods already exists and hasn't expired
  RETURN NOT EXISTS (
    SELECT 1 FROM free_scans 
    WHERE (
      ip_address = p_ip_address 
      OR cookie_id = p_cookie_id 
      OR localStorage_id = p_localStorage_id
    )
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to record a free scan
CREATE OR REPLACE FUNCTION record_free_scan(
  p_ip_address INET,
  p_cookie_id VARCHAR(64),
  p_localStorage_id VARCHAR(64),
  p_user_agent TEXT
) RETURNS UUID AS $$
DECLARE
  v_scan_id UUID;
BEGIN
  -- Clean up expired scans first
  DELETE FROM free_scans WHERE expires_at <= NOW();
  
  -- Insert new scan record
  INSERT INTO free_scans (ip_address, cookie_id, localStorage_id, user_agent)
  VALUES (p_ip_address, p_cookie_id, p_localStorage_id, p_user_agent)
  RETURNING id INTO v_scan_id;
  
  RETURN v_scan_id;
END;
$$ LANGUAGE plpgsql;
