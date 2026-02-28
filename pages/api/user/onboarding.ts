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

    const { step } = req.body;
    
    if (!step) {
      return res.status(400).json({ error: 'Step is required' });
    }

    // Map step names to database columns
    const stepMapping: { [key: string]: string } = {
      'profile': 'step_profile_completed',
      'first_upload': 'step_first_upload_completed',
      'first_export': 'step_first_export_completed',
      'tools_used': 'step_tools_used_completed',
      'settings': 'step_settings_completed'
    };

    const dbColumn = stepMapping[step];
    if (!dbColumn) {
      return res.status(400).json({ error: 'Invalid step' });
    }

    // Update onboarding status
    const { data, error } = await supabase
      .from('onboarding_status')
      .update({ [dbColumn]: true })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      onboarding: data
    });

  } catch (error: any) {
    console.error('Update onboarding error:', error);
    return res.status(500).json({ error: error.message });
  }
}
