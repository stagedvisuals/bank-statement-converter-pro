import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Niet geauthenticeerd' },
        { status: 401 }
      )
    }

    // Get user profile with credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, onboarding_completed')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      // Fallback: check if user_credits table exists
      const { data: userCredits, error: creditsError } = await supabase
        .from('user_credits')
        .select('remaining_credits, total_credits, used_credits')
        .eq('user_id', user.id)
        .single()

      if (creditsError) {
        // If no credits found, return default 100 credits for new users
        return NextResponse.json({
          credits: {
            remaining_credits: 100,
            total_credits: 100,
            used_credits: 0,
            onboarding_completed: false
          }
        })
      }

      return NextResponse.json({
        credits: {
          remaining_credits: userCredits?.remaining_credits || 100,
          total_credits: userCredits?.total_credits || 100,
          used_credits: userCredits?.used_credits || 0,
          onboarding_completed: false
        }
      })
    }

    // Return credits from profile
    return NextResponse.json({
      credits: {
        remaining_credits: profile?.credits || 100,
        total_credits: 100,
        used_credits: profile?.credits ? 100 - profile.credits : 0,
        onboarding_completed: profile?.onboarding_completed || false
      }
    })

  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json(
      { error: 'Interne serverfout bij ophalen credits' },
      { status: 500 }
    )
  }
}
