import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get session from request
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '')
    
    // Verify session
    const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error: any) {
    console.error('Session error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
