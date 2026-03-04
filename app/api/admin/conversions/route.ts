import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: Request) {
  if (!checkAdmin(request)) return unauthorizedResponse()

  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('conversions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ conversions: [], error: error.message })
    }

    return NextResponse.json({ conversions: data || [] })
  } catch (e: any) {
    return NextResponse.json({ conversions: [], error: e.message })
  }
}
