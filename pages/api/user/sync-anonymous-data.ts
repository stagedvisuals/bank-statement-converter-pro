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

    const { sessionId, calculations } = req.body;

    if (!sessionId || !calculations || !Array.isArray(calculations)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update existing anonymous records with user_id
    const { error: updateError } = await supabase
      .from('anonymous_tool_data')
      .update({ 
        user_id: user.id,
        synced_to_user: true 
      })
      .eq('session_id', sessionId)
      .is('user_id', null);

    if (updateError) throw updateError;

    // Mark onboarding step as completed
    await supabase
      .from('onboarding_status')
      .update({ step_tools_used_completed: true })
      .eq('user_id', user.id);

    return res.status(200).json({ 
      success: true,
      message: 'Anonymous data synced successfully'
    });

  } catch (error: any) {
    console.error('Sync anonymous data error:', error);
    return res.status(500).json({ error: error.message });
  }
}
