import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Auth check - admin only
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get agent statistics
    const { data: recentJobs } = await supabase
      .from('agent_jobs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const { data: qualityFlags } = await supabase
      .from('scan_quality_flags')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: retentionFlows } = await supabase
      .from('onboarding_retention_flows')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: latestReport } = await supabase
      .from('market_agent_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: agentLogs } = await supabase
      .from('agent_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          totalJobs24h: recentJobs?.length || 0,
          openQualityFlags: qualityFlags?.length || 0,
          activeRetentionFlows: retentionFlows?.length || 0,
          latestMarketReport: latestReport ? {
            week: latestReport.week_number,
            year: latestReport.year,
            insights: latestReport.insights,
            recommendations: latestReport.recommendations
          } : null
        },
        qualityFlags: qualityFlags,
        retentionFlows: retentionFlows,
        recentLogs: agentLogs
      }
    });

  } catch (error: any) {
    console.error('Agent dashboard error:', error);
    return res.status(500).json({ error: error.message });
  }
}
