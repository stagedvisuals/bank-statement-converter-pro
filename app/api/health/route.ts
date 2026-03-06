import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const results: any = {}

  // 1. Check env vars
  const requiredEnvs = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
  const missingEnvs = requiredEnvs.filter(e => !process.env[e])
  
  results.env_vars = {
    status: missingEnvs.length === 0 ? 'ok' : 'warning',
    missing: missingEnvs,
    message: missingEnvs.length === 0 ? 'Alle variabelen aanwezig' : `Missend: ${missingEnvs.join(', ')}`
  }

  // 2. Check database (echte query)
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('profiles').select('count').limit(1)
    results.database = {
      status: error ? 'error' : 'ok',
      message: error ? error.message : 'Database bereikbaar'
    }
  } catch (e: any) {
    results.database = { status: 'error', message: e.message }
  }

  // 3. Check Supabase Auth (echte query)
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
    results.auth = {
      status: error ? 'error' : 'ok',
      message: error ? error.message : 'Auth service actief'
    }
  } catch (e: any) {
    results.auth = { status: 'error', message: e.message }
  }

  // 4. Overall status
  const hasError = Object.values(results).some((r: any) => r.status === 'error')
  const hasWarning = Object.values(results).some((r: any) => r.status === 'warning')

  return NextResponse.json({
    status: hasError ? 'error' : hasWarning ? 'warning' : 'ok',
    timestamp: new Date().toISOString(),
    checks: results
  })
}
