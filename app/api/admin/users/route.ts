import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!checkAdmin(request)) {
    return unauthorizedResponse()
  }

  try {
    const supabase = getSupabaseAdmin()

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
    console.error('[Admin API GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!checkAdmin(request)) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { userId, plan, credits } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is verplicht' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
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
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is verplicht' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Soft delete: markeer als verwijderd
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        deleted_at: new Date().toISOString(),
        is_active: false 
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Delete mislukt: ' + error.message }, { status: 500 })
    }

    console.log(`User ${userId} soft-deleted`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Admin API DELETE] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
