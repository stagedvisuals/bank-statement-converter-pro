#!/bin/bash

# Deployment Script for EPIC 1 & 2 - BSC Pro
echo "=== BSC Pro EPIC 1 & 2 Deployment ==="
echo "Date: $(date)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

echo "1. Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  Warning: Supabase environment variables might not be set"
    echo "   Make sure these are configured in Vercel:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - GROQ_API_KEY"
    echo "   - ADMIN_SECRET"
else
    echo "✅ Environment variables appear to be set"
fi

echo ""
echo "2. Running TypeScript type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    exit 1
fi

echo ""
echo "3. Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "4. Deploying to Vercel..."
echo "   Project: bscpro_ (www.bscpro.nl)"
echo "   Note: Make sure you're linked to the correct project:"
echo "   Run: vercel link --project bscpro_ --yes"

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    echo ""
    read -p "Do you want to deploy now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deploying..."
        vercel --prod
    else
        echo "Skipping deployment. Run 'vercel --prod' when ready."
    fi
else
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    echo "   Or deploy via GitHub integration"
fi

echo ""
echo "5. SQL Migration Instructions:"
echo "   ==========================="
echo "   IMPORTANT: Run this SQL in Supabase Dashboard:"
echo ""
echo "   1. Go to https://supabase.com/dashboard/project/asqppiergpagmkxoxdtc/sql"
echo "   2. Copy the contents of:"
echo "      supabase/migrations/20260305095000_enhanced_free_scans_with_rls.sql"
echo "   3. Run the SQL to create the free_scans table with RLS"
echo ""
echo "6. Testing Instructions:"
echo "   ===================="
echo "   After deployment, test:"
echo "   1. Open https://www.bscpro.nl in incognito mode"
echo "   2. Upload a PDF - should work once"
echo "   3. Try second upload - should show 'Fort Knox' barrier"
echo "   4. Check trust scores in preview"
echo "   5. Test bulk upload at /dashboard/bulk-upload"
echo ""
echo "7. CFO-mode Tracking:"
echo "   =================="
echo "   Monitor leads in Supabase:"
echo "   SELECT * FROM lead_analytics ORDER BY scan_date DESC;"
echo ""
echo "=== Deployment Checklist Complete ==="
echo ""
echo "Next steps:"
echo "1. ✅ EPIC 1: Anti-abuse with strict validation (no fail-open)"
echo "2. ✅ EPIC 2: B2B Bulk Upload System"
echo "3. 🔄 Run SQL migration in Supabase"
echo "4. 🔄 Test live deployment"
echo "5. 🔄 Monitor lead conversions"
