# BSC Pro - Project Context Document

> Complete technical reference for AI assistants working on this codebase  
> Generated: March 1, 2026  
> Project: Bank Statement Converter Pro (bscpro.nl)

---

## 1. TECH STACK

### Core Framework
- **Next.js**: 14.2.0
- **React**: 18.2.0
- **TypeScript**: 5.3.0
- **Router Type**: Mixed (App Router + Pages Router)
  - Marketing pages: `app/` (App Router)
  - API routes: Both `app/api/` and `pages/api/`
  - Legacy auth: `pages/api/auth/`

### Styling
- **Tailwind CSS**: 3.3.6
- **PostCSS**: 8.4.32
- **Theme**: Dark mode (default: #080d14 background)

### Database & Auth
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Clerk partially configured but not actively used)
- **Region**: EU (Frankfurt)

### AI Integration
- **Provider**: Groq API
- **Model**: llama-3.3-70b-versatile
- **SDK**: groq-sdk@0.37.0

### PDF Processing
- **Parsing**: pdf-parse@1.1.4
- **Manipulation**: pdf-lib@1.17.1
- **Conversion**: pdf2pic@3.2.0, pdf-to-img@5.0.0

### Email
- **Service**: Resend
- **SDK**: resend@6.9.2

### Payments
- **Provider**: Stripe
- **SDK**: stripe@14.25.0

### Export Formats
- **Excel**: exceljs@4.4.0, xlsx@0.18.5
- **Word**: docx@9.5.3

### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.97.0",
  "@supabase/ssr": "^0.8.0",
  "groq-sdk": "^0.37.0",
  "resend": "^6.9.2",
  "stripe": "^14.25.0",
  "pdf-parse": "^1.1.4",
  "pdf-lib": "^1.17.1",
  "exceljs": "^4.4.0",
  "formidable": "^3.5.4",
  "lucide-react": "^0.294.0",
  "framer-motion": "^12.34.3",
  "@vercel/analytics": "^1.6.1",
  "@vercel/speed-insights": "^1.3.1"
}
```

### Hosting
- **Platform**: Vercel
- **URL**: https://www.bscpro.nl
- **Environment**: Production

---

## 2. DATABASE SCHEMA

### Tables Overview

#### `profiles`
User profile information extending Supabase Auth
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- bedrijfsnaam: text
- kvk_nummer: text
- btw_nummer: text
- beroep: enum ('boekhouder', 'zzp', 'mkb', 'adviseur', 'anders')
- afschriften_per_maand: integer
- logo_url: text
- plan: text (default: 'free')
- onboarding_voltooid: boolean (default: false)
- instelling_*: various boolean settings
- aangemaakt_op: timestamp
- bijgewerkt_op: timestamp
```

#### `user_credits`
Credit system for conversions
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- remaining_credits: integer
- total_credits: integer
- used_credits: integer
- created_at: timestamp
- updated_at: timestamp
```

#### `credit_transactions`
Audit log for credit changes
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- amount: integer
- type: text ('admin_grant', 'purchase', 'usage')
- description: text
- created_at: timestamp
```

#### `conversions`
PDF conversion records
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- user_email: text
- bank: text
- format: text
- status: text
- transaction_count: integer
- created_at: timestamp
```

#### `feedback`
User feedback after conversions
```sql
- id: uuid (PK)
- rating: integer (1-5)
- feedback: text
- anonymous: boolean
- conversion_id: text
- user_email: text
- created_at: timestamp
```

#### `enterprise_waitlist`
Enterprise signup waitlist
```sql
- id: uuid (PK)
- email: text
- status: text (default: 'pending')
- created_at: timestamp
```

#### `security_logs`
Security event logging
```sql
- id: uuid (PK)
- user_id: uuid (FK, optional)
- event_type: text
- ip_address: text
- details: jsonb
- created_at: timestamp
```

#### `onboarding_status`
User onboarding progress
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- progress_percentage: integer
- current_step: text
- completed_steps: jsonb
- created_at: timestamp
```

### Tables (Potentially Missing - Check Migrations)
- `payments` - Referenced in admin stats but may not exist
- `categorization_rules` - Referenced in API routes
- `agent_quality_flags` - Referenced in agent system
- `market_reports` - Referenced in agent system

---

## 3. ALL API ROUTES

### Public Routes (No Auth)
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| GET | `/api/health` | Health check | None |
| GET | `/api/stats/public` | Public conversion count | conversions |
| POST | `/api/contact` | Contact form submission | None (email) |
| POST | `/api/enterprise-waitlist` | Join waitlist | enterprise_waitlist |
| POST | `/api/feedback` | Submit feedback | feedback |

### Authentication Routes
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| POST | `/api/auth/login` | User login | auth.users, profiles |
| POST | `/api/auth/register` | User registration | auth.users, profiles |
| GET | `/api/auth/session` | Get session info | auth.users |
| GET | `/api/auth/check-onboarding` | Check onboarding status | onboarding_status |

### User Routes (Requires Auth)
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| GET | `/api/user/credits` | Get user credits | user_credits |
| POST | `/api/user/use-credit` | Use credit for conversion | user_credits |
| GET | `/api/user/onboarding` | Get onboarding progress | onboarding_status |
| POST | `/api/user/onboarding` | Update onboarding | onboarding_status |
| POST | `/api/user/sync-anonymous-data` | Sync guest data | profiles |
| GET | `/api/user/email-workflow` | Email automation | None |
| GET/POST | `/api/user/profile` | Profile management | profiles |

### Core Conversion Routes
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| POST | `/api/convert` | Convert PDF to transactions | None (AI processing) |
| POST | `/api/export/csv` | Export to CSV | None |
| POST | `/api/export/excel` | Export to Excel | None |
| POST | `/api/export/mt940` | Export to MT940 | None |
| POST | `/api/export/camt` | Export to CAMT.053 | None |
| POST | `/api/export/qbo` | Export to QBO | None |

### Admin Routes (Requires Admin Secret)
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| GET | `/api/admin/stats` | Admin dashboard stats | profiles, conversions, payments |
| GET | `/api/admin/users` | List all users | profiles |
| PATCH | `/api/admin/users` | Update user plan/credits | profiles, user_credits |
| DELETE | `/api/admin/users?userId={id}` | Delete user | profiles, user_credits, auth.users |
| GET | `/api/admin/conversions` | List all conversions | conversions |
| GET | `/api/admin/dashboard` | Agent dashboard data | Various |

### Agent System Routes (Background Jobs)
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| GET | `/api/agents/dashboard` | Agent system status | Various |
| GET | `/api/agents/quality/run` | Quality check job | conversions |
| GET | `/api/agents/market/run` | Market analysis job | None |
| GET | `/api/agents/onboarding/run` | Onboarding retention job | onboarding_status |
| POST | `/api/agents/onboarding/send-retention-email` | Send retention email | None |
| GET | `/api/agents/quality/flags` | Get quality flags | None |
| GET | `/api/agents/quality/report` | Quality report | None |

### Utility Routes
| Method | Path | Description | Table(s) |
|--------|------|-------------|----------|
| GET/POST | `/api/cleanup` | AVG cleanup (24h) | None |
| POST | `/api/chat` | Support chat | None |
| POST | `/api/checkout` | Stripe checkout | None |
| POST | `/api/send-email` | Send email | None |
| POST | `/api/webhook` | Stripe webhooks | None |
| GET | `/api/monitor` | System monitoring | None |
| POST | `/api/log-error` | Error logging | None |
| POST | `/api/cron/email-automation` | Cron email jobs | None |

---

## 4. ALL PAGES

### Public Pages (No Auth Required)
| Path | Purpose | Auth Required |
|------|---------|---------------|
| `/` | Homepage / Landing | No |
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/over-ons` | About page | No |
| `/contact` | Contact page | No |
| `/privacy` | Privacy policy | No |
| `/voorwaarden` | Terms of service | No |
| `/gdpr` | GDPR info | No |
| `/verwerkersovereenkomst` | DPA | No |
| `/beveiliging` | Security info | No |
| `/api-docs` | API documentation | No |
| `/tools` | Tools calculator | No |
| `/tools/btw-calculator` | VAT calculator | No |
| `/tools/factuur-deadline-checker` | Invoice deadline | No |
| `/tools/kilometervergoeding-calculator` | Mileage calculator | No |

### SEO Landing Pages (No Auth)
| Path | Purpose | Auth Required |
|------|---------|---------------|
| `/abn-amro/exact-online-importeren` | ABN → Exact | No |
| `/abn-amro/twinfield-importeren` | ABN → Twinfield | No |
| `/exact-online/ing-prive-importeren` | ING → Exact | No |
| `/ing/afas-importeren` | ING → AFAS | No |
| `/ing/mt940-exporteren` | ING MT940 | No |
| `/rabobank/mt940-exporteren` | Rabo MT940 | No |
| `/moneybird/priverekening-pdf-importeren` | Moneybird | No |
| `/snelstart/rabobank-pdf-importeren` | SnelStart | No |

### Protected Pages (Auth Required)
| Path | Purpose | Auth Required |
|------|---------|---------------|
| `/dashboard` | User dashboard | Yes |
| `/onboarding` | Onboarding flow | Yes |
| `/account` | Account settings | Yes |

### Admin Pages (Admin Secret Required)
| Path | Purpose | Auth Required |
|------|---------|---------------|
| `/admin` | Admin dashboard | Admin Secret |
| `/beheer` | Alternative admin | Admin Secret |

---

## 5. ENVIRONMENT VARIABLES

### Required for Production
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Groq AI
GROQ_API_KEY=

# Resend Email
RESEND_API_KEY=

# Stripe Payments
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Clerk Auth (optional, using Supabase Auth)
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=https://www.bscpro.nl
```

---

## 6. KNOWN ISSUES & TODOs

### Critical Issues
1. **Agent System Uses Mock Data**
   - Location: `pages/api/agents/quality/run.ts`, `pages/api/agents/market/run.ts`
   - Issue: Uses `Math.random()` for confidence scores and trend data
   - Status: Partially fixed (set to fixed values, needs real implementation)

2. **Stats Public Route Returns 0 on Error**
   - Location: `app/api/stats/public/route.ts`
   - Issue: Falls back to 0 instead of real data when table missing
   - Status: Acceptable for now

3. **Some Tables May Not Exist**
   - `payments` table referenced but not created
   - `categorization_rules` referenced in API
   - `agent_quality_flags` referenced

### TODOs in Code
1. `app/api/enterprise-waitlist/route.ts:23`
   - Email via Resend - implement later

2. `app/api/send-email/route.ts:192`
   - Email verzend logica - TODO

3. `app/api/contact/route.ts:30`
   - Email versturen via Resend - TODO

### Minor Issues
1. Mix of App Router and Pages Router can be confusing
2. Some components use both Clerk and Supabase Auth patterns
3. Console logs removed from API routes (may need some for debugging)
4. TypeScript strict mode not enabled

---

## 7. WHAT WORKS / WHAT DOESN'T

### ✅ FULLY WORKING

| Feature | Status | Notes |
|---------|--------|-------|
| **AI PDF Conversion** | ✅ Working | Real Groq AI with pdf-parse |
| **Login/Auth** | ✅ Working | Cookies set correctly, session persists |
| **Dashboard** | ✅ Working | Transactions display, exports work |
| **Export Formats** | ✅ Working | CSV, Excel, MT940, CAMT.053, QBO |
| **Admin User Management** | ✅ Working | Edit, delete, export users |
| **Health Checks** | ✅ Working | 5 checks operational |
| **Credits System** | ✅ Working | Check, use, admin grant credits |
| **Feedback System** | ✅ Working | Post-conversion feedback modal |
| **SEO Pages** | ✅ Working | All landing pages render |
| **Contact Form** | ✅ Working | Saves to backend (email TODO) |
| **File Upload** | ✅ Working | PDF upload with validation |

### ⚠️ PARTIALLY WORKING

| Feature | Status | Notes |
|---------|--------|-------|
| **Agent System** | ⚠️ Partial | Framework exists, uses mock data |
| **Onboarding Flow** | ⚠️ Partial | UI exists, logic partially implemented |
| **Email Notifications** | ⚠️ Partial | Resend configured but not sending |
| **Stripe Payments** | ⚠️ Partial | Setup complete but not fully tested |
| **Enterprise Waitlist** | ⚠️ Partial | Saves data, no email notification |

### ❌ NOT WORKING / TODO

| Feature | Status | Priority |
|---------|--------|----------|
| **Real-time Notifications** | ❌ Not implemented | Low |
| **Webhooks** | ❌ Not fully tested | Medium |
| **Advanced Analytics** | ❌ Mock data | Low |
| **Multi-language** | ❌ Dutch only | Low |
| **Mobile App** | ❌ Not started | N/A |

---

## 8. RECENT GIT HISTORY

```
60d7afcb improve export routes: better excel, mt940, camt formatting
6e1d7b80 fix dashboard: transactions data structure, add App Router export routes, fix health checks
5f58aa62 remove all mock data: Math.random, fake MRR, hardcoded values, console.logs
754a4874 complete user management: edit plan, add credits, delete, CSV export
3731b3cf admin users API: PATCH and DELETE endpoints for user management
dc49cd4b complete user management module with edit, delete, export, modals
40fa9bdb show transaction list in admin tester
f483046f fix: working AI test in admin + real conversion tester
c67dfd8f fix: proper session cookie for middleware auth check
64171f26 temp: add dashboard to public routes for testing
0dcf5cce fix: set Supabase session cookies on login for middleware auth
4e01872c fix: use SUPABASE_URL server-side env var for API routes
3401dcac fix: wrap security_logs inserts in try/catch to prevent 500 on missing table
17de969a implement real AI conversion with Groq + pdf-parse (replaces mock data)
4b06b6ce feat: implement real AI conversion with Groq API and pdf-parse
b12ec2df docs: add system map v1 for technical overview
```

---

## 9. KEY FILES & STRUCTURE

### Critical Paths
```
/root
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── dashboard/               # User dashboard
│   ├── admin/page.tsx           # Admin panel
│   ├── api/                     # App Router APIs
│   │   ├── convert/route.ts     # AI conversion
│   │   ├── export/*/route.ts    # Export formats
│   │   └── admin/*/route.ts     # Admin APIs
│   └── (marketing)/             # Landing pages
├── pages/
│   ├── api/
│   │   ├── auth/                # Auth endpoints
│   │   ├── convert.ts           # Main conversion API
│   │   └── agents/              # Agent system
│   └── dashboard.tsx            # Dashboard page
├── components/
│   ├── file-converter.tsx       # Upload component
│   ├── FeedbackModal.tsx        # Feedback UI
│   └── AgentDashboard.tsx       # Admin monitoring
├── middleware.ts                # Auth middleware
└── CLAUDE_CONTEXT.md            # This file
```

---

## 10. QUICK REFERENCE

### Common Tasks

**Add new API route:**
```typescript
// app/api/my-route/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: 'value' })
}
```

**Check admin auth:**
```typescript
const isAdmin = request.headers.get('x-admin-secret') === 'BSCPro2025!'
```

**Get Supabase client:**
```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, serviceKey)
```

**Use AI (Groq):**
```typescript
import Groq from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
```

---

## 11. SECURITY NOTES

- Admin secret: `BSCPro2025!` (hardcoded, should be env var)
- Service role key has full database access
- No rate limiting implemented yet
- File uploads limited to 10MB
- CORS configured for Vercel domains only

---

*Last updated: March 1, 2026 by AI Assistant*  
*For updates: Edit this file and commit to repository*
