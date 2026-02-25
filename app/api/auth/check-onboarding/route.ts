import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Haal profiel op
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('onboarding_voltooid')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json({ onboardingVoltooid: false }, { status: 200 })
    }

    return NextResponse.json({ 
      onboardingVoltooid: profile?.onboarding_voltooid || false 
    })

  } catch (error) {
    console.error('Check onboarding error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
