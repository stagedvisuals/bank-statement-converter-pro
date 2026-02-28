import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, workflowType, email } = req.body;

    if (!userId || !workflowType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email content templates
    const templates: { [key: string]: { subject: string; html: string } } = {
      day1: {
        subject: '💡 Heb je je BTW al geclaimd?',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #00b8d9;">Hallo!</h2>
            <p>Welkom bij BSC PRO! 👋</p>
            <p>Je hebt gisteren de BTW calculator gebruikt. Wist je dat BSC PRO dit elke maand <strong>automatisch</strong> voor je kan doen?</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00b8d9; margin-top: 0;">Wat je krijgt:</h3>
              <ul>
                <li>✅ Automatische PDF scanning</li>
                <li>✅ BTW berekening per kwartaal</li>
                <li>✅ Exports voor je boekhouder</li>
                <li>✅ Gratis tools & calculators</li>
              </ul>
            </div>
            <p>
              <a href="https://www.bscpro.nl/dashboard" style="background: #00b8d9; color: #080d14; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Start gratis scan →
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              Je hebt nog <strong>1 gratis scan</strong> beschikbaar!
            </p>
          </div>
        `
      },
      day3: {
        subject: '⚡ Je hebt nog 1 gratis scan over!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #00b8d9;">Heb je hulp nodig?</h2>
            <p>Hi daar! 👋</p>
            <p>Je hebt nog <strong>1 gratis scan</strong> over, maar je hebt deze nog niet gebruikt. Heb je hulp nodig bij het uploaden van je eerste factuur?</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #00b8d9; margin-top: 0;">Zo werkt het:</h3>
              <ol>
                <li>1. Log in op je dashboard</li>
                <li>2. Sleep een PDF bankafschrift naar de upload zone</li>
                <li>3. De AI leest automatisch alle transacties</li>
                <li>4. Download je BTW-overzicht</li>
              </ol>
            </div>
            <p>
              <a href="https://www.bscpro.nl/dashboard" style="background: #00b8d9; color: #080d14; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Probeer het nu →
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              Lukt het niet? Reageer op deze mail, we helpen je graag!
            </p>
          </div>
        `
      },
      day7: {
        subject: '🎁 Claim je 25% korting - Onboarding bijna af!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #00b8d9;">Je bent er bijna!</h2>
            <p>Hi! 👋</p>
            <p>Je hebt de onboarding bijna afgerond. Voltooi de laatste stap en claim je <strong>25% korting</strong> op je eerste maand!</p>
            <div style="background: linear-gradient(135deg, #00b8d9, #0066cc); padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
              <h3 style="margin-top: 0;">🎁 Jouw beloning:</h3>
              <ul style="margin-bottom: 0;">
                <li>✅ +2 extra credits</li>
                <li>✅ 25% korting op Professional</li>
                <li>✅ Prioriteit support</li>
                <li>✅ Alle exports (Excel, MT940, CAMT)</li>
              </ul>
            </div>
            <p>
              <a href="https://www.bscpro.nl/dashboard" style="background: #080d14; color: #00b8d9; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: 2px solid #00b8d9;">
                Voltooi onboarding →
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              Code: <strong>ONBOARD25</strong> (geldig tot einde deze maand)
            </p>
          </div>
        `
      }
    };

    const template = templates[workflowType];
    if (!template) {
      return res.status(400).json({ error: 'Invalid workflow type' });
    }

    // Update workflow status
    await supabase
      .from('email_workflows')
      .upsert({
        user_id: userId,
        workflow_type: workflowType,
        status: 'sent',
        sent_at: new Date().toISOString()
      }, { onConflict: 'user_id,workflow_type' });

    // Send email using simple fetch to email service
    // In production, use SendGrid, Mailgun, or AWS SES
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: email }]
        }],
        from: { email: 'noreply@bscpro.nl', name: 'BSC PRO' },
        subject: template.subject,
        content: [{
          type: 'text/html',
          value: template.html
        }]
      })
    });

    if (!emailResponse.ok) {
      // Log error but don't fail
      console.error('Email send failed:', await emailResponse.text());
    }

    return res.status(200).json({ 
      success: true, 
      message: `Email workflow ${workflowType} triggered` 
    });

  } catch (error: any) {
    console.error('Email workflow error:', error);
    return res.status(500).json({ error: error.message });
  }
}
