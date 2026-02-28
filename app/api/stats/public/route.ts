import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error, count } = await supabase
      .from('conversions')
      .select('id', { count: 'exact' })
      .gte('created_at', today.toISOString());

    if (error) {
      return NextResponse.json({ 
        count: 23 + Math.floor(Math.random() * 30),
        isReal: false
      });
    }

    return NextResponse.json({ 
      count: count || 0,
      isReal: true
    });
  } catch {
    return NextResponse.json({ 
      count: 23 + Math.floor(Math.random() * 30),
      isReal: false
    });
  }
}