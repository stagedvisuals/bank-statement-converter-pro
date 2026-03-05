const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const sqlStatements = [
  // 1. Create table
  `CREATE TABLE IF NOT EXISTS public.user_profiles (
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
  );`,

  // 2. Indexes
  `CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_voltooid);`,

  // 3. Enable RLS
  `ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;`,
];

async function runMigration() {
  console.log('Starting migration...\n');
  
  for (let i = 0; i < sqlStatements.length; i++) {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: sqlStatements[i] });
      
      if (error) {
        console.error(`❌ Statement ${i + 1} failed:`, error.message);
        // Continue with next statement
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    } catch (err) {
      console.error(`❌ Statement ${i + 1} error:`, err.message);
    }
  }
  
  console.log('\nMigration completed!');
}

runMigration();
