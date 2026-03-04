import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!checkAdmin(request)) return unauthorizedResponse()

  try {
    const supabase = getSupabaseAdmin()
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    const { data: credits } = await supabase
      .from('user_credits')
      .select('*')

    const users = (profiles || []).map(profile => {
      const userCredits = (credits || []).find((c: any) => c.user_id === profile.user_id)
      return {
        ...profile,
        credits: userCredits || { remaining_credits: 0, total_credits: 0, used_credits: 0 }
      }
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!checkAdmin(request)) return unauthorizedResponse()

  try {
    const body = await request.json()
    const { userId, plan, credits } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is verplicht' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const results: any = {}

    if (plan !== undefined) {
      const { error } = await supabase
        .from('user_profiles')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) {
        return NextResponse.json({ error: 'Plan update mislukt: ' + error.message }, { status: 500 })
      }
      results.plan = plan
    }

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
          return NextResponse.json({ error: 'Credits aanmaken mislukt: ' + error.message }, { status: 500 })
        }
      }
      results.credits = creditsNum
    }

    return NextResponse.json({ 
      success: true, 
      updated: results, 
      message: 'Gebruiker succesvol bijgewerkt' 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) return unauthorizedResponse()

  try {
    // Lees userId uit query params (frontend stuurt het als query param)
    const { searchParams } = new URL(request.url)
    let userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId is verplicht' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    
    // Verwijder eerst credits
    await supabase
      .from('user_credits')
      .delete()
      .eq('user_id', userId)

    // Verwijder dan profile
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: 'Verwijderen mislukt: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Gebruiker succesvol verwijderd' 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
