import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()
    
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'to, subject en body zijn verplicht' }, { status: 400 })
    }

    // TODO: Implementeer Resend email service
    // Stap 1: npm install resend
    // Stap 2: Stel RESEND_API_KEY in bij Vercel env vars
    // Stap 3: Uncomment onderstaande code
    //
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // const { data, error } = await resend.emails.send({
    //   from: 'BSCPro <noreply@bscpro.nl>',
    //   to: [to],
    //   subject: subject,
    //   text: body,
    // })
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 })
    // }

    console.log('[Email] Email zou verstuurd worden naar:', to, '| Onderwerp:', subject)
    
    return NextResponse.json({
      success: true,
      message: 'Email service nog niet geconfigureerd (Resend). Email is gelogd.',
      note: 'Configureer RESEND_API_KEY om echte emails te versturen.'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Email versturen mislukt' }, { status: 500 })
  }
}
