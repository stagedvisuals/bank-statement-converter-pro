const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asqppiergpagmkxoxdtc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXBwaWVyZ3BhZ21reG94ZHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYxNzg1NSwiZXhwIjoyMDg3MTkzODU1fQ.Zx0bSf9yXbpMJNek6ZPNL9gtN233yB-7JScUMGrdZCI';

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 2,
  plan_type TEXT DEFAULT 'starter',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversions table
CREATE TABLE IF NOT EXISTS conversions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pdf_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_count INTEGER,
  download_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view own conversions" ON conversions
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')));
`;

async function initDatabase() {
  console.log('Initializing database...');
  
  // Execute SQL via RPC
  const { data, error } = await supabase.rpc('exec_sql', { sql });
  
  if (error) {
    console.error('Error executing SQL:', error);
    
    // Try alternative: create tables via REST API
    console.log('Trying alternative method...');
    
    // Test if users table exists by trying to select
    const { error: testError } = await supabase.from('users').select('*').limit(1);
    
    if (testError && testError.code === 'PGRST205') {
      console.log('Users table does not exist. Please run SQL manually in Supabase Dashboard SQL Editor.');
      console.log('\n=== COPY THIS SQL TO SUPABASE DASHBOARD ===');
      console.log(sql);
      console.log('=== END SQL ===\n');
    } else {
      console.log('Users table already exists or other error:', testError);
    }
  } else {
    console.log('Database initialized successfully:', data);
  }
}

initDatabase();
