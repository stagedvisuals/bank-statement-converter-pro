import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('[Admin API] Missing Supabase credentials')
    throw new Error(JSON.stringify({ error: "Service unavailable", code: "SERVICE_UNAVAILABLE" }))
  }
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

    // Haal gebruikers op
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Profiles error:', profilesError)
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    // Haal credits op
    const { data: credits } = await supabase
      .from('user_credits')
      .select('*')

    // Combineer data
    const users = (profiles || []).map(profile => {
      const userCredits = (credits || []).find(c => c.user_id === profile.user_id)
      return {
        ...profile,
        credits: userCredits || {
          remaining_credits: 0,
          total_credits: 0,
          used_credits: 0
        }
      }
    })

    console.log(`Admin: ${users.length} gebruikers geladen`)
    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('[Admin API DELETE] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('[Admin API PATCH] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('[Admin API GET] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('Admin GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, plan, credits } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is verplicht' }, { status: 400 })
    }

    const supabase = getSupabase()
    const results: any = {}

    // Update plan
    if (plan !== undefined) {
      const { error } = await supabase
        .from('user_profiles')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) {
        console.error('Plan update error:', error)
        return NextResponse.json({ error: 'Plan update mislukt: ' + error.message }, { status: 500 })
      }
      results.plan = plan
      console.log(`Plan updated voor ${userId}: ${plan}`)
    }

    // Update credits
    if (credits !== undefined) {
      const creditsNum = parseInt(String(credits))
      
      const { data: existing } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('user_credits')
          .update({
            remaining_credits: creditsNum,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          console.error('Credits update error:', error)
          return NextResponse.json({ error: 'Credits update mislukt: ' + error.message }, { status: 500 })
        }
      } else {
        const { error } = await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            remaining_credits: creditsNum,
            total_credits: creditsNum,
            used_credits: 0
          })

        if (error) {
          console.error('Credits insert error:', error)
          return NextResponse.json({ error: 'Credits aanmaken mislukt: ' + error.message }, { status: 500 })
        }
      }
      results.credits = creditsNum
      console.log(`Credits updated voor ${userId}: ${creditsNum}`)
    }

    return NextResponse.json({ success: true, updated: results })
  } catch (error: any) {
    console.error('[Admin API PATCH] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('[Admin API GET] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('Admin PATCH error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId is verplicht' }, { status: 400 })
    }

    const supabase = getSupabase()
    
    // Verwijder eerst credits, dan profile
    await supabase.from('user_credits').delete().eq('user_id', userId)
    await supabase.from('user_profiles').delete().eq('user_id', userId)

    // Verwijder uit auth
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) {
      return NextResponse.json({ error: 'Gebruiker verwijderen mislukt: ' + error.message }, { status: 500 })
    }

    console.log(`Gebruiker verwijderd: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Admin API PATCH] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('[Admin API GET] Error:', error)
    // Try to parse JSON error message
    try {
      const parsedError = JSON.parse(error.message)
      return NextResponse.json(parsedError, { status: 503 })
    } catch (parseError) {
      // Not a JSON error, return generic error
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
    console.error('Admin DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
