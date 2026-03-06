import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      return NextResponse.json({ 
        progress_percentage: 0,
        current_step: 'new',
        completed_steps: []
      })
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(url, key)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({
        progress_percentage: 0,
        current_step: 'new',
        completed_steps: []
      })
    }

    return NextResponse.json({
      progress_percentage: data.onboarding_completed ? 100 : 0,
      current_step: data.onboarding_completed ? 'completed' : 'in_progress',
      completed_steps: data.onboarding_completed ? ['welcome', 'tutorial', 'first_upload'] : []
    })
  } catch (error: any) {
    return NextResponse.json({ 
      progress_percentage: 0,
      current_step: 'new',
      completed_steps: []
    })
  }
}

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(url, key)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    // Speciale complete actie - voor "Onboarding afronden" knop
    if (action === 'complete') {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          onboarding_completed: true,
          bijgewerkt_op: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true, completed: true })
    }

    // Normale progress update
    const { progress } = body
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        onboarding_completed: progress === 100 ? true : false,
        bijgewerkt_op: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
