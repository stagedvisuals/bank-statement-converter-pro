import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.bscpro.nl/reset-password'
    })

    if (error) {
      throw error
    }

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('Reset password error:', err)
    return res.status(500).json({ error: err.message })
  }
}
