-- Multi-Agent System Database Schema
-- Background Workers voor BSC PRO

-- 1. Agent Job Queue (voor alle background tasks)
CREATE TABLE IF NOT EXISTS agent_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_type TEXT NOT NULL CHECK (agent_type IN ('onboarding', 'quality', 'market')),
    job_type TEXT NOT NULL,
    payload JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3
);

-- 2. Onboarding Agent Tracking
CREATE TABLE IF NOT EXISTS onboarding_retention_flows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_step TEXT NOT NULL,
    trigger_reason TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    email_opened BOOLEAN DEFAULT FALSE,
    email_clicked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_retention UNIQUE (user_id, current_step)
);

-- 3. Quality Agent - Scan Flags
CREATE TABLE IF NOT EXISTS scan_quality_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scan_id TEXT NOT NULL,
    file_name TEXT,
    confidence_score NUMERIC,
    threshold NUMERIC DEFAULT 0.75,
    flagged_fields JSONB,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'false_positive')),
    ai_suggestion TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id)
);

-- 4. Market Agent - Trends Data
CREATE TABLE IF NOT EXISTS market_trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword TEXT NOT NULL,
    trend_score INTEGER,
    search_volume INTEGER,
    related_queries JSONB,
    geo_region TEXT DEFAULT 'NL',
    time_range TEXT,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    week_number INTEGER,
    year INTEGER
);

-- 5. Market Agent Reports
CREATE TABLE IF NOT EXISTS market_agent_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    report_data JSONB,
    insights TEXT[],
    recommendations TEXT[],
    sent_to_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_week_report UNIQUE (week_number, year)
);

-- 6. Agent Logs (voor debugging)
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_type TEXT NOT NULL,
    log_level TEXT DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warning', 'error')),
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes voor performance
CREATE INDEX idx_agent_jobs_status ON agent_jobs(status);
CREATE INDEX idx_agent_jobs_agent_type ON agent_jobs(agent_type);
CREATE INDEX idx_agent_jobs_created_at ON agent_jobs(created_at);
CREATE INDEX idx_onboarding_retention_user ON onboarding_retention_flows(user_id);
CREATE INDEX idx_scan_quality_user ON scan_quality_flags(user_id);
CREATE INDEX idx_scan_quality_status ON scan_quality_flags(status);
CREATE INDEX idx_market_trends_keyword ON market_trends(keyword);
CREATE INDEX idx_market_trends_week ON market_trends(week_number, year);
CREATE INDEX idx_agent_logs_type ON agent_logs(agent_type, created_at);

-- RLS Policies
ALTER TABLE agent_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_retention_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_quality_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_agent_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Admin kan alles zien
CREATE POLICY "Admin full access" ON agent_jobs
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin'));

CREATE POLICY "Admin full access retention" ON onboarding_retention_flows
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin'));

CREATE POLICY "Admin full access quality" ON scan_quality_flags
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin'));

CREATE POLICY "Admin full access market" ON market_trends
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin'));

CREATE POLICY "Admin full access reports" ON market_agent_reports
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = 'admin'));

-- Users kunnen hun eigen quality flags zien
CREATE POLICY "Users view own quality flags" ON scan_quality_flags
    FOR SELECT USING (user_id = auth.uid());

-- Function om agent logs toe te voegen
CREATE OR REPLACE FUNCTION log_agent_activity(
    p_agent_type TEXT,
    p_log_level TEXT,
    p_message TEXT,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO agent_logs (agent_type, log_level, message, metadata)
    VALUES (p_agent_type, p_log_level, p_message, p_metadata);
END;
$$ LANGUAGE plpgsql;
