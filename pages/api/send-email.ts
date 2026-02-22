import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

interface EmailTemplate {
  subject: string
  html: string
}

// Email Templates
function getConversionCompleteEmail(userName: string, fileName: string, transactionCount: number): EmailTemplate {
  return {
    subject: '✅ Je document is succesvol geconverteerd - BSC Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0F172A; padding: 30px; text-align: center;">
          <h1 style="color: #10B981; margin: 0;">BSC Pro</h1>
          <p style="color: #94A3B8; margin: 10px 0 0 0;">AI Financial Document Processor</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #0F172A;">Hallo ${userName},</h2>
          
          <p style="color: #64748B; font-size: 16px; line-height: 1.6;">
            Je document <strong>${fileName}</strong> is succesvol geconverteerd!
          </p>
          
          <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0;">
            <p style="color: #0F172A; margin: 0; font-size: 18px;">
              📊 <strong>${transactionCount} transacties</strong> succesvol geëxtraheerd
            </p>
          </div>
          
          <p style="color: #64748B; font-size: 16px; line-height: 1.6;">
            Je kunt het resultaat nu downloaden in je dashboard. De AI heeft alle transacties gecategoriseerd en geanalyseerd op fraude.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://bscpro.nl/dashboard" 
               style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Ga naar Dashboard
            </a>
          </div>
          
          <p style="color: #94A3B8; font-size: 14px;">
            Je document wordt automatisch verwijderd binnen 24 uur voor jouw veiligheid.
          </p>
        </div>
        
        <div style="background: #F1F5F9; padding: 20px; text-align: center;">
          <p style="color: #64748B; font-size: 14px; margin: 0;">
            © 2026 BSC Pro | <a href="https://bscpro.nl/privacy" style="color: #10B981;">Privacy Policy</a>
          </p>
        </div>
      </div>
    `
  }
}

function getWelcomeEmail(userName: string): EmailTemplate {
  return {
    subject: 'Welkom bij BSC Pro - Start met je eerste conversie',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0F172A; padding: 30px; text-align: center;">
          <h1 style="color: #10B981; margin: 0;">BSC Pro</h1>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #0F172A;">Welkom ${userName}!</h2>
          
          <p style="color: #64748B; font-size: 16px; line-height: 1.6;">
            Bedankt voor je registratie bij BSC Pro. Je krijgt <strong>2 gratis conversies</strong> om onze AI te testen.
          </p>
          
          <h3 style="color: #0F172A; margin-top: 30px;">Wat kun je verwachten?</h3>
          <ul style="color: #64748B; font-size: 16px; line-height: 1.8;">
            <li>✅ AI Smart Categorisatie automatisch</li>
            <li>✅ Fraude detectie op verdachte transacties</li>
            <li>✅ Directe business insights</li>
            <li>✅ 24/7 data veiligheid</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://bscpro.nl/dashboard" 
               style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Start Nu
            </a>
          </div>
        </div>
      </div>
    `
  }
}

// Main API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!resend) {
    return res.status(500).json({ error: 'Resend not configured' })
  }

  const { to, type, userName, fileName, transactionCount } = req.body

  if (!to || !type) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    let emailTemplate: EmailTemplate

    switch (type) {
      case 'conversion_complete':
        emailTemplate = getConversionCompleteEmail(userName, fileName, transactionCount)
        break
      case 'welcome':
        emailTemplate = getWelcomeEmail(userName)
        break
      default:
        return res.status(400).json({ error: 'Unknown email type' })
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'BSC Pro <noreply@bscpro.nl>',
      to: [to],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    // Log to database
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await supabase.from('email_notifications').insert({
        email: to,
        type: type,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
    }

    return res.status(200).json({ success: true, id: data?.id })

  } catch (error) {
    console.error('Email service error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
