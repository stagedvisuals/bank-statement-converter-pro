const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to:', supabaseUrl);
console.log('Using service role key:', supabaseKey ? '✓ Yes (first 20 chars: ' + supabaseKey.substring(0, 20) + '...)' : '✗ No');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigrations() {
  console.log('\n🚀 Starting migrations...\n');
  
  const statements = [
    {
      name: 'Create user_profiles table',
      sql: `CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        bedrijfsnaam TEXT NOT NULL DEFAULT '',
        kvk_nummer TEXT,
        btw_nummer TEXT,
        beroep TEXT NOT NULL DEFAULT 'zzp' CHECK (beroep IN ('boekhouder', 'zzp', 'mkb', 'adviseur', 'anders')),
        afschriften_per_maand INTEGER,
        logo_url TEXT,
        instelling_btw_categorisering BOOLEAN DEFAULT true,
        instelling_bedrijfsnaam_in_excel BOOLEAN DEFAULT true,
        instelling_lopend_saldo BOOLEAN DEFAULT true,
        instelling_logo_in_excel BOOLEAN DEFAULT false,
        instelling_kostenplaats BOOLEAN DEFAULT false,
        onboarding_voltooid BOOLEAN DEFAULT false,
        aangemaakt_op TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        bijgewerkt_op TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_user_id UNIQUE (user_id)
      )`
    },
    {
      name: 'Create index on user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id)'
    },
    {
      name: 'Create index on onboarding_voltooid',
      sql: 'CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_voltooid)'
    },
    {
      name: 'Enable RLS',
      sql: 'ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY'
    }
  ];

  for (const stmt of statements) {
    try {
      // Try executing via rpc first
      const { data, error } = await supabase.rpc('exec_sql', { query: stmt.sql });
      
      if (error) {
        // If rpc doesn't exist, try via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({ query: stmt.sql })
        });
        
        if (!response.ok) {
          console.log(`⚠️  ${stmt.name}: ${error.message || 'Method not available'}`);
        } else {
          console.log(`✅ ${stmt.name}`);
        }
      } else {
        console.log(`✅ ${stmt.name}`);
      }
    } catch (err) {
      console.log(`❌ ${stmt.name}: ${err.message}`);
    }
  }
  
  console.log('\n✨ Migration attempt completed!\n');
  console.log('⚠️  NOTE: If statements failed, run the SQL manually in Supabase SQL Editor:');
  console.log('   https://app.supabase.com/project/asqppiergpagmkxoxdtc/sql-editor');
  console.log('   File: supabase/migrations/RUN_IN_SQL_EDITOR.sql');
}

runMigrations();
