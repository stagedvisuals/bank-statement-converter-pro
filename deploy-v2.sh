#!/bin/bash
# BSC Pro v2.0 Deployment Script
# Run this after: vercel login

set -e

echo "🌑 BSC Pro v2.0 - Deployment Script"
echo "===================================="
echo ""

# Check if logged in
if ! vercel whoami &>/dev/null; then
    echo "❌ Niet ingelogd bij Vercel"
    echo ""
    echo "Login eerst:"
    echo "  vercel login"
    echo ""
    exit 1
fi

echo "✅ Ingelogd als: $(vercel whoami)"
echo ""

# Environment variables toevoegen
echo "📦 Environment variables toevoegen..."

vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://asqppiergpagmkxoxdtc.supabase.co" 2>/dev/null || echo "  NEXT_PUBLIC_SUPABASE_URL: al gezet of skipped"

vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXBwaWVyZ3BhZ21reG94ZHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYxNzg1NSwiZXhwIjoyMDg3MTkzODU1fQ.Zx0bSf9yXbpMJNek6ZPNL9gtN233yB-7JScUMGrdZCI" 2>/dev/null || echo "  SUPABASE_SERVICE_ROLE_KEY: al gezet of skipped"

vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production <<< "pk_test_ZGVlcC1tYXN0b2Rvbi04OS5jbGVyay5hY2NvdW50cy5kZXYk" 2>/dev/null || echo "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: al gezet of skipped"

vercel env add CLERK_SECRET_KEY production <<< "sk_test_bF8IRwnylbrp7gjcsOEreFO633mQ5R3MYAemMuwN07" 2>/dev/null || echo "  CLERK_SECRET_KEY: al gezet of skipped"

vercel env add NEXT_PUBLIC_APP_URL production <<< "https://saas-factory-nine.vercel.app" 2>/dev/null || echo "  NEXT_PUBLIC_APP_URL: al gezet of skipped"

echo ""
echo "🚀 Deploying naar Vercel..."
echo ""

vercel --prod --yes

echo ""
echo "===================================="
echo "✅ Deployment voltooid!"
echo ""
echo "🧪 Test links:"
echo "  https://saas-factory-nine.vercel.app/"
echo ""
echo "📋 Database check:"
echo "  SELECT * FROM users;"
echo "===================================="
