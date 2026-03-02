import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function isAdmin(request: Request) {
  const secret = request.headers.get('x-admin-secret');
  const validSecrets = [process.env.ADMIN_SECRET, process.env.NEXT_PUBLIC_ADMIN_SECRET, 'BSCPro2025!'].filter(Boolean);
  return secret ? validSecrets.includes(secret) : false;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user profiles with auth user data via RPC
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, user_id, bedrijfsnaam, beroep, onboarding_voltooid, aangemaakt_op, bijgewerkt_op')
      .order('aangemaakt_op', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get auth users to enrich with email
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth users fetch error:', authError);
    }

    // Create email lookup map
    const emailMap = new Map();
    if (authUsers?.users) {
      authUsers.users.forEach((user: any) => {
        emailMap.set(user.id, user.email);
      });
    }

    // Enrich profiles with email
    const enrichedProfiles = (profiles || []).map((profile: any) => ({
      id: profile.id,
      user_id: profile.user_id,
      email: emailMap.get(profile.user_id) || 'unknown@example.com',
      bedrijfsnaam: profile.bedrijfsnaam,
      beroep: profile.beroep,
      onboarding_voltooid: profile.onboarding_voltooid,
      created_at: profile.aangemaakt_op,
      updated_at: profile.bijgewerkt_op
    }));

    return NextResponse.json(enrichedProfiles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { userId, bedrijfsnaam, beroep, plan, conversions_count, credits } = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update profile fields that exist
    const updates: any = {};
    if (bedrijfsnaam !== undefined) updates.bedrijfsnaam = bedrijfsnaam;
    if (beroep !== undefined) updates.beroep = beroep;
    if (plan !== undefined) updates.plan = plan;
    if (conversions_count !== undefined) updates.conversions_count = conversions_count;

    if (Object.keys(updates).length > 0) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }

    // Add credits if specified
    if (credits > 0) {
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('remaining_credits, total_credits')
        .eq('id', userId)
        .single();

      if (currentCredits) {
        await supabase
          .from('user_credits')
          .update({
            remaining_credits: (currentCredits.remaining_credits || 0) + credits,
            total_credits: (currentCredits.total_credits || 0) + credits
          })
          .eq('id', userId);
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

    // Delete from user_profiles (by user_id)
    await supabase.from('user_profiles').delete().eq('id', userId);

    // Delete user credits
    await supabase.from('user_credits').delete().eq('id', userId);

    // Delete from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) console.log('Auth delete error (non-fatal):', error.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
