-- Retentie Systeem Database Schema
-- Dit moet worden uitgevoerd in Supabase SQL Editor

-- 1. Credits Systeem
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_credits INTEGER DEFAULT 1,
    used_credits INTEGER DEFAULT 0,
    remaining_credits INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_credits UNIQUE (user_id)
);

-- 2. Onboarding Status Tracking
CREATE TABLE IF NOT EXISTS onboarding_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Onboarding stappen (0-100%)
    step_profile_completed BOOLEAN DEFAULT FALSE,
    step_first_upload_completed BOOLEAN DEFAULT FALSE,
    step_first_export_completed BOOLEAN DEFAULT FALSE,
    step_tools_used_completed BOOLEAN DEFAULT FALSE,
    step_settings_completed BOOLEAN DEFAULT FALSE,
    -- Voortgang
    progress_percentage INTEGER DEFAULT 0,
    reward_claimed BOOLEAN DEFAULT FALSE,
    -- Metadata
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_onboarding UNIQUE (user_id)
);

-- 3. Anonieme Tool Data (voor sync na registratie)
CREATE TABLE IF NOT EXISTS anonymous_tool_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tool_type TEXT NOT NULL CHECK (tool_type IN ('btw', 'deadline', 'kilometer')),
    input_data JSONB,
    result_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_to_user BOOLEAN DEFAULT FALSE
);

-- 4. Email Workflow Tracking
CREATE TABLE IF NOT EXISTS email_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_type TEXT NOT NULL CHECK (workflow_type IN ('day1', 'day3', 'day7')),
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'bounced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_workflow UNIQUE (user_id, workflow_type)
);

-- 5. Credit Transactions (voor audit log)
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('initial', 'reward', 'usage', 'purchase')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes voor performance
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_onboarding_status_user_id ON onboarding_status(user_id);
CREATE INDEX idx_anonymous_tool_session ON anonymous_tool_data(session_id);
CREATE INDEX idx_email_workflows_user ON email_workflows(user_id);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);

-- RLS Policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_tool_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Credits policies
CREATE POLICY "Users can view own credits" ON user_credits
    FOR SELECT USING (user_id = auth.uid());

-- Onboarding policies
CREATE POLICY "Users can view own onboarding" ON onboarding_status
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own onboarding" ON onboarding_status
    FOR UPDATE USING (user_id = auth.uid());

-- Anonymous data policies
CREATE POLICY "Users can view own anonymous data" ON anonymous_tool_data
    FOR SELECT USING (user_id = auth.uid() OR session_id = current_setting('app.session_id', TRUE));

-- Email workflow policies
CREATE POLICY "Users can view own email workflows" ON email_workflows
    FOR SELECT USING (user_id = auth.uid());

-- Credit transactions policies
CREATE POLICY "Users can view own transactions" ON credit_transactions
    FOR SELECT USING (user_id = auth.uid());

-- Triggers voor updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON user_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_status_updated_at ON onboarding_status;
CREATE TRIGGER update_onboarding_status_updated_at
    BEFORE UPDATE ON onboarding_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Functie om onboarding progress te berekenen
CREATE OR REPLACE FUNCTION calculate_onboarding_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_steps INTEGER := 5;
    completed_steps INTEGER := 0;
    new_percentage INTEGER;
BEGIN
    IF NEW.step_profile_completed THEN completed_steps := completed_steps + 1; END IF;
    IF NEW.step_first_upload_completed THEN completed_steps := completed_steps + 1; END IF;
    IF NEW.step_first_export_completed THEN completed_steps := completed_steps + 1; END IF;
    IF NEW.step_tools_used_completed THEN completed_steps := completed_steps + 1; END IF;
    IF NEW.step_settings_completed THEN completed_steps := completed_steps + 1; END IF;
    
    new_percentage := (completed_steps * 100) / total_steps;
    NEW.progress_percentage := new_percentage;
    
    -- Als 100% en reward nog niet geclaimd, voeg credits toe
    IF new_percentage = 100 AND NOT NEW.reward_claimed AND OLD.progress_percentage < 100 THEN
        NEW.reward_claimed := TRUE;
        NEW.completed_at := NOW();
        
        -- Voeg 2 credits toe als beloning
        INSERT INTO credit_transactions (user_id, amount, type, description)
        VALUES (NEW.user_id, 2, 'reward', 'Onboarding completed bonus');
        
        UPDATE user_credits 
        SET total_credits = total_credits + 2,
            remaining_credits = remaining_credits + 2,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_onboarding_completion ON onboarding_status;
CREATE TRIGGER check_onboarding_completion
    BEFORE UPDATE ON onboarding_status
    FOR EACH ROW EXECUTE FUNCTION calculate_onboarding_progress();

-- Functie om nieuwe user credits te initialiseren
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_credits (user_id, total_credits, remaining_credits)
    VALUES (NEW.id, 1, 1);
    
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (NEW.id, 1, 'initial', 'Welcome bonus');
    
    INSERT INTO onboarding_status (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger op auth.users voor nieuwe registraties
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION initialize_user_credits();

-- Bestaande users voorzien van credits en onboarding
INSERT INTO user_credits (user_id, total_credits, remaining_credits)
SELECT id, 1, 1 FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits)
ON CONFLICT DO NOTHING;

INSERT INTO onboarding_status (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM onboarding_status)
ON CONFLICT DO NOTHING;
