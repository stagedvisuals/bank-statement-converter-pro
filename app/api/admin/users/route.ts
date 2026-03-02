import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function isAdmin(request: Request) {
  const secret = request.headers.get('x-admin-secret');
  const validSecrets = [process.env.ADMIN_SECRET, process.env.NEXT_PUBLIC_ADMIN_SECRET, 'BSCPro2025!'].filter(Boolean);
  return secret ? validSecrets.includes(secret) : false;
}

// Helper to get user_id from profile id
async function getUserIdFromProfile(supabase: any, profileId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('id', profileId)
    .single();
  
  if (error || !data) return null;
  return data.user_id;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, user_id, bedrijfsnaam, beroep, onboarding_voltooid, aangemaakt_op, bijgewerkt_op')
      .order('aangemaakt_op', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth users fetch error:', authError);
    }

    const emailMap = new Map();
    if (authUsers?.users) {
      authUsers.users.forEach((user: any) => {
        emailMap.set(user.id, user.email);
      });
    }

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

    // Get the auth user_id from profile
    const authUserId = await getUserIdFromProfile(supabase, userId);
    if (!authUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update profile fields
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

    // Add credits if specified (uses auth user_id for user_credits table)
    if (credits > 0) {
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('remaining_credits, total_credits')
        .eq('user_id', authUserId)
        .single();

      if (currentCredits) {
        await supabase
          .from('user_credits')
          .update({
            remaining_credits: (currentCredits.remaining_credits || 0) + credits,
            total_credits: (currentCredits.total_credits || 0) + credits
          })
          .eq('user_id', authUserId);
      } else {
        await supabase
          .from('user_credits')
          .insert({
            user_id: authUserId,
            remaining_credits: credits,
            total_credits: credits
          });
      }

      await supabase
        .from('credit_transactions')
        .insert({
          user_id: authUserId,
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

    // Get auth user_id first
    const authUserId = await getUserIdFromProfile(supabase, userId);

    // Delete from user_profiles
    await supabase.from('user_profiles').delete().eq('id', userId);

    // Delete user credits (by user_id if we have it)
    if (authUserId) {
      await supabase.from('user_credits').delete().eq('user_id', authUserId);
    }

    // Delete from Supabase Auth
    if (authUserId) {
      const { error } = await supabase.auth.admin.deleteUser(authUserId);
      if (error) console.log('Auth delete error (non-fatal):', error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
