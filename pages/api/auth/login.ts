import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[API Login] Request received:', req.method)

  if (req.method !== 'POST') {
    console.log('[API Login] Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get environment variables inside handler to ensure they're available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('[API Login] Supabase URL exists:', !!supabaseUrl)
  console.log('[API Login] Supabase Service Key exists:', !!supabaseServiceKey)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[API Login] Supabase not configured')
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  // Validate Supabase URL format
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    console.error('[API Login] Invalid Supabase URL format, trying anyway...')
    // Continue anyway to see the actual error from Supabase
  }

  const { email, password } = req.body
  console.log('[API Login] Login attempt for email:', email)

  if (!email || !password) {
    console.log('[API Login] Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    console.log('[API Login] Creating Supabase client')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('[API Login] Attempting sign in with Supabase Auth')
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('[API Login] Supabase auth error:', error)
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    console.log('[API Login] Auth successful, user ID:', data.user?.id)
    console.log('[API Login] Fetching user profile')

    // Get user profile - handle case where profile doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single()

    if (profileError) {
      console.log('[API Login] Profile not found, creating fallback')
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          email: data.user?.email,
          full_name: data.user?.email?.split('@')[0] || 'User',
          role: 'user',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('[API Login] Error creating profile:', createError)
      }

      console.log('[API Login] Sending response with new profile')
      return res.status(200).json({
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: 'user'
        },
        session: data.session
      })
    }

    console.log('[API Login] Profile found, role:', profile?.role)
    console.log('[API Login] Sending successful response')

    return res.status(200).json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: profile?.role || 'user'
      },
      session: data.session
    })

  } catch (error: any) {
    console.error('[API Login] Unexpected error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
