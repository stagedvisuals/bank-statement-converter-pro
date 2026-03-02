import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { bank, transactie_count, status, error } = req.body

    // Log conversion
    await supabase.from('conversions').insert({
      user_id: user.id,
      user_email: user.email,
      bank: bank || 'unknown',
      transaction_count: transactie_count || 0,
      status: status || 'unknown',
      format: 'pdf',
      error_message: error || null,
      created_at: new Date().toISOString()
    })

    // Update conversions_count in user_profiles on success
    if (status === 'success') {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('conversions_count')
        .eq('user_id', user.id)
        .single()

      await supabase
        .from('user_profiles')
        .update({ 
          conversions_count: (profile?.conversions_count || 0) + 1 
        })
        .eq('user_id', user.id)
    }

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('Conversion log error:', err)
    return res.status(500).json({ error: err.message })
  }
}
