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
    const { sessionId, calculation } = req.body;

    if (!sessionId || !calculation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to database
    const { error } = await supabase
      .from('anonymous_tool_data')
      .insert({
        session_id: sessionId,
        tool_type: calculation.toolType,
        input_data: calculation.inputData,
        result_data: calculation.resultData
      });

    if (error) throw error;

    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('Save calculation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
