import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { isBlockedEmailDomain } from '@/lib/blocked-email-domains'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[Register] Request received:', req.method)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get environment variables inside handler to ensure they're available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const { email, password, name } = req.body
  console.log('[Register] Attempt for:', email)

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  // STAP 1A: Check weggooi email domeinen
  if (isBlockedEmailDomain(email)) {
    console.log('[Register] Blocked disposable email:', email)
    return res.status(400).json({
      error: 'Gebruik een zakelijk of persoonlijk emailadres. Weggooi-emails zijn niet toegestaan.'
    })
  }

  // STAP 1B: Haal IP adres op
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.headers['x-real-ip'] 
    || req.socket.remoteAddress 
    || '0.0.0.0'
  
  console.log('[Register] IP Address:', ipAddress)

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // STAP 1B: Check max 2 accounts per IP
    const { data: existingAccounts, error: ipCheckError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('registration_ip', ipAddress)

    if (ipCheckError) {
      console.log('[Register] IP check error:', ipCheckError.message)
    }

    if (existingAccounts && existingAccounts.length >= 2) {
      console.log('[Register] Too many accounts from IP:', ipAddress, 'Count:', existingAccounts.length)
      
      // Log security event
      await supabase.from('security_logs').insert({
        event_type: 'REGISTRATION_BLOCKED',
        ip_address: ipAddress,
        details: { 
          email: email,
          reason: 'MAX_ACCOUNTS_PER_IP_EXCEEDED',
          existing_count: existingAccounts.length
        }
      })
      
      return res.status(429).json({
        error: 'Te veel accounts geregistreerd vanaf dit netwerk. Neem contact op via info@bscpro.nl'
      })
    }

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

    // Try to create profile with security data
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: name || email.split('@')[0],
          role: 'user',
          created_at: new Date().toISOString(),
          registration_ip: ipAddress,
          trial_conversions_used: 0
        }, { onConflict: 'id' })

      if (profileError) {
        console.log('[Register] Profile error (non-fatal):', profileError.message)
      } else {
        console.log('[Register] Profile created with IP:', ipAddress)
      }

      // Log successful registration in security_logs
      await supabase.from('security_logs').insert({
        user_id: data.user.id,
        event_type: 'REGISTRATION_SUCCESS',
        ip_address: ipAddress,
        details: { 
          email: email,
          accounts_from_ip: (existingAccounts?.length || 0) + 1
        }
      })
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
