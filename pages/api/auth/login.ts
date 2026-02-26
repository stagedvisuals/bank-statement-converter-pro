import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[API Login] Request received:', req.method)

  if (req.method !== 'POST') {
    console.log('[API Login] Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get environment variables inside handler to ensure they're available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  console.log('[API Login] Supabase URL exists:', !!supabaseUrl)
  console.log('[API Login] Supabase Service Key exists:', !!supabaseServiceKey)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[API Login] Supabase not configured')
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const { email, password } = req.body
  console.log('[API Login] Login attempt for email:', email)

  if (!email || !password) {
    console.log('[API Login] Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }

  // STAP 3: Haal IP adres op
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.headers['x-real-ip'] 
    || req.socket.remoteAddress 
    || '0.0.0.0'
  
  console.log('[API Login] IP Address:', ipAddress)

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
      
      // Log failed login attempt
      await supabase.from('security_logs').insert({
        event_type: 'LOGIN_FAILED',
        ip_address: ipAddress,
        details: { 
          email: email,
          reason: error.message
        }
      })
      
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

    // STAP 3: Update user profile met login info
    const now = new Date().toISOString()
    
    if (profile && data.user) {
      // Update login info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          last_login_ip: ipAddress,
          last_login_at: now,
          login_count: (profile.login_count || 0) + 1
        })
        .eq('id', data.user.id)

      if (updateError) {
        console.log('[API Login] Failed to update login info:', updateError.message)
      } else {
        console.log('[API Login] Updated login info for user:', data.user.id)
      }

      // Log security event
      await supabase.from('security_logs').insert({
        user_id: data.user.id,
        event_type: 'LOGIN_SUCCESS',
        ip_address: ipAddress,
        details: { 
          email: email,
          login_count: (profile.login_count || 0) + 1
        }
      })

      // Check of IP drastisch veranderd is
      if (profile.registration_ip && profile.registration_ip !== ipAddress) {
        console.log('[API Login] IP changed from', profile.registration_ip, 'to', ipAddress)
        
        await supabase.from('security_logs').insert({
          user_id: data.user.id,
          event_type: 'IP_CHANGE',
          ip_address: ipAddress,
          details: { 
            old_ip: profile.registration_ip,
            new_ip: ipAddress,
            email: email
          }
        })
      }
    }

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
          created_at: now,
          last_login_ip: ipAddress,
          last_login_at: now,
          login_count: 1
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
