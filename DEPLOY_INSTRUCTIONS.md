# 🚀 Deploy Instructies - Bank Statement Converter

## ✅ STAP 1: GitHub Repository
De code staat nu op:
**https://github.com/stagedvisuals/bank-statement-converter**

## ✅ STAP 2: Vercel Account

1. Ga naar https://vercel.com
2. Klik "Sign Up" en kies "Continue with GitHub"
3. Log in met je GitHub account (stagedvisuals)

## ✅ STAP 3: Deploy de App

1. In Vercel dashboard, klik "Add New..." → "Project"
2. Zoek naar "bank-statement-converter" in de lijst
3. Klik "Import"
4. Bij "Framework Preset" kies "Other"
5. Klik "Deploy"

**Wacht 2 minuten...**

🎉 Je site is live op: `https://bank-statement-converter-XXXX.vercel.app`

## ✅ STAP 4: Custom Domein (Optioneel)

1. In Vercel project settings, ga naar "Domains"
2. Voeg je eigen domein toe (bijv. converter.jouwdomein.nl)
3. Volg de DNS instructies
4. SSL wordt automatisch toegevoegd!

## ✅ STAP 5: Stripe Integratie

1. Ga naar https://dashboard.stripe.com
2. Maak een "Checkout Session" aan voor:
   - €5 eenmalig (Losse conversie)
   - €29/maand (Unlimited)
3. Kopieer de API keys
4. In Vercel: Ga naar "Settings" → "Environment Variables"
5. Voeg toe:
   - `STRIPE_SECRET_KEY` = sk_live_...
   - `STRIPE_PUBLIC_KEY` = pk_live_...
   - `SECRET_KEY` = (random string)

## 🔥 Wat je krijgt:

- ✅ Gratis hosting
- ✅ Automatische SSL (HTTPS)
- ✅ Globale CDN (snel overal)
- ✅ Automatische deploys bij GitHub updates
- ✅ Custom domein mogelijk

## 📧 Support

Bij problemen: support@bankstatementconverter.nl
Door: Artur Bagdasarjan
