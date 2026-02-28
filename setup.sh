#!/bin/bash

echo "🌑 BSC Pro - Setup Script"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please fill in your API keys"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Resend for email
if ! npm list resend > /dev/null 2>&1; then
    echo "📧 Installing Resend for email automation..."
    npm install resend
fi

echo ""
echo "✅ Dependencies installed"
echo ""

# Check required env vars
echo "🔍 Checking environment variables..."

if grep -q "your-moonshot-api-key" .env.local; then
    echo "❌ MOONSHOT_API_KEY not configured"
    echo "   Get your key from: https://platform.moonshot.cn/"
fi

if grep -q "re_..." .env.local; then
    echo "❌ RESEND_API_KEY not configured"
    echo "   Get your key from: https://resend.com/api-keys"
    echo "   IMPORTANT: Verify bscpro.nl domain in Resend first!"
fi

if grep -q "pk_test_..." .env.local; then
    echo "❌ Clerk keys not configured"
    echo "   Get your keys from: https://dashboard.clerk.dev"
fi

echo ""
echo "📋 Setup Checklist:"
echo "  [ ] Fill in .env.local with your API keys"
echo "  [ ] Run database schema in Supabase SQL Editor:"
echo "       - supabase_chat_schema.sql"
echo "  [ ] Verify bscpro.nl domain in Resend dashboard"
echo "  [ ] Set up cron job for daily digest:"
echo "       0 20 * * * cd $(pwd) && node scripts/daily-digest.js"
echo ""
echo "🚀 Ready to deploy: npm run build && vercel --prod"
echo ""
