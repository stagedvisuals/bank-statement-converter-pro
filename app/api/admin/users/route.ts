import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const adminSecret = request.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Initialize Supabase client inside function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Server configuration error - missing Supabase credentials',
        users: [] 
      }, { status: 200 }) // Return empty array instead of 500
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ users: [] }) // Return empty array on error
    }

    return NextResponse.json({ users: users || [] })
  } catch (error: any) {
    console.error('GET error:', error)
    return NextResponse.json({ users: [] }) // Return empty array on any error
  }
}

export async function PATCH(request: Request) {
  const adminSecret = request.headers.get("x-admin-secret")
  if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== "BSCPro2025!") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, plan, credits } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    // Initialize Supabase client inside function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Server configuration error - missing Supabase credentials'
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const results: any = {}

    // Update plan in profiles tabel
    if (plan !== undefined) {
      const { error: planError } = await supabase
        .from("profiles")
        .update({ plan: plan })
        .eq("user_id", userId)
      if (planError) {
        return NextResponse.json({ error: "Plan update mislukt: " + planError.message }, { status: 500 })
      }
      results.plan = plan
    }

    // Update credits in user_credits tabel
    if (credits !== undefined) {
      const creditsNum = parseInt(credits)
      
      // Check of user_credits rij bestaat
      const { data: existing } = await supabase
        .from("user_credits")
        .select("id, total_credits, used_credits")
        .eq("user_id", userId)
        .single()

      if (existing) {
        // Update bestaande rij
        const { error: creditsError } = await supabase
          .from("user_credits")
          .update({
            remaining_credits: creditsNum,
            total_credits: (existing.total_credits || 0) + creditsNum,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId)
        if (creditsError) {
          return NextResponse.json({ error: "Credits update mislukt: " + creditsError.message }, { status: 500 })
        }
      } else {
        // Maak nieuwe rij aan
        const { error: insertError } = await supabase
          .from("user_credits")
          .insert({
            user_id: userId,
            remaining_credits: creditsNum,
            total_credits: creditsNum,
            used_credits: 0
          })
        if (insertError) {
          return NextResponse.json({ error: "Credits aanmaken mislukt: " + insertError.message }, { status: 500 })
        }
      }

      // Log de credit transactie
      await supabase
        .from("credit_transactions")
        .insert({
          user_id: userId,
          amount: creditsNum,
          type: "admin_grant",
          description: `Admin heeft ${creditsNum} credits toegevoegd`
        })

      results.credits = creditsNum
    }

    return NextResponse.json({
      success: true,
      updated: results,
      message: "Gebruiker succesvol bijgewerkt"
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const adminSecret = request.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Initialize Supabase client inside function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Server configuration error - missing Supabase credentials'
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Delete from profiles
    await supabase.from("profiles").delete().eq("user_id", userId)

    // Delete user credits
    await supabase.from("user_credits").delete().eq("user_id", userId)

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
