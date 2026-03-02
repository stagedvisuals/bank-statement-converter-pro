import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Lazy initialization - only create client when needed
let supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      throw new Error('Supabase not configured')
    }
    
    supabase = createClient(url, key)
  }
  return supabase
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const client = getSupabase()
    const { data: { user }, error: authError } = await client.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { data, error } = await client
      .from('onboarding_status')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({
        progress_percentage: 0,
        current_step: 'new',
        completed_steps: []
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Onboarding GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const client = getSupabase()
    const { data: { user }, error: authError } = await client.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { step, progress } = body

    const { data, error } = await client
      .from('onboarding_status')
      .upsert({
        user_id: user.id,
        progress_percentage: progress || 0,
        current_step: step || 'in_progress',
        completed_steps: progress === 100 ? ['welcome', 'tutorial', 'first_upload'] : [],
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Onboarding POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
