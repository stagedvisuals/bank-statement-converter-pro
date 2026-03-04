import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const results: any = {}
  let allHealthy = true

  // Check environment variables (alleen kritieke vars)
  const requiredEnvs = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  const missingEnvs = requiredEnvs.filter(e => !process.env[e])
  results.env_vars = {
    status: missingEnvs.length === 0 ? 'ok' : 'error',
    missing: missingEnvs
  }
  if (missingEnvs.length > 0) allHealthy = false

  // Check database connection
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    results.database = {
      status: error ? 'error' : 'ok',
      error: error?.message
    }
    if (error) allHealthy = false
  } catch (e: any) {
    results.database = { status: 'error', error: e.message }
    allHealthy = false
  }

  // Check Supabase Auth
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.auth.getSession()
    results.auth = {
      status: error ? 'error' : 'ok',
      error: error?.message
    }
    if (error) allHealthy = false
  } catch (e: any) {
    results.auth = { status: 'error', error: e.message }
    allHealthy = false
  }

  return NextResponse.json({
    healthy: allHealthy,
    checks: results,
    timestamp: new Date().toISOString()
  }, { status: allHealthy ? 200 : 503 })
}
