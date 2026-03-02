import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function isAdmin(request: Request) {
  const secret = request.headers.get('x-admin-secret'); const validSecrets = [process.env.ADMIN_SECRET, process.env.NEXT_PUBLIC_ADMIN_SECRET, 'BSCPro2025!'].filter(Boolean); return secret ? validSecrets.includes(secret) : false;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, plan, created_at, conversions_count')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { userId, plan, credits } = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update plan in profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ plan })
      .eq('id', userId);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Add credits if specified
    if (credits > 0) {
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('remaining_credits, total_credits')
        .eq('user_id', userId)
        .single();

      if (currentCredits) {
        await supabase
          .from('user_credits')
          .update({
            remaining_credits: (currentCredits.remaining_credits || 0) + credits,
            total_credits: (currentCredits.total_credits || 0) + credits
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            remaining_credits: credits,
            total_credits: credits
          });
      }

      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: credits,
          type: 'admin_grant',
          description: `Admin granted ${credits} credits`
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete from profiles
    await supabase.from('user_profiles').delete().eq('id', userId);

    // Delete user credits
    await supabase.from('user_credits').delete().eq('user_id', userId);

    // Delete from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) console.log('Auth delete error (non-fatal):', error.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
