import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[Register] Request received:', req.method)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Register] Missing env vars:', { url: !!supabaseUrl, key: !!supabaseServiceKey })
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { email, password, name } = req.body
  console.log('[Register] Attempt for:', email)

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Try admin create first (no email sent, auto-confirmed)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name || email.split('@')[0] }
    })

    if (error) {
      console.log('[Register] Admin create failed:', error.message)
      
      // If user already exists
      if (error.message?.includes('already') || error.code === 'user_already_exists') {
        return res.status(400).json({ error: 'Dit emailadres is al geregistreerd' })
      }

      // Try regular signUp as fallback
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || email.split('@')[0] } }
      })

      if (signUpError) {
        console.error('[Register] SignUp also failed:', signUpError)
        return res.status(400).json({ error: signUpError.message })
      }

      return res.status(200).json({
        success: true,
        message: 'Registratie succesvol - check je email',
        user: { id: signUpData.user?.id, email: signUpData.user?.email }
      })
    }

    console.log('[Register] User created:', data.user?.id)

    // Try to create profile, but don't fail if it doesn't work
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: name || email.split('@')[0],
          role: 'user',
          created_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (profileError) {
        console.log('[Register] Profile error (non-fatal):', profileError.message)
      } else {
        console.log('[Register] Profile created')
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Account succesvol aangemaakt',
      user: { id: data.user?.id, email: data.user?.email }
    })

  } catch (error: any) {
    console.error('[Register] Unexpected error:', error)
    return res.status(500).json({ error: 'Er is iets misgegaan. Probeer later opnieuw.' })
  }
}
