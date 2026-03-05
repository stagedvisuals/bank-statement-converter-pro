# BSC Pro System Map v1

> Technisch overzicht van BSC Pro - Bank Statement Converter  
> Laatst bijgewerkt: 1 maart 2026

---

## 1. Algemene Stack

| Component | Versie / Provider |
|-----------|-------------------|
| **Next.js** | 14.2.0 (Pages + App Router gemixt) |
| **React** | 18.2.0 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Clerk (voorheen Supabase Auth) |
| **Email** | Resend |
| **AI** | Groq API (LLaMA 3.3 70B) |
| **Styling** | Tailwind CSS + shadcn/ui (deels) |
| **Icons** | Lucide React |
| **Hosting** | Vercel |
| **Region** | EU (Frankfurt) |

### Belangrijkste npm packages
```json
{
  "next": "14.2.0",
  "@supabase/supabase-js": "^2.97.0",
  "@supabase/ssr": "^0.8.0",
  "resend": "^6.9.2"
}
```

---

## 2. Mappenstructuur

### Homepage
- **Locatie**: `app/page.tsx` (Next.js App Router)
- **Type**: Marketing homepage met pricing, FAQ, ROI calculator

### Belangrijkste routes
| Route | Bestand | Functie |
|-------|---------|---------|
| `/` | `app/page.tsx` | Marketing homepage |
| `/over-ons` | `pages/over-ons.tsx` | About page (Pages Router) |
| `/dashboard` | `app/dashboard/page.tsx` | User dashboard |
| `/api/convert` | `pages/api/convert.ts` | PDF → transacties API |
| `/api/feedback` | `app/api/feedback/route.ts` | Feedback opslaan |
| `/api/contact` | `app/api/contact/route.ts` | Contact form |

### Herbruikbare components
```
components/
├── file-converter.tsx      # Upload + conversie UI
├── FeedbackModal.tsx       # Rating 1-5 + feedback
├── Navbar.tsx              # Navigatie
├── Footer.tsx              # Footer met links
├── Pricing.tsx             # Prijzen tabel
├── FAQ.tsx                 # FAQ sectie
├── OnboardingTracker.tsx   # Onboarding stappen
├── AgentDashboard.tsx      # Admin/agent dashboard
└── ChatWidget.tsx          # Support chat
```

---

## 3. Conversie-flow (Stap voor stap)

### Stap 1: Upload
- Gebruiker kiest PDF via `<input type="file">`
- Component: `components/file-converter.tsx`
- Max bestandsgrootte: 10MB
- Validatie: Alleen PDF, JPG, PNG

### Stap 2: API Call
```
POST /api/convert
Content-Type: multipart/form-data

Body: { file: File }
```

### Stap 3: Server-side processing (`pages/api/convert.ts`)
1. **Formidable** parseert multipart form data
2. **Temp file** wordt opgeslagen
3. **AI aanroep** (momenteel: mock data - TODO: implementeren)
4. **Temp file direct verwijderd** (AVG compliance)
5. **Response** met transacties

### Stap 4: AI Prompt (voorbeeld - nog niet geïmplementeerd)
```typescript
const prompt = `
Analyseer dit bankafschrift en extracteer ALLE transacties.

Return STRICT JSON in dit formaat:
{
  "bank": "ING|Rabobank|ABN AMRO|etc",
  "rekeningnummer": "NLXX...",
  "rekeninghouder": "Bedrijfsnaam",
  "periode": { "van": "YYYY-MM-DD", "tot": "YYYY-MM-DD" },
  "transacties": [
    {
      "datum": "YYYY-MM-DD",
      "omschrijving": "string",
      "bedrag": number (positief = credit, negatief = debit),
      "tegenrekening": "NLXX...",
      "categorie": "boodschappen|vervoer|kantoor|etc"
    }
  ],
  "saldoStart": number,
  "saldoEind": number
}

Regels:
- Gebruik YYYY-MM-DD formaat
- Bedragen als numbers (niet strings)
- Omschrijvingen schoonmaken (geen "BETALING SEPA" prefixes)
- Categoriseer automatisch
`;
```

### Stap 5: AI Response
```json
{
  "bank": "ING",
  "rekeningnummer": "NL91INGB0001234567",
  "transacties": [
    {
      "datum": "2024-01-15",
      "omschrijving": "Albert Heijn B.V.",
      "bedrag": -85.43,
      "categorie": "boodschappen"
    }
  ]
}
```

### Stap 6: Export formaten genereren
- **Excel (.xlsx)**: `xlsx` library (client-side)
- **CSV**: Plain text met `;` separator
- **MT940**: SWIFT formaat string
- **CAMT.053**: XML formaat (ISO 20022)
- **QBO**: QuickBooks formaat

### Stap 7: Download
- Client-side blob generation
- `<a download>` trigger
- Geen server storage (privacy)

### Stap 8: Feedback modal
- Automatisch geopend na download
- Rating 1-5 sterren
- Optionele tekst feedback
- Anoniem checkbox
- Opslag in Supabase `feedback` tabel

---

## 4. Supabase Database

### Tabellen

#### `user_profiles`
```sql
id: uuid (PK)
user_id: uuid (FK → auth.users)
bedrijfsnaam: text
kvk_nummer: text
btw_nummer: text
beroep: enum ('boekhouder', 'zzp', 'mkb', 'adviseur', 'anders')
afschriften_per_maand: int
logo_url: text
instelling_btw_categorisering: boolean DEFAULT true
instelling_bedrijfsnaam_in_excel: boolean DEFAULT true
instelling_lopend_saldo: boolean DEFAULT true
instelling_logo_in_excel: boolean DEFAULT false
instelling_kostenplaats: boolean DEFAULT false
onboarding_voltooid: boolean DEFAULT false
aangemaakt_op: timestamp
bijgewerkt_op: timestamp
```

#### `feedback` (nieuw)
```sql
id: uuid (PK)
rating: int (1-5, NOT NULL)
feedback: text
anonymous: boolean DEFAULT false
conversion_id: text
user_email: text
created_at: timestamp
```

#### `enterprise_waitlist`
```sql
id: uuid (PK)
email: text
status: text DEFAULT 'pending'
created_at: timestamp
```

### Auth (Clerk)
- Email/password login
- Magic links (optioneel)
- Google OAuth (geconfigureerd)
- User metadata in Clerk, profiel in Supabase

---

## 5. Logging & Error Handling

### Huidige logging
- `console.log()` in API routes (development)
- Geen gestructureerde logging (productie TODO)
- Vercel function logs (basis)

### Error handling in `/api/convert`
```typescript
// Specifieke error types voor gebruikersvriendelijke meldingen
const errorMap = {
  'password_protected': 'PDF is beveiligd met wachtwoord',
  'low_quality': 'Scan kwaliteit te laag',
  'unsupported_format': 'Bestandsformaat niet ondersteund',
  'file_too_large': 'Bestand > 10MB',
  'unreadable': 'Document onleesbaar',
  'no_transactions': 'Geen transacties gevonden'
};
```

### Error response formaat
```json
{
  "error": "Oeps! Er is iets misgegaan...",
  "errorType": "password_protected"
}
```

---

## 6. Openstaande Pijnpunten

### 🔴 Kritiek (nu fixen)
1. **AI is niet geïmplementeerd** - Momenteel mock data
   - TODO: Groq API koppelen in `/api/convert`
   - TODO: PDF parsing (PDF-lib of externe service)
   
2. **Supabase key was gelekt** (23 feb incident)
   - Key geroteerd, maar git history moet nog gecleaned

3. **Live site ≠ Lokale code** - Deploy issue
   - Vercel build cache legen
   - Nieuwe deploy forceren

### 🟡 Medium prioriteit
4. **Inconsistente bulk limits** - Gefixt in latest commit
   - Pro = 5 PDFs, Business = 25 PDFs
   - Synced in pricing, FAQ, en home

5. **Footer versie** - Gefixt
   - Was: "v1.0 - 27 feb 2026"
   - Nu: "v1.0 – In bèta"

6. **Feedback modal** - Geïmplementeerd
   - Toont na elke conversie
   - Verplicht rating 1-5
   - Email bij rating < 4

### 🟢 Laag prioriteit / Nice to have
7. **Bank specifieke parsing**
   - ING: meest getest, werkt goed
   - Rabobank: soms layout issues
   - ABN AMRO: TODO testen
   - Bunq: TODO testen
   - Knab: TODO testen

8. **Export formaten**
   - MT940: geïmplementeerd
   - CAMT.053: geïmplementeerd
   - QBO: geïmplementeerd
   - JSON: geïmplementeerd

9. **Categorisering AI**
   - Momenteel rule-based
   - TODO: ML model trainen op gebruikersfeedback

---

## 7. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI
GROQ_API_KEY=

# Email
RESEND_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://www.bscpro.nl
```

---

## 8. Deployment Checklist

```bash
# 1. Build testen
npm run build

# 2. Database migrations
# Supabase Dashboard → SQL Editor → Run migrations

# 3. Env variables check
# Vercel Dashboard → Project Settings → Environment Variables

# 4. Deploy
vercel --prod
# of: git push origin master
```

---

## 9. Contact & Support

- **Website**: https://www.bscpro.nl
- **Email**: info@bscpro.nl
- **GitHub**: github.com/stagedvisuals/bank-statement-converter-pro

---

*Document aangemaakt door: OpenClaw Agent*  
*Voor vragen: zie MEMORY.md in project root*
