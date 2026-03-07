-- Unified Database Schema - Profiles Table
-- Date: 2025-03-06
-- Purpose: Single source of truth for user profiles

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.conversions CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create unified profiles table
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (allow service role to bypass RLS)
CREATE POLICY "Service role full access" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger to automatically create profile on user signup
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

-- Function to auto-update updated_at timestamp
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

-- Create index for faster lookups
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_onboarding ON public.profiles(onboarding_completed);
