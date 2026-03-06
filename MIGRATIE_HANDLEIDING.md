# Supabase Migratie Handleiding

## ⚠️ BELANGRIJK: Handmatige stap vereist

De SQL migratie kan NIET automatisch worden uitgevoerd vanwege Supabase beveiliging. 

### Stappen:

1. **Ga naar Supabase SQL Editor:**
   ```
   https://app.supabase.com/project/asqppiergpagmkxoxdtc/sql-editor
   ```

2. **Plak deze SQL (kopieer vanuit):**
   ```
   /home/arthy/.openclaw/workspace/.pi/saas-factory/supabase/migrations/RUN_IN_SQL_EDITOR.sql
   ```

3. **Klik "Run"**

### Wat wordt aangemaakt:
- ✅ `profiles` tabel
- ✅ RLS policies (beveiliging)
- ✅ Automatische triggers voor nieuwe profiles
- ✅ Profielen voor bestaande profiles

---

## ✅ AUTOMATISCH GEDAAN

### 1. Cleanup API (/api/cleanup)
- Verwijdert bestanden ouder dan 1 uur
- Dagelijkse cron job: 03:00 UTC
- ⚠️ **Vereist env var in Vercel:** `SUPABASE_SERVICE_ROLE_KEY`

### 2. Vercel Configuratie
- `vercel.json` met cron job
- Dagelijkse cleanup geconfigureerd

### 3. Nieuwe Pagina's
- ✅ /beveiliging - Trust & privacy pagina
- ✅ /verwerkersovereenkomst - AVG document
- ✅ Footer met alle links

---

## 🔧 NOG TE DOEN (1 minuut werk)

### Vercel Environment Variable toevoegen:
```
Naam: SUPABASE_SERVICE_ROLE_KEY
Waarde: [je-service-role-key-hier]
```

> ⚠️ **Belangrijk:** Vraag de service role key op uit je .env.local bestand of Supabase dashboard.

Stappen:
1. Ga naar https://vercel.com/dashboard
2. Klik op 'saas-factory' project
3. Settings → Environment Variables
4. Voeg bovenstaande toe
5. Klik "Save" en "Redeploy"

---

## 🧪 TEST CHECKLIST

Na SQL migratie:
- [ ] Registreer nieuw account op bscpro.nl
- [ ] Check redirect naar /onboarding
- [ ] Doorloop 3 stappen onboarding
- [ ] Check confetti animatie
- [ ] Upload test PDF
- [ ] Check Excel output (bedrijfsnaam in rij 1)
