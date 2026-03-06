-- Unified Database Schema Migration
-- Date: 2025-03-06
-- Purpose: Create unified profiles and conversions tables with proper foreign keys

-- 1. Drop existing tables if they exist (cascade will drop dependent objects)
DROP TABLE IF EXISTS public.conversions CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. Create unified profiles table
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  profession TEXT DEFAULT 'zzp',
  
  -- Settings
  settings_btw_categorization BOOLEAN DEFAULT true,
  settings_company_name_in_excel BOOLEAN DEFAULT true,
  settings_running_balance BOOLEAN DEFAULT true,
  settings_logo_in_excel BOOLEAN DEFAULT false,
  settings_cost_center BOOLEAN DEFAULT false,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  
  -- Admin
  is_admin BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free',
  subscription_ends_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_id UNIQUE (user_id),
  CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise'))
);

-- 3. Create conversions table with proper foreign keys
CREATE TABLE public.conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- File info
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  
  -- Processing
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ai_model_used TEXT,
  confidence_score DECIMAL(5,4),
  
  -- Results
  transaction_count INTEGER,
  processed_text TEXT,
  extracted_data JSONB,
  excel_file_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_conversions_user_id (user_id),
  INDEX idx_conversions_profile_id (profile_id),
  INDEX idx_conversions_created_at (created_at DESC)
);

-- 4. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Conversions: Users can only see their own conversions
CREATE POLICY "Users can view own conversions" ON public.conversions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions" ON public.conversions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversions" ON public.conversions
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (allow service role to bypass RLS)
CREATE POLICY "Service role full access" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access" ON public.conversions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 5. Trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, company_name, profession)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', '', 'zzp');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Migrate existing data (if any) - placeholder for future migration
-- Note: This is a destructive migration. Existing data will be lost.
-- For production, you would need a data migration script here.
