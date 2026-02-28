import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper to check if user is admin
async function isAdmin(token: string): Promise<boolean> {
  if (!supabaseUrl || !supabaseServiceKey) return false
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) return false
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return profile?.role === 'admin'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check auth token
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const token = authHeader.replace('Bearer ', '')
  
  // Verify admin role
  const adminCheck = await isAdmin(token)
  if (!adminCheck) {
    return res.status(403).json({ error: 'Admin access required' })
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Get chat conversations with message count
    const { data: conversations, error: convError } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages:chat_messages(count)
      `)
      .order('updated_at', { ascending: false })

    if (convError) {
      console.error('Error fetching conversations:', convError)
      return res.status(500).json({ error: 'Failed to fetch conversations' })
    }

    // Get contact messages
    const { data: contacts, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (contactError) {
      console.error('Error fetching contacts:', contactError)
    }

    // Get stats
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: totalConversations } = await supabase
      .from('chat_conversations')
      .select('*', { count: 'exact', head: true })

    const { count: totalContacts } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalConversations: totalConversations || 0,
        totalContacts: totalContacts || 0
      },
      conversations: conversations || [],
      contacts: contacts || []
    })

  } catch (error: any) {
    console.error('Admin API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
