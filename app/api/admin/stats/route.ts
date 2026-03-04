import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!checkAdmin(request)) {
    return unauthorizedResponse()
  }

  try {
    const supabase = getSupabaseAdmin()

    // Get user stats
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, created_at, last_login_at')

    if (usersError) {
      return NextResponse.json({ 
        error: 'Database error: profiles table', 
        details: usersError.message 
      }, { status: 500 })
    }

    // Get conversion stats
    const { data: conversions, error: convError } = await supabase
      .from('conversions')
      .select('id, created_at, status')

    if (convError) {
      return NextResponse.json({ 
        error: 'Database error: conversions table', 
        details: convError.message 
      }, { status: 500 })
    }

    // Get payments for revenue
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('amount, created_at')

    if (payError) {
      // Payments table might not exist, that's ok
      console.log('Payments table not accessible:', payError.message)
    }

    // Calculate stats
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const activeToday = users?.filter(u => {
      if (!u.last_login_at) return false
      const lastActive = new Date(u.last_login_at)
      return lastActive >= today
    }).length || 0

    const conversionsToday = conversions?.filter(c => {
      const created = new Date(c.created_at)
      return created >= today
    }).length || 0

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Calculate daily conversions for chart (last 30 days)
    const dailyStats: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyStats[dateStr] = 0
    }

    conversions?.forEach(c => {
      const date = c.created_at.split('T')[0]
      if (dailyStats[date] !== undefined) {
        dailyStats[date]++
      }
    })

    return NextResponse.json({
      users: {
        total: users?.length || 0,
        activeToday,
      },
      conversions: {
        total: conversions?.length || 0,
        today: conversionsToday,
        daily: dailyStats,
      },
      revenue: {
        total: totalRevenue,
      },
      lastUpdate: new Date().toISOString(),
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 })
  }
}
