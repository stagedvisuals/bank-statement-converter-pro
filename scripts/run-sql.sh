# Supabase SQL Migration Script
# Run this in your terminal with:
# chmod +x scripts/run-sql.sh && ./scripts/run-sql.sh

# NOTE: Set these environment variables before running:
# export PROJECT_REF="your-project-ref"
# export SERVICE_KEY="your-service-key"

PROJECT_REF="${PROJECT_REF:-asqppiergpagmkxoxdtc}"
SUPABASE_URL="https://$PROJECT_REF.supabase.co"
SERVICE_KEY="${SERVICE_KEY:-}"

if [ -z "$SERVICE_KEY" ]; then
  echo "❌ Error: SERVICE_KEY environment variable not set"
  echo "Set it with: export SERVICE_KEY=your_service_key"
  exit 1
fi

echo "🚀 Running Supabase SQL Migration..."
echo "Project: $PROJECT_REF"
echo ""

# Create table
echo "1. Creating user_profiles table..."
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE TABLE IF NOT EXISTS public.user_profiles (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, bedrijfsnaam TEXT NOT NULL DEFAULT '\''\'\'', kvk_nummer TEXT, btw_nummer TEXT, beroep TEXT NOT NULL DEFAULT '\''zzp'\'' CHECK (beroep IN ('\''boekhouder'\'', '\''zzp'\'', '\''mkb'\'', '\''adviseur'\'', '\''anders'\'')), afschriften_per_maand INTEGER, logo_url TEXT, instelling_btw_categorisering BOOLEAN DEFAULT true, instelling_bedrijfsnaam_in_excel BOOLEAN DEFAULT true, instelling_lopend_saldo BOOLEAN DEFAULT true, instelling_logo_in_excel BOOLEAN DEFAULT false, instelling_kostenplaats BOOLEAN DEFAULT false, onboarding_voltooid BOOLEAN DEFAULT false, aangemaakt_op TIMESTAMP WITH TIME ZONE DEFAULT NOW(), bijgewerkt_op TIMESTAMP WITH TIME ZONE DEFAULT NOW(), CONSTRAINT unique_user_id UNIQUE (user_id))"}'

echo ""
echo "2. Creating indexes..."
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id)"}'

curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_voltooid)"}'

echo ""
echo "3. Enabling RLS..."
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sql": "ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY"}'

echo ""
echo "✅ Migration completed!"
echo ""
echo "⚠️  IMPORTANT: If this failed, run the SQL manually:"
echo "   1. Go to: https://app.supabase.com/project/$PROJECT_REF/sql-editor"
echo "   2. Paste contents of: supabase/migrations/RUN_IN_SQL_EDITOR.sql"
echo "   3. Click 'Run'"
