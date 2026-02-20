# BSC Pro v2.0 - Deployment Checklist

## Database Setup (Supabase)

1. Create account at https://supabase.com
2. Create new project
3. Run this SQL in SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 2,
  plan_type TEXT DEFAULT 'starter',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversions table
CREATE TABLE conversions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pdf_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_count INTEGER,
  download_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_created_at ON conversions(created_at DESC);

-- Storage bucket for Excel files
INSERT INTO storage.buckets (id, name, public)
VALUES ('conversions', 'conversions', true);

-- Storage policy (public read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'conversions');
```

4. Get credentials:
   - Project URL: `NEXT_PUBLIC_SUPABASE_URL`
   - Service Role Key: `SUPABASE_SERVICE_ROLE_KEY`

## Auth Setup (Clerk)

1. Create account at https://clerk.com
2. Create application
3. Get keys:
   - Publishable Key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key: `CLERK_SECRET_KEY`

## Stripe Setup

Already configured in v1.0. Same keys work for v2.0.

## Deployment

Add these environment variables in Vercel:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_APP_URL

Then deploy branch `v2-automation`.
