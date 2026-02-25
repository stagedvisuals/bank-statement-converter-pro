import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Email service configuratie (bijv. SendGrid, AWS SES, etc.)
const EMAIL_API_KEY = process.env.SENDGRID_API_KEY || process.env.EMAIL_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { to, subject, fileName, conversionCount } = await req.json()
    
    // Haal user profiel op voor personalisatie
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    let bedrijfsnaam = ''
    if (session) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('bedrijfsnaam')
        .eq('user_id', session.user.id)
        .single()
      bedrijfsnaam = profile?.bedrijfsnaam || ''
    }
    
    // Personaliseer onderwerp
    const personalizedSubject = bedrijfsnaam 
      ? `[${bedrijfsnaam}] - Uw conversie is klaar`
      : subject || 'Uw BSC Pro conversie is klaar'
    
    // Personaliseer groet
    const greeting = bedrijfsnaam 
      ? `Beste ${bedrijfsnaam},`
      : 'Beste,'
    
    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uw conversie is klaar</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #0a1628;
      padding: 32px;
      text-align: center;
    }
    .logo {
      color: #00d4ff;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 18px;
      color: #1f2937;
      margin-bottom: 16px;
    }
    .message {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .details {
      background-color: #f9fafb;
      border-left: 4px solid #00d4ff;
      padding: 20px;
      margin-bottom: 24px;
    }
    .details-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }
    .details-text {
      font-size: 14px;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      background-color: #00d4ff;
      color: #0a1628;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 24px 32px;
      text-align: center;
    }
    .footer-text {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">BSC Pro</h1>
    </div>
    
    <div class="content">
      <p class="greeting">${greeting}</p>
      
      <p class="message">
        Goed nieuws! Je bankafschrift is succesvol geconverteerd naar Excel. 
        Het bestand is nu klaar om te downloaden vanuit je dashboard.
      </p>
      
      <div class="details">
        <p class="details-title">Conversie details</p>
        <p class="details-text">
          Bestand: ${fileName || 'Bankafschrift'}<br>
          Transacties: ${conversionCount || 'Meerdere'}<br>
          Status: ✅ Succesvol
        </p>
      </div>
      
      <a href="https://www.bscpro.nl/dashboard" class="button">
        Naar dashboard
      </a>
      
      <p class="message">
        Heb je vragen of feedback? We horen graag van je via 
        <a href="mailto:support@bscpro.nl" style="color: #00d4ff;">support@bscpro.nl</a>.
      </p>
    </div>
    
    <div class="footer">
      <p class="footer-text">
        © 2026 BSC Pro. Alle rechten voorbehouden.<br>
        <a href="https://www.bscpro.nl/privacy" style="color: #9ca3af;">Privacy</a> | 
        <a href="https://www.bscpro.nl/voorwaarden" style="color: #9ca3af;">Voorwaarden</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
    
    // Hier zou je de email versturen via je email service (SendGrid, AWS SES, etc.)
    // Voor nu loggen we het alleen
    console.log('[Email] Sending email:', {
      to,
      subject: personalizedSubject,
      bedrijfsnaam,
      fileName
    })
    
    // TODO: Implementeer hier je email verzend logica
    // Voorbeeld met SendGrid:
    // await sgMail.send({
    //   to,
    //   from: 'noreply@bscpro.nl',
    //   subject: personalizedSubject,
    //   html: htmlContent,
    // })
    
    return NextResponse.json({ 
      success: true,
      subject: personalizedSubject
    })
    
  } catch (error: any) {
    console.error('[Email] Error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
