import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { naam, email, onderwerp, bericht, privacy } = body

    // Validatie
    if (!naam || !email || !onderwerp || !bericht || !privacy) {
      return NextResponse.json({ error: 'Alle velden zijn verplicht' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ongeldig emailadres' }, { status: 400 })
    }

    // Sla op in Supabase zodat berichten niet verloren gaan
    try {
      const supabase = getSupabaseAdmin()
      await supabase.from('contact_messages').insert({
        naam,
        email,
        onderwerp,
        bericht,
        created_at: new Date().toISOString(),
      })
    } catch (dbError) {
      // Als de tabel niet bestaat, log het maar stuur wel success
      console.error('[Contact] Database opslaan mislukt:', dbError)
    }

    // TODO: Implementeer Resend email service
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'BSCPro <noreply@bscpro.nl>',
    //   to: 'info@bscpro.nl',
    //   subject: `Contact: ${onderwerp} van ${naam}`,
    //   text: `Naam: ${naam}\nEmail: ${email}\nOnderwerp: ${onderwerp}\n\n${bericht}`,
    // })

    return NextResponse.json({ 
      success: true, 
      message: 'Bericht ontvangen' 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Er is iets misgegaan' 
    }, { status: 500 })
  }
}
