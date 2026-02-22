import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[API Register] Request received:', req.method)

  if (req.method !== 'POST') {
    console.log('[API Register] Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('[API Register] Supabase configured:', !!supabaseUrl && !!supabaseServiceKey)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[API Register] Supabase not configured')
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const { email, password, name } = req.body
  console.log('[API Register] Registration attempt for:', email)

  if (!email || !password) {
    console.log('[API Register] Missing email or password')
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (password.length < 6) {
    console.log('[API Register] Password too short')
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    console.log('[API Register] Creating Supabase client')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('[API Register] Attempting sign up')
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split('@')[0]
        }
      }
    })

    if (error) {
      console.error('[API Register] Supabase auth error:', error)
      return res.status(400).json({ error: error.message })
    }

    console.log('[API Register] Auth successful, user ID:', data.user?.id)

    // Create profile
    if (data.user) {
      console.log('[API Register] Creating profile in public.profiles')
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: name || email.split('@')[0],
        role: 'user',
        created_at: new Date().toISOString()
      })

      if (profileError) {
        console.error('[API Register] Profile creation error:', profileError)
      } else {
        console.log('[API Register] Profile created successfully')
      }
    }

    console.log('[API Register] Sending success response')
    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: data.user?.id,
        email: data.user?.email
      }
    })

  } catch (error: any) {
    console.error('[API Register] Unexpected error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
