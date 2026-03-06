# BSC Pro - Bank Statement Converter Pro

**AI-powered bank statement conversion for Dutch businesses**  
Convert PDF bank statements to Excel/CSV in seconds with 99% accuracy.

🌐 **Live:** [www.bscpro.nl](https://www.bscpro.nl)  
🚀 **Stack:** Next.js 14, Supabase, Groq AI, TypeScript  
💰 **Business:** €30,000-€50,000 annual revenue target (Dutch market)

## 🏗️ Unified Architecture

### Single Source of Truth: `profiles` Table
BSC Pro uses a **unified database architecture** with a single `profiles` table linked to `auth.users.id`:

```sql
-- Core table structure
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  profession TEXT DEFAULT 'zzp',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  credits INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);
```

### Authentication: Supabase Auth Only
- **No Clerk:** All authentication handled by Supabase Auth
- **Secure:** Row Level Security (RLS) policies for data protection
- **GDPR compliant:** Dutch market ready with proper data handling

### Key Features
- **AI-powered parsing:** Groq API (Llama 3.3 70B) for 99% accuracy
- **Multi-bank support:** ABN AMRO, ING, Rabobank, Bunq, Revolut
- **B2B bulk upload:** Enterprise-grade batch processing
- **Fort Knox anti-abuse:** IP tracking, rate limiting, fraud detection
- **Dutch compliance:** AVG/GDPR, financial data security

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Clone repository
git clone https://github.com/stagedvisuals/bank-statement-converter-pro.git
cd bank-statement-converter-pro

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Database Setup
1. **Create Supabase project** at [supabase.com](https://supabase.com)
2. **Run unified schema** in Supabase SQL Editor:
   ```sql
   -- Copy and run unified_final_schema.sql
   -- This creates all tables, RLS policies, and triggers
   ```
3. **Configure environment variables** in `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Groq AI
   GROQ_API_KEY=your-groq-key
   
   # Upstash Redis (optional, for rate limiting)
   UPSTASH_REDIS_URL=your-redis-url
   UPSTASH_REDIS_TOKEN=your-redis-token
   
   # Admin (server-side only)
   ADMIN_SECRET=secure-random-string
   ```

### 3. Development
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📁 Project Structure

```
app/
├── api/                    # API routes
│   ├── convert/           # PDF conversion
│   ├── user/              # User management
│   ├── admin/             # Admin endpoints
│   └── v1/                # Public API v1
├── admin/                 # Admin dashboard
├── dashboard/             # User dashboard
├── onboarding/            # User onboarding flow
└── components/            # Reusable components
```

## 🔒 Security Architecture

### Rate Limiting
- **Upstash Redis:** Serverless rate limiting for API endpoints
- **Middleware protection:** IP-based and API key rate limiting
- **Anti-abuse:** Multiple layers of fraud detection

### Data Protection
- **Row Level Security:** Supabase RLS policies for all tables
- **GDPR compliance:** Dutch data protection standards
- **Secure file handling:** Encrypted storage, temporary file cleanup

### Admin Access
- **Role-based:** `role = 'admin'` in profiles table
- **Email-based:** Automatic admin role for specific emails
- **Secure middleware:** Admin routes protected with session validation

## 📊 Business Model

### Pricing Tiers
1. **Free:** 2 conversions/month, basic features
2. **Starter (€15/month):** 50 conversions/month, CSV export
3. **Professional (€30/month):** 200 conversions/month, Excel templates
4. **Enterprise (Custom):** Bulk upload, API access, white-label

### Target Market
- **Dutch accountants:** Monthly statement processing
- **ZZP'ers:** Quarterly VAT returns
- **Small businesses:** Bookkeeping automation
- **Financial advisors:** Client statement analysis

## 🤝 Contributing

### Development Workflow
1. **Fork repository** and create feature branch
2. **Follow code style:** TypeScript, ESLint, Prettier
3. **Test thoroughly:** Unit tests for critical paths
4. **Submit PR:** With clear description and screenshots

### Code Standards
- **TypeScript strict mode:** No `any` types
- **Component structure:** React functional components
- **API design:** RESTful endpoints with proper error handling
- **Security first:** No secrets in code, proper validation

## 📞 Support

- **Documentation:** [docs.bscpro.nl](https://docs.bscpro.nl)
- **API Reference:** `/api-documentatie`
- **Contact:** [contact@bscpro.nl](mailto:contact@bscpro.nl)
- **GitHub Issues:** Bug reports and feature requests

## 📄 License

Proprietary - All rights reserved.  
© 2025 BSC Pro - Bank Statement Converter Pro
