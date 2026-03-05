import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fallback voor development/local testing
if (!supabaseAnonKey && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is niet ingesteld. Gebruik development fallback.')
  // Development fallback - alleen voor local testing
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXBwaWVyZ3BhZ21reG94ZHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1MTYwMDAsImV4cCI6MjA0NjA5MjAwMH0.DEV_FALLBACK_ONLY_DO_NOT_USE_IN_PRODUCTION'
}

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is vereist')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is vereist')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
