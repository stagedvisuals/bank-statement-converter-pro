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

  switch (req.method) {
    case 'GET':
      return getRules(req, res, userId);
    case 'POST':
      return createRule(req, res, userId);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getRules(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { data: rules, error } = await supabase
      .from('categorization_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ rules: rules || [] });
  } catch (error: any) {
    console.error('Error fetching rules:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function createRule(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { keyword, grootboek_code, btw_percentage, category_name, match_type, priority } = req.body;

    if (!keyword || !grootboek_code || !btw_percentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('categorization_rules')
      .insert({
        user_id: userId,
        keyword: keyword.trim(),
        grootboek_code: grootboek_code.trim(),
        btw_percentage: btw_percentage.toString(),
        category_name: category_name?.trim() || null,
        match_type: match_type || 'contains',
        priority: priority || 100,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ rule: data });
  } catch (error: any) {
    console.error('Error creating rule:', error);
    return res.status(500).json({ error: error.message });
  }
}
