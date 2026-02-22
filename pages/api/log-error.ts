import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, bankName, errorType, errorMessage, fileFormat, metadata } = req.body

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Supabase not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('conversion_errors')
      .insert({
        user_id: userId,
        bank_name: bankName,
        error_type: errorType,
        error_message: errorMessage,
        file_format: fileFormat,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error logging failed:', error)
      return res.status(500).json({ error: 'Failed to log error' })
    }

    return res.status(200).json({ success: true, id: data[0].id })

  } catch (error: any) {
    console.error('Error tracking API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
