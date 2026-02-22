import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow CORS for monitoring services
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Read env vars inside handler (important for Vercel)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const moonshotKey = process.env.MOONSHOT_API_KEY
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const startTime = Date.now()
  const checks: Record<string, { status: string; responseTime?: number; error?: string; value?: string }> = {}

  try {
    // Check 1: Environment Variables Loaded
    checks.env_loaded = {
      status: supabaseUrl ? 'ok' : 'error',
      value: supabaseUrl ? 'Present' : 'Missing',
      error: supabaseUrl ? undefined : 'NEXT_PUBLIC_SUPABASE_URL not found'
    }

    // Check 2: Database Connection
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const dbStart = Date.now()
        const { error } = await supabase.from('chat_conversations').select('count', { count: 'exact', head: true })
        checks.database = {
          status: error ? 'error' : 'ok',
          responseTime: Date.now() - dbStart,
          error: error?.message
        }
      } catch (e: any) {
        checks.database = { status: 'error', error: e.message }
      }
    } else {
      checks.database = { 
        status: 'error', 
        error: `Missing: URL=${!!supabaseUrl}, KEY=${!!supabaseServiceKey}` 
      }
    }

    // Check 3: Environment Variables Correct
    checks.environment = {
      status: appUrl === 'https://bscpro.nl' ? 'ok' : 'warning',
      value: appUrl,
      error: appUrl !== 'https://bscpro.nl' ? `URL is "${appUrl}", expected "https://bscpro.nl"` : undefined
    }

    // Check 4: AI API (Moonshot)
    if (moonshotKey) {
      try {
        const aiStart = Date.now()
        const response = await fetch('https://api.moonshot.cn/v1/models', {
          headers: { 'Authorization': `Bearer ${moonshotKey}` }
        })
        checks.ai_api = {
          status: response.ok ? 'ok' : 'error',
          responseTime: Date.now() - aiStart,
          error: response.ok ? undefined : `HTTP ${response.status}`
        }
      } catch (e: any) {
        checks.ai_api = { status: 'error', error: e.message }
      }
    } else {
      checks.ai_api = { status: 'error', error: 'MOONSHOT_API_KEY not configured' }
    }

    // Check 5: Clerk Auth
    checks.auth = {
      status: clerkKey ? 'ok' : 'error',
      error: clerkKey ? undefined : 'Clerk keys not configured'
    }

    // Determine overall status
    const allOk = Object.values(checks).every(c => c.status === 'ok')
    const hasErrors = Object.values(checks).some(c => c.status === 'error')
    
    const totalResponseTime = Date.now() - startTime

    return res.status(hasErrors ? 503 : 200).json({
      status: hasErrors ? 'degraded' : allOk ? 'healthy' : 'warning',
      timestamp: new Date().toISOString(),
      domain: 'bscpro.nl',
      responseTime: totalResponseTime,
      version: '2.0.0',
      checks
    })

  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      domain: 'bscpro.nl',
      error: error.message,
      checks
    })
  }
}
