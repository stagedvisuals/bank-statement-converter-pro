import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check current credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError) {
      throw creditsError;
    }

    if (!credits || credits.remaining_credits <= 0) {
      return res.status(403).json({ 
        error: 'Geen credits beschikbaar',
        remaining_credits: 0
      });
    }

    // Use 1 credit
    const { data, error } = await supabase
      .from('user_credits')
      .update({
        used_credits: credits.used_credits + 1,
        remaining_credits: credits.remaining_credits - 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Log transaction
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -1,
      type: 'usage',
      description: 'PDF scan'
    });

    return res.status(200).json({
      success: true,
      remaining_credits: data.remaining_credits,
      total_used: data.used_credits
    });

  } catch (error: any) {
    console.error('Use credit error:', error);
    return res.status(500).json({ error: error.message });
  }
}
