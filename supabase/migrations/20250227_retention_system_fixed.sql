-- Fix: Policies die al bestaan overslaan
-- Deze SQL voegt alleen toe wat nog ontbreekt

-- 1. Tabellen aanmaken (als ze niet bestaan)
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

CREATE TABLE IF NOT EXISTS onboarding_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    step_profile_completed BOOLEAN DEFAULT FALSE,
    step_first_upload_completed BOOLEAN DEFAULT FALSE,
    step_first_export_completed BOOLEAN DEFAULT FALSE,
    step_tools_used_completed BOOLEAN DEFAULT FALSE,
    step_settings_completed BOOLEAN DEFAULT FALSE,
    progress_percentage INTEGER DEFAULT 0,
    reward_claimed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_onboarding UNIQUE (user_id)
);

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

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('initial', 'reward', 'usage', 'purchase')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS aanzetten (veilig om meerdere keren te doen)
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_tool_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 3. Policies droppen als ze bestaan, dan opnieuw aanmaken
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can view own onboarding" ON onboarding_status;
DROP POLICY IF EXISTS "Users can update own onboarding" ON onboarding_status;
DROP POLICY IF EXISTS "Users can view own anonymous data" ON anonymous_tool_data;
DROP POLICY IF EXISTS "Users can view own email workflows" ON email_workflows;
DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;

-- 4. Policies opnieuw aanmaken
CREATE POLICY "Users can view own credits" ON user_credits
    FOR SELECT USING (user_id = auth.uid());
    
CREATE POLICY "Users can view own onboarding" ON onboarding_status
    FOR SELECT USING (user_id = auth.uid());
    
CREATE POLICY "Users can update own onboarding" ON onboarding_status
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own anonymous data" ON anonymous_tool_data
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own email workflows" ON email_workflows
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own transactions" ON credit_transactions
    FOR SELECT USING (user_id = auth.uid());

-- 5. Triggers en functies
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_credits (user_id, total_credits, remaining_credits)
    VALUES (NEW.id, 1, 1)
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (NEW.id, 1, 'initial', 'Welcome bonus');
    
    INSERT INTO onboarding_status (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION initialize_user_credits();

-- 6. Onboarding progress functie
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
    
    IF new_percentage = 100 AND NOT NEW.reward_claimed AND OLD.progress_percentage < 100 THEN
        NEW.reward_claimed := TRUE;
        NEW.completed_at := NOW();
        
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

-- 7. Bestaande users voorzien van credits (als ze die nog niet hebben)
INSERT INTO user_credits (user_id, total_credits, remaining_credits)
SELECT id, 1, 1 FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits)
ON CONFLICT DO NOTHING;

INSERT INTO onboarding_status (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM onboarding_status)
ON CONFLICT DO NOTHING;

-- Succes! 🎉
