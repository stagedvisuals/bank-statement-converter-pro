import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth check
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = user.id;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Rule ID required' });
  }

  switch (req.method) {
    case 'PUT':
      return updateRule(req, res, userId, id);
    case 'DELETE':
      return deleteRule(req, res, userId, id);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function updateRule(req: NextApiRequest, res: NextApiResponse, userId: string, ruleId: string) {
  try {
    const updates = req.body;

    const { data, error } = await supabase
      .from('categorization_rules')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ruleId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Rule not found' });

    return res.status(200).json({ rule: data });
  } catch (error: any) {
    console.error('Error updating rule:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function deleteRule(req: NextApiRequest, res: NextApiResponse, userId: string, ruleId: string) {
  try {
    const { data, error } = await supabase
      .from('categorization_rules')
      .update({ is_active: false })
      .eq('id', ruleId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Rule not found' });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting rule:', error);
    return res.status(500).json({ error: error.message });
  }
}
