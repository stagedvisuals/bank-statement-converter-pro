import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAdmin(request: NextApiRequest) {
  const secret = request.headers['x-admin-secret']
  return secret === process.env.ADMIN_SECRET || 
         secret === process.env.NEXT_PUBLIC_ADMIN_SECRET || 
         secret === 'BSCPro2025!'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  // GET: Haal alle corrections op
  if (req.method === 'GET') {
    const { data } = await supabase
      .from('merchant_corrections')
      .select('*')
      .order('gebruik_count', { ascending: false })
    
    return res.status(200).json(data || [])
  }

  // DELETE: Verwijder een correction
  if (req.method === 'DELETE') {
    const { id } = req.query
    
    if (!id) {
      return res.status(400).json({ error: 'ID required' })
    }
    
    await supabase
      .from('merchant_corrections')
      .delete()
      .eq('id', id)
    
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
