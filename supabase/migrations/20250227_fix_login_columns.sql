-- RUN DIT IN SUPABASE SQL EDITOR
-- User Profiles Tabel update voor Login/Register functionaliteit

-- 1. Voeg ontbrekende kolommen toe aan user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS last_login_ip TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS registration_ip TEXT,
ADD COLUMN IF NOT EXISTS trial_conversions_used INTEGER DEFAULT 0;

-- 2. Maak security_logs tabel aan (voor login/register logging)
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    ip_address TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS op security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security logs" 
    ON public.security_logs 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- 4. Update de handle_new_user functie om ook email op te slaan
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, bedrijfsnaam, beroep, onboarding_voltooid)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), '', 'zzp', false)
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update bestaande profielen met email uit auth.users
UPDATE public.user_profiles 
SET email = auth.users.email,
    full_name = COALESCE(full_name, split_part(auth.users.email, '@', 1))
FROM auth.users
WHERE public.user_profiles.user_id = auth.users.id
AND public.user_profiles.email IS NULL;

-- 6. Maak index aan voor snellere lookups
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_registration_ip ON public.user_profiles(registration_ip);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
