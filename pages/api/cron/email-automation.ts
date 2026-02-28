import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security check - only allow cron job
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = {
      day1: 0,
      day3: 0,
      day7: 0,
      errors: [] as string[]
    };

    // Get users for day 1 email (registered yesterday, no scans yet)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data: day1Users, error: day1Error } = await supabase
      .from('user_profiles')
      .select('user_id, email')
      .gte('created_at', yesterday.toISOString().split('T')[0])
      .lt('created_at', new Date().toISOString().split('T')[0]);

    if (day1Error) throw day1Error;

    // Send day 1 emails
    for (const user of day1Users || []) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/email-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.user_id,
            email: user.email,
            workflowType: 'day1'
          })
        });

        if (response.ok) {
          results.day1++;
        }
      } catch (error: any) {
        results.errors.push(`Day1 ${user.email}: ${error.message}`);
      }
    }

    // Get users for day 3 email (registered 3 days ago, no scans yet)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: day3Users, error: day3Error } = await supabase
      .from('user_profiles')
      .select('user_id, email')
      .gte('created_at', threeDaysAgo.toISOString().split('T')[0])
      .lt('created_at', new Date(yesterday).toISOString().split('T')[0])
      .not('user_id', 'in', (
        supabase
          .from('credit_transactions')
          .select('user_id')
          .eq('type', 'usage')
      ));

    if (day3Error) throw day3Error;

    // Send day 3 emails
    for (const user of day3Users || []) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/email-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.user_id,
            email: user.email,
            workflowType: 'day3'
          })
        });

        if (response.ok) {
          results.day3++;
        }
      } catch (error: any) {
        results.errors.push(`Day3 ${user.email}: ${error.message}`);
      }
    }

    // Get users for day 7 email (incomplete onboarding)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: day7Users, error: day7Error } = await supabase
      .from('onboarding_status')
      .select('user_id, user_profiles!inner(email)')
      .gte('started_at', sevenDaysAgo.toISOString())
      .lt('started_at', new Date(threeDaysAgo.getTime() + 86400000).toISOString())
      .lt('progress_percentage', 100);

    if (day7Error) throw day7Error;

    // Send day 7 emails
    for (const user of day7Users || []) {
      try {
        const userProfile = user.user_profiles as any;
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/email-workflow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.user_id,
            email: userProfile?.email || userProfile?.[0]?.email,
            workflowType: 'day7'
          })
        });

        if (response.ok) {
          results.day7++;
        }
      } catch (error: any) {
        results.errors.push(`Day7 ${user.user_id}: ${error.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      results
    });

  } catch (error: any) {
    console.error('Email automation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
