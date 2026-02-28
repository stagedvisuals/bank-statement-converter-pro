import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
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
