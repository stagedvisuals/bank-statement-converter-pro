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
    const { userId, email, progress } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email template for stuck users
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #00b8d9;">Heb je hulp nodig?</h2>
        <p>Hi daar! 👋</p>
        <p>We zien dat je bent begonnen met BSC PRO maar je onboarding nog niet hebt afgerond.</p>
        <p><strong>Je voortgang: ${progress}%</strong></p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #00b8d9; margin-top: 0;">Wat je nog moet doen:</h3>
          <ul>
            <li>✅ Upload je eerste factuur</li>
            <li>✅ Download je eerste export</li>
            <li>✅ Ontvang +2 gratis credits bij 100%</li>
          </ul>
        </div>
        
        <p>
          <a href="https://www.bscpro.nl/dashboard" style="background: #00b8d9; color: #080d14; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Ga verder waar je gebleven was →
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px;">
          Loop je vast? Reageer op deze mail, we helpen je graag!
        </p>
      </div>
    `;

    // Send via SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }]
        }],
        from: { email: 'noreply@bscpro.nl', name: 'BSC PRO' },
        subject: '💡 Je bent er bijna! Nog een paar stappen...',
        content: [{
          type: 'text/html',
          value: emailHtml
        }]
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    // Update retention flow
    await supabase
      .from('onboarding_retention_flows')
      .update({ email_sent: true })
      .eq('user_id', userId)
      .eq('current_step', '20_percent_stuck');

    return res.status(200).json({
      success: true,
      message: 'Retention email sent'
    });

  } catch (error: any) {
    console.error('Send retention email error:', error);
    return res.status(500).json({ error: error.message });
  }
}
