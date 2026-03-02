# Bank Statement Converter Pro v2.0

## 🚀 Wat is er nieuw?

Volledige Next.js rewrite met:
- ✅ Next.js 14 met App Router
- ✅ Supabase PostgreSQL database
- ✅ Clerk authenticatie (Google, email, etc.)
- ✅ Stripe betalingen (€5 / €29)
- ✅ PDF naar Excel conversie
- ✅ Dark mode UI met neon accents
- ✅ User dashboard met credits

## 📋 Setup instructies

### 1. Database (Supabase)
1. Ga naar https://supabase.com
2. Maak een nieuw project
3. Run dit SQL in de SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 2,
  plan_type TEXT DEFAULT 'starter',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversions table
CREATE TABLE conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  pdf_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_count INTEGER,
  download_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Storage bucket voor Excel bestanden
INSERT INTO storage.buckets (id, name, public) 
VALUES ('conversions', 'conversions', true);
```

### 2. Clerk Auth
1. Ga naar https://clerk.com
2. Maak een applicatie
3. Kopieer de keys naar Vercel env vars

### 3. Stripe
1. Ga naar https://stripe.com
2. Maak producten aan:
   - "5 Conversions Pack" - €5 (eenmalig)
   - "Unlimited Monthly" - €29/maand
3. Kopieer de API keys

### 4. Vercel Deploy
1. Push deze branch naar GitHub
2. Import in Vercel
3. Voeg alle env vars toe
4. Deploy!

## 🔑 Environment Variables

Zie `.env.example` voor alle benodigde variabelen.

## 📝 Door Artur Bagdasarjan
// force deploy Mon Mar  2 11:22:38 AM UTC 2026
