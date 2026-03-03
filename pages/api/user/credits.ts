import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Haal credits op
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Haal plan op uit profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, bedrijfsnaam')
      .eq('user_id', user.id)
      .single()

    if (creditsError && creditsError.code !== 'PGRST116') {
      throw creditsError
    }

    // Als geen credits rij bestaat, maak aan met 2 gratis
    if (!credits) {
      const { data: newCredits } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          remaining_credits: 2,
          total_credits: 2,
          used_credits: 0
        })
        .select()
        .single()

      return res.status(200).json({
        credits: newCredits || {
          remaining_credits: 2,
          total_credits: 2,
          used_credits: 0
        },
        plan: profile?.plan || 'free'
      })
    }

    return res.status(200).json({
      credits: {
        remaining_credits: credits.remaining_credits ?? 0,
        total_credits: credits.total_credits ?? 0,
        used_credits: credits.used_credits ?? 0
      },
      plan: profile?.plan || 'free'
    })
  } catch (error: any) {
    console.error('Credits API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
