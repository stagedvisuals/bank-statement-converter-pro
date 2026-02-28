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
    // Fetch all quality flags
    const { data: flags, error } = await supabase
      .from('scan_quality_flags')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Get summary stats
    const { count: openCount } = await supabase
      .from('scan_quality_flags')
      .select('*', { count: 'exact' })
      .eq('status', 'open');

    const { count: reviewedCount } = await supabase
      .from('scan_quality_flags')
      .select('*', { count: 'exact' })
      .eq('status', 'reviewed');

    const { count: resolvedCount } = await supabase
      .from('scan_quality_flags')
      .select('*', { count: 'exact' })
      .eq('status', 'resolved');

    return res.status(200).json({
      success: true,
      stats: {
        total: flags?.length || 0,
        open: openCount || 0,
        reviewed: reviewedCount || 0,
        resolved: resolvedCount || 0
      },
      flags: flags || []
    });

  } catch (error: any) {
    console.error('Quality flags report error:', error);
    return res.status(500).json({ 
      error: error.message,
      flags: [],
      stats: { total: 0, open: 0, reviewed: 0, resolved: 0 }
    });
  }
}
