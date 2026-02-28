-- RUN DIT IN SUPABASE SQL EDITOR
-- User Profiles Tabel voor Onboarding

-- 1. Maak de tabel aan
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Bedrijfsgegevens
    bedrijfsnaam TEXT NOT NULL DEFAULT '',
    kvk_nummer TEXT,
    btw_nummer TEXT,
    
    -- Profiel informatie
    beroep TEXT NOT NULL DEFAULT 'zzp' CHECK (beroep IN ('boekhouder', 'zzp', 'mkb', 'adviseur', 'anders')),
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

-- 2. Indexes voor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_voltooid);

-- 3. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can view own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- 5. Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.bijgewerkt_op = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, bedrijfsnaam, beroep, onboarding_voltooid)
    VALUES (NEW.id, '', 'zzp', false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 7. Voor bestaande users: maak lege profielen aan
INSERT INTO public.user_profiles (user_id, bedrijfsnaam, beroep, onboarding_voltooid)
SELECT id, '', 'zzp', false
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_profiles);
