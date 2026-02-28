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

  // Security check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = {
      checked: 0,
      triggered: 0,
      errors: [] as string[]
    };

    // Find users at 20% progress after 24h
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data: stuckUsers, error: fetchError } = await supabase
      .from('onboarding_status')
      .select('user_id, progress_percentage, started_at, user_profiles(email)')
      .eq('progress_percentage', 20)
      .lt('started_at', oneDayAgo.toISOString())
      .is('completed_at', null);

    if (fetchError) throw fetchError;

    results.checked = stuckUsers?.length || 0;

    for (const user of stuckUsers || []) {
      try {
        // Check if we already triggered for this user
        const { data: existing } = await supabase
          .from('onboarding_retention_flows')
          .select('id')
          .eq('user_id', user.user_id)
          .eq('current_step', '20_percent_stuck')
          .single();

        if (existing) continue;

        // Create retention flow entry
        await supabase.from('onboarding_retention_flows').insert({
          user_id: user.user_id,
          current_step: '20_percent_stuck',
          trigger_reason: 'User stuck at 20% for 24+ hours'
        });

        // Send retention email via API
        const userProfile = user.user_profiles as any;
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/agents/onboarding/send-retention-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.user_id,
            email: userProfile?.email || userProfile?.[0]?.email,
            progress: 20
          })
        });

        // Log activity
        await supabase.rpc('log_agent_activity', {
          p_agent_type: 'onboarding',
          p_log_level: 'info',
          p_message: `Triggered retention flow for user ${user.user_id}`,
          p_metadata: { progress: 20, hours_stuck: 24 }
        });

        results.triggered++;
      } catch (error: any) {
        results.errors.push(`${user.user_id}: ${error.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      agent: 'onboarding',
      results
    });

  } catch (error: any) {
    console.error('Onboarding agent error:', error);
    return res.status(500).json({ error: error.message });
  }
}
