#!/bin/bash

echo "🌑 BSC Pro - Setup Script (Unified Architecture)"
echo "================================================"
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

echo ""
echo "✅ Dependencies installed"
echo ""

# Check required env vars
echo "🔍 Checking environment variables..."

# Supabase check
if grep -q "your-supabase-url" .env.local; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not configured"
    echo "   Get your URL from: https://supabase.com/dashboard"
fi

if grep -q "your-supabase-anon-key" .env.local; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured"
    echo "   Get your key from: https://supabase.com/dashboard"
fi

if grep -q "your-supabase-service-role-key" .env.local; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY not configured"
    echo "   Get your key from: https://supabase.com/dashboard"
fi

# Groq AI check
if grep -q "your-groq-api-key" .env.local; then
    echo "❌ GROQ_API_KEY not configured"
    echo "   Get your key from: https://console.groq.com/keys"
fi

# Upstash Redis check (for rate limiting)
if grep -q "your-upstash-redis-url" .env.local; then
    echo "⚠️  UPSTASH_REDIS_URL not configured (optional for rate limiting)"
    echo "   Get your URL from: https://upstash.com/"
fi

if grep -q "your-upstash-redis-token" .env.local; then
    echo "⚠️  UPSTASH_REDIS_TOKEN not configured (optional for rate limiting)"
    echo "   Get your token from: https://upstash.com/"
fi

# Admin secret check
if grep -q "your-admin-secret" .env.local; then
    echo "⚠️  ADMIN_SECRET not configured (server-side only)"
    echo "   Generate a secure random string for admin access"
fi

echo ""
echo "📋 Setup Checklist:"
echo "  [ ] Fill in .env.local with your API keys"
echo "  [ ] Run database schema in Supabase SQL Editor:"
echo "       - unified_final_schema.sql (complete unified schema)"
echo "  [ ] Verify domain in your email provider (Resend/SendGrid)"
echo "  [ ] Configure Vercel environment variables"
echo ""
echo "🚀 Ready to deploy: npm run build && vercel --prod"
echo ""
echo "🔧 Architecture Notes:"
echo "  • Auth: Supabase Auth only (no Clerk)"
echo "  • Database: Unified profiles table (single source of truth)"
echo "  • Rate limiting: Upstash Redis (optional)"
echo "  • Security: Server-side ADMIN_SECRET only"
echo ""
