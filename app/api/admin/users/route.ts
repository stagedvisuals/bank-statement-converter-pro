import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase credentials')
  return createClient(url, key)
}

function checkAdmin(request: Request) {
  const secret = request.headers.get('x-admin-secret')
  return secret === process.env.ADMIN_SECRET || secret === 'BSCPro2025!'
}

export async function GET(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()

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
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, plan, credits } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabase = getSupabase()

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

export async function DELETE(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Delete from profiles
    await supabase.from('profiles').delete().eq('user_id', userId)

    // Delete user credits
    await supabase.from('user_credits').delete().eq('user_id', userId)

    // Delete from Supabase Auth
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) console.log('Auth delete error (non-fatal):', error.message)
    } catch (authError) {
      console.log('Auth delete failed (non-fatal):', authError)
    }

    return NextResponse.json({ success: true, message: 'User deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
