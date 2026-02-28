-- Migration: Create user_profiles table for onboarding
-- Created: 2025-02-25

-- Enable RLS
alter table if exists public.user_profiles enable row level security;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Bedrijfsgegevens
    bedrijfsnaam TEXT NOT NULL,
    kvk_nummer TEXT,
    btw_nummer TEXT,
    
    -- Profiel informatie
    beroep TEXT NOT NULL CHECK (beroep IN ('boekhouder', 'zzp', 'mkb', 'adviseur', 'anders')),
    afschriften_per_maand INTEGER,
    logo_url TEXT,
    
    -- Instellingen (alleen voor Starter + Pro abonnementen)
    instelling_btw_categorisering BOOLEAN DEFAULT true,
    instelling_bedrijfsnaam_in_excel BOOLEAN DEFAULT true,
    instelling_lopend_saldo BOOLEAN DEFAULT true,
    instelling_logo_in_excel BOOLEAN DEFAULT false,
    instelling_kostenplaats BOOLEAN DEFAULT false,
    
    -- Onboarding status
    onboarding_voltooid BOOLEAN DEFAULT false,
    
    -- Metadata
    aangemaakt_op TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    bijgewerkt_op TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_voltooid);

-- RLS Policies
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Function to auto-update bijgewerkt_op timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.bijgewerkt_op = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update bijgewerkt_op
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-create profile on user signup (optional, can be done in app)
-- This ensures a profile always exists for every user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, bedrijfsnaam, beroep, onboarding_voltooid)
    VALUES (NEW.id, '', 'zzp', false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
