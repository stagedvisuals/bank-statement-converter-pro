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

  // Simple cron secret check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all quality flags
    const { data: flags, error } = await supabase
      .from('scan_quality_flags')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Get summary stats
    const { data: stats } = await supabase
      .from('scan_quality_flags')
      .select('status', { count: 'exact' })
      .eq('status', 'open');

    return res.status(200).json({
      success: true,
      totalFlags: flags?.length || 0,
      openFlags: stats?.length || 0,
      flags: flags
    });

  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
