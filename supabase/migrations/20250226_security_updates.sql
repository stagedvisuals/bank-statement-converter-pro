-- Voeg beveiligingskolommen toe aan user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS registration_ip TEXT,
ADD COLUMN IF NOT EXISTS last_login_ip TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS vpn_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS flag_reason TEXT,
ADD COLUMN IF NOT EXISTS trial_conversions_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS last_country_code TEXT;

-- Maak security_logs tabel
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  event_type TEXT NOT NULL,
  ip_address TEXT,
  country_code TEXT,
  device_fingerprint TEXT,
  vpn_score INTEGER,
  risk_score INTEGER,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor snelle IP lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_registration_ip ON user_profiles(registration_ip);
CREATE INDEX IF NOT EXISTS idx_user_profiles_device_fingerprint ON user_profiles(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);

-- RLS policies voor security_logs
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON security_logs;
CREATE POLICY "Service role only" ON security_logs 
USING (auth.role() = 'service_role');
