import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// CORS headers helper
const setCorsHeaders = (res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.bscpro.nl')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  setCorsHeaders(res)
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' })
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Voer een geldig e-mailadres in' })
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Bericht moet minimaal 10 tekens bevatten' })
  }

  try {
    // Store contact message in database if Supabase is configured
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        message,
        status: 'new',
        created_at: new Date().toISOString()
      })

      if (error) {
        console.error('Supabase error:', error)
      }
    }

    // Send notification email via Resend if configured
    const ADMIN_EMAIL = 'arthybagdas@gmail.com'
    
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'BSC Pro <info@bscpro.nl>',
            to: ADMIN_EMAIL,
            subject: `Nieuw contact formulier bericht van ${name}`,
            html: `
              <h2>Nieuw bericht via contactformulier</h2>
              <p><strong>Naam:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <p><strong>Bericht:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `
          })
        })

        if (!response.ok) {
          console.error('Resend error:', await response.text())
        }
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

    return res.status(200).json({ success: true, message: 'Bericht succesvol verzonden' })

  } catch (error: any) {
    console.error('Contact form error:', error)
    return res.status(500).json({ 
      error: 'Er is een technische fout opgetreden. Probeer het later opnieuw of stuur een e-mail naar info@bscpro.nl'
    })
  }
}
