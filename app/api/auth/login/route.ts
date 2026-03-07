import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

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
    
    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login error:', authError)
      return NextResponse.json(
        { error: 'Ongeldige email of wachtwoord' },
        { status: 401 }
      )
    }

    if (!authData.session) {
      return NextResponse.json(
        { error: 'Login mislukt - geen sessie ontvangen' },
        { status: 500 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    // Return session data for client-side storage
    return NextResponse.json({
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile?.role || 'user',
        credits_remaining: profile?.credits_remaining || 0,
        onboarding_completed: profile?.onboarding_completed || false,
      }
    })

  } catch (error: any) {
    console.error('Login route error:', error)
    return NextResponse.json(
      { error: 'Server error tijdens login' },
      { status: 500 }
    )
  }
}
