import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, calculation } = req.body;

    if (!sessionId || !calculation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from('anonymous_calculations')
      .insert({
        session_id: sessionId,
        calculation_data: calculation,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving calculation:', error);
      return res.status(500).json({ error: 'Failed to save calculation' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
