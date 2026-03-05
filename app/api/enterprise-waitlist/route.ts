import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is verplicht' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ongeldig emailadres' }, { status: 400 })
    }

    // Sla op in database zodat het niet verloren gaat
    try {
      const supabase = getSupabaseAdmin()
      await supabase.from('enterprise_waitlist').insert({
        email,
        created_at: new Date().toISOString(),
      })
    } catch (dbError) {
      // Als tabel niet bestaat, log het
      console.error('[Enterprise Waitlist] Database error:', dbError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Er is iets misgegaan' }, { status: 500 })
  }
}
