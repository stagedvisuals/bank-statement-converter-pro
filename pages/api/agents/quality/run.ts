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
      flagged: 0,
      errors: [] as string[]
    };

    // Get recent scans without quality check
    // In a real implementation, you'd scan recent uploads from a scans table
    // For now, we'll check the last 24 hours of transactions with low confidence

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // This is a placeholder query - adjust based on your actual transactions table
    const { data: recentScans, error: fetchError } = await supabase
      .from('credit_transactions')
      .select('user_id, created_at')
      .eq('type', 'usage')
      .gte('created_at', oneDayAgo.toISOString())
      .limit(100);

    if (fetchError) throw fetchError;

    // For each scan, check quality (mock implementation)
    for (const scan of recentScans || []) {
      try {
        // Simulate AI confidence check
        // In reality, you'd fetch the actual scan results and analyze them
        const mockConfidence = Math.random(); // 0-1
        const threshold = 0.75;

        if (mockConfidence < threshold) {
          // Flag this scan
          await supabase.from('scan_quality_flags').insert({
            user_id: scan.user_id,
            scan_id: `scan_${scan.user_id}_${Date.now()}`,
            confidence_score: mockConfidence,
            threshold: threshold,
            flagged_fields: {
              amount: mockConfidence < 0.5,
              date: mockConfidence < 0.6,
              description: mockConfidence < 0.7
            },
            ai_suggestion: 'Low confidence detected. Please review transaction amounts and dates.'
          });

          results.flagged++;
        }

        results.checked++;
      } catch (error: any) {
        results.errors.push(`${scan.user_id}: ${error.message}`);
      }
    }

    // Log agent activity
    await supabase.rpc('log_agent_activity', {
      p_agent_type: 'quality',
      p_log_level: 'info',
      p_message: `Quality check completed`,
      p_metadata: { checked: results.checked, flagged: results.flagged }
    });

    return res.status(200).json({
      success: true,
      agent: 'quality',
      results
    });

  } catch (error: any) {
    console.error('Quality agent error:', error);
    return res.status(500).json({ error: error.message });
  }
}
