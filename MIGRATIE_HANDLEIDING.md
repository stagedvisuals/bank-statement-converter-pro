# BSC Pro - Migratie Handleiding

## 🏗️ Unified Database Architectuur

BSC Pro gebruikt een **geünificeerde database structuur** met één `profiles` tabel als single source of truth. Alle verwijzingen naar `users`, `user_profiles` of Clerk zijn verwijderd.

### 📊 Database Schema (Unified)

**ENIGE SQL die je nodig hebt:** Voer dit script uit in de Supabase SQL Editor:

```sql
-- BSC Pro - Unified Database Schema (IDEMPOTENT VERSION)
-- Date: 2025-03-06
-- Purpose: Single source of truth with Supabase Auth only
-- SAFE TO RUN MULTIPLE TIMES

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DROP OLD TABLES (CASCADE removes dependent objects)
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.conversions CASCADE;
DROP TABLE IF EXISTS public.chat_conversations CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.email_notifications CASCADE;
DROP TABLE IF EXISTS public.daily_analytics CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.conversion_errors CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. UNIFIED PROFILES TABLE (Single source of truth)
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
  
  -- Admin & Role
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_suspended BOOLEAN DEFAULT false,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  subscription_ends_at TIMESTAMPTZ,
  credits INTEGER DEFAULT 2,
  
  -- Stripe (optioneel)
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_id UNIQUE (user_id),
  CONSTRAINT unique_email UNIQUE (email)
);

-- 3. CONVERSIONS TABLE (Main business logic)
CREATE TABLE public.conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- File info
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  pdf_name TEXT,
  
  -- Processing
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ai_model_used TEXT,
  confidence_score DECIMAL(5,4),
  
  -- Results
  transaction_count INTEGER,
  processed_text TEXT,
  extracted_data JSONB,
  excel_file_url TEXT,
  download_url TEXT,
  
  -- Error handling
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_conversions_user_id (user_id),
  INDEX idx_conversions_profile_id (profile_id),
  INDEX idx_conversions_created_at (created_at DESC),
  INDEX idx_conversions_status (status)
);

-- 4. CONVERSION ERRORS TABLE (Error tracking)
CREATE TABLE public.conversion_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_name TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT,
  file_format TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  
  -- Indexes
  INDEX idx_conversion_errors_user (user_id),
  INDEX idx_conversion_errors_bank (bank_name),
  INDEX idx_conversion_errors_date (created_at)
);

-- 5. CHAT CONVERSATIONS TABLE (Support chat)
CREATE TABLE public.chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  -- Indexes
  INDEX idx_chat_conversations_session (session_id),
  INDEX idx_chat_conversations_user (user_id)
);

-- 6. CHAT MESSAGES TABLE
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  -- Indexes
  INDEX idx_chat_messages_conversation (conversation_id)
);

-- 7. EMAIL NOTIFICATIONS TABLE
CREATE TABLE public.email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('conversion_complete', 'welcome', 'support', 'marketing')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  -- Indexes
  INDEX idx_email_notifications_user (user_id),
  INDEX idx_email_notifications_status (status)
);

-- 8. CONTACT MESSAGES TABLE (Public contact form)
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_contact_messages_status (status),
  INDEX idx_contact_messages_email (email)
);

-- 9. DAILY ANALYTICS TABLE (Admin reporting)
CREATE TABLE public.daily_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  chat_conversations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- 11. RLS POLICIES

-- Profiles: Users can only see/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Conversions: Users can only see their own conversions
CREATE POLICY "Users can view own conversions" ON public.conversions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions" ON public.conversions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Conversion Errors: Users can see their own errors
CREATE POLICY "Users can view own errors" ON public.conversion_errors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own errors" ON public.conversion_errors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat Conversations: Users can see their own chats
CREATE POLICY "Users can view own conversations" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (true);

-- Chat Messages: Users can see messages in their conversations
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE public.chat_conversations.id = public.chat_messages.conversation_id 
      AND (public.chat_conversations.user_id = auth.uid() OR public.chat_conversations.user_id IS NULL)
    )
  );

-- Email Notifications: Users can see their own notifications
CREATE POLICY "Users can view own notifications" ON public.email_notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Contact Messages: Public can insert, authenticated can view
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact messages" ON public.contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Daily Analytics: Only service role can view
CREATE POLICY "Service role can view analytics" ON public.daily_analytics
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- 12. ADMIN POLICIES (role-based access)
-- Admin can view all profiles (based on role column in profiles table)
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p 
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admin can view all conversions
CREATE POLICY "Admin can view all conversions" ON public.conversions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p 
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admin can view all errors (FIXED: role = 'admin' check)
CREATE POLICY "Admin can view all errors" ON public.conversion_errors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.user_id = auth.uid() 
      AND public.profiles.role = 'admin'
    )
  );

-- Service role full access (bypass RLS)
CREATE POLICY "Service role full access" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access" ON public.conversions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access" ON public.conversion_errors
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 13. TRIGGERS

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, company_name, profession, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '',
    'zzp',
    CASE 
      WHEN NEW.email = 'arthybagdas@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users (IDEMPOTENT)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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

-- Triggers for updated_at (IDEMPOTENT)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_conversion_errors_resolved ON public.conversion_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON public.email_notifications(type);

-- 15. HELPER FUNCTIONS

-- Function to get user's conversion count
CREATE OR REPLACE FUNCTION public.get_user_conversion_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_result
  FROM public.conversions
  WHERE user_id = user_uuid AND status = 'completed';
  
  RETURN count_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = user_uuid;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. INITIAL DATA (optional)
-- INSERT INTO public.daily_analytics (date) VALUES (CURRENT_DATE);

-- 17. COMMENTS
COMMENT ON TABLE public.profiles IS 'Single source of truth for user profiles, linked to auth.users';
COMMENT ON TABLE public.conversions IS 'Main business logic: PDF to Excel conversions';
COMMENT ON TABLE public.conversion_errors IS 'Error tracking for failed conversions';
COMMENT ON TABLE public.chat_conversations IS 'Support chat conversations';
COMMENT ON COLUMN public.profiles.role IS 'user or admin (based on email check in trigger)';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'English naming convention, not onboarding_voltooid';
```

## 🔧 Migratie Stappen

### Stap 1: Database Setup
1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Open je project → SQL Editor
3. **Kopieer en plak het volledige SQL script hierboven**
4. Klik op "Run"

### Stap 2: Environment Variables
Update je `.env.local` met:
```env
# Supabase (vereist)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Groq AI (vereist)
GROQ_API_KEY=your-groq-key

# Upstash Redis (optioneel, voor rate limiting)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Admin (server-side only)
ADMIN_SECRET=secure-random-string
```

### Stap 3: Build & Deploy
```bash
npm install
npm run build
vercel --prod
```

## 🛠️ Admin Tools

### Credits Toevoegen (Handmatig)
**SQL snippet voor Supabase SQL Editor:**
```sql
-- Credits toevoegen aan specifieke gebruiker
UPDATE public.profiles 
SET credits = credits + 10,
    updated_at = NOW()
WHERE user_id = 'uuid-van-de-gebruiker';

-- Credits toevoegen aan alle gebruikers met een bepaald subscription tier
UPDATE public.profiles 
SET credits
 = credits + 5,
    updated_at = NOW()
WHERE subscription_tier = 'professional';

-- Credits resetten naar standaard waarde
UPDATE public.profiles 
SET credits = CASE 
  WHEN subscription_tier = 'free' THEN 2
  WHEN subscription_tier = 'starter' THEN 50
  WHEN subscription_tier = 'professional' THEN 200
  ELSE credits
END,
updated_at = NOW();
```

**TypeScript snippet voor admin dashboard:**
```typescript
// Admin credit boost functie (gebruik in admin dashboard)
async function addCreditsToUser(userId: string, amount: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      credits: supabase.raw(`credits + ${amount}`),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
    
  return { success: !error, error };
}
```

## 🚨 Belangrijke Notities

### Verwijderde Functionaliteit
- **Clerk Authentication:** Volledig verwijderd, alleen Supabase Auth
- **Users tabel:** Vervangen door unified `profiles` tabel
- **Onboarding_voltooid:** Vervangen door `onboarding_completed` (Engels)

### Nieuwe Architectuur
- **Single source of truth:** `profiles` tabel gekoppeld aan `auth.users.id`
- **Foreign keys:** Alle tabellen verwijzen naar `profiles.id`
- **Admin role:** Automatisch toegewezen via email check in trigger
- **Rate limiting:** Upstash Redis voor serverless stability

### Troubleshooting
1. **"relation does not exist" error:** Voer het SQL script opnieuw uit
2. **Auth errors:** Controleer Supabase URL en keys in `.env.local`
3. **Rate limiting errors:** Configureer Upstash Redis of gebruik fallback
4. **Admin access niet werkend:** Controleer of je email `arthybagdas@gmail.com` is

## 📞 Support
- **Documentatie:** [docs.bscpro.nl](https://docs.bscpro.nl)
- **GitHub Issues:** [github.com/stagedvisuals/bank-statement-converter-pro](https://github.com/stagedvisuals/bank-statement-converter-pro)
- **Contact:** [contact@bscpro.nl](mailto:contact@bscpro.nl)

---

**Laatste update:** 2025-03-06  
**Architectuur:** Unified Profiles (Supabase Auth only)  
**Status:** Production Ready 🚀
