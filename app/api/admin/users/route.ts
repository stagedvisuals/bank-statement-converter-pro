import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const adminSecret = request.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_credits (
          remaining_credits,
          total_credits,
          used_credits
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: users || [] })
  } catch (error: any) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const adminSecret = request.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, plan, credits } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (plan !== undefined) {
      const { error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('user_id', userId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (credits !== undefined) {
      const { data: existing } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existing) {
        await supabase
          .from('user_credits')
          .update({ remaining_credits: parseInt(credits) })
          .eq('user_id', userId)
      } else {
        await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            remaining_credits: parseInt(credits),
            total_credits: parseInt(credits),
            used_credits: 0
          })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
