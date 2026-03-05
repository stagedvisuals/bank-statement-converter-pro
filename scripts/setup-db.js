const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asqppiergpagmkxoxdtc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXBwaWVyZ3BhZ21reG94ZHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYxNzg1NSwiZXhwIjoyMDg3MTkzODU1fQ.cAzWhpx3Vcni58tPWK9-0VW8vQ_-uYPLlosaCLE964A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Create users table
  const { error: usersError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        credits INTEGER DEFAULT 2,
        plan_type TEXT DEFAULT 'starter',
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
    `
  });
  
  if (usersError) {
    console.error('Users table error:', usersError);
    // Try direct SQL
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code === '42P01') {
      console.log('Users table does not exist, creating...');
    }
  }
  
  // Create conversions table
  const { error: convError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS conversions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        pdf_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        transaction_count INTEGER,
        download_url TEXT,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );
      
      CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
      CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);
    `
  });
  
  if (convError) {
    console.error('Conversions table error:', convError);
  }
  
  console.log('Database setup complete!');
}

setupDatabase().catch(console.error);
