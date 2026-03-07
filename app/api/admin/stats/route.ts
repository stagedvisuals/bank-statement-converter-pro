import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!checkAdmin(request)) return unauthorizedResponse()

  try {
    const supabase = getSupabaseAdmin()

    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, created_at, last_login_at')

    if (usersError) {
      return NextResponse.json({ 
        error: 'Database error: profiles table', 
        details: usersError.message 
      }, { status: 500 })
    }

    const { data: conversions } = await supabase
      .from('conversions')
      .select('id, created_at, status')


    const { data: payments } = await supabase
      .from('payments')
      .select('amount, created_at')

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const activeToday = users?.filter(u => {
      if (!u.last_login_at) return false
      return new Date(u.last_login_at) >= today
    }).length || 0

    const conversionsToday = conversions?.filter(c => {
      return new Date(c.created_at) >= today
    }).length || 0

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    const dailyStats: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dailyStats[date.toISOString().split('T')[0]] = 0
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
        activeToday 
      },
      conversions: { 
        total: conversions?.length || 0, 
        today: conversionsToday, 
        daily: dailyStats 
      },
      revenue: { 
        total: totalRevenue 
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
