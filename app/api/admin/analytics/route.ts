import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Check admin role via Supabase profiles.role === 'admin'
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verify user and check admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Check if user has admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    // User is admin, proceed with analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfMonthStr = startOfMonth.toISOString()

    // 1. Totaal aantal succesvolle scans (vandaag/deze maand) - gebruik credit_logs
    const { data: scansToday } = await supabase
      .from('credit_logs')
      .select('id')
      .eq('action_type', 'scan_success')
      .gte('created_at', todayStr)

    const { data: scansMonth } = await supabase
      .from('credit_logs')
      .select('id')
      .eq('action_type', 'scan_success')
      .gte('created_at', startOfMonthStr)

    // 2. Gemiddelde AI Confidence Score (uit de metadata van credit_logs)
    const { data: logsWithMeta } = await supabase
      .from('credit_logs')
      .select('metadata')
      .eq('action_type', 'scan_success')
      .not('metadata', 'is', null)
      .limit(100)

    let avgConfidenceScore = 0
    if (logsWithMeta && logsWithMeta.length > 0) {
      const scores = logsWithMeta
        .map(log => log.metadata?.confidence_score || log.metadata?.confidence || 0)
        .filter(score => score > 0)
      
      if (scores.length > 0) {
        avgConfidenceScore = Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100
      }
    }

    // 3. Totaal uitstaande credits bij gebruikers
    const { data: profiles } = await supabase
      .from('profiles')
      .select('credits_remaining')

    let totalOutstandingCredits = 0
    if (profiles) {
      totalOutstandingCredits = profiles.reduce((sum, p) => sum + (p.credits_remaining || 0), 0)
    }

    // 4. Live Activiteiten Tabel (Logboek) - gebruik credit_logs tabel met WHERE action_type = 'scan_success'
    const { data: logsData } = await supabase
      .from('credit_logs')
      .select(`
        id,
        user_id,
        action_type,
        amount,
        metadata,
        created_at,
        profiles!inner(email)
      `)
      .eq('action_type', 'scan_success')
      .order('created_at', { ascending: false })
      .limit(50)

    let activityLogs: any[] = []
    if (logsData) {
      activityLogs = logsData.map(log => ({
        id: log.id,
        timestamp: log.created_at,
        user_email: (log.profiles as any)?.email || 'Onbekend',
        status: 'success', // action_type = 'scan_success' betekent altijd succes
        bank: log.metadata?.bank || 'Onbekend',
        confidence_score: log.metadata?.confidence_score || log.metadata?.confidence || 0,
        credits_deducted: Math.abs(log.amount) || 0
      }))
    }

    return NextResponse.json({
      kpis: {
        scans_today: scansToday?.length || 0,
        scans_month: scansMonth?.length || 0,
        avg_confidence_score: avgConfidenceScore,
        total_outstanding_credits: totalOutstandingCredits
      },
      activity_logs: activityLogs,
      query_used: `
SELECT 
  cl.id,
  cl.user_id,
  cl.action_type,
  cl.amount,
  cl.metadata,
  cl.created_at,
  p.email
FROM credit_logs cl
INNER JOIN profiles p ON cl.user_id = p.user_id
WHERE cl.action_type = 'scan_success'
ORDER BY cl.created_at DESC
LIMIT 50
      `
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 })
  }
}
