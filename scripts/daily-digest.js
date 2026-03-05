#!/usr/bin/env node
/**
 * Daily Digest Script for BSC Pro
 * Run this script daily at 20:00 CET to send Arthur a summary
 * 
 * Usage: node scripts/daily-digest.js
 * Or via cron: 0 20 * * * cd /path/to/project && node scripts/daily-digest.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_EMAIL = 'arthybagdas@gmail.com'

async function generateDailyDigest() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const today = new Date().toISOString().split('T')[0]

  console.log(`Generating daily digest for ${today}...`)

  try {
    // Get new users today
    const { count: newUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    if (usersError) console.error('Error fetching users:', usersError)

    // Get conversions today
    const { count: conversions, error: convError } = await supabase
      .from('conversions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    if (convError) console.error('Error fetching conversions:', convError)

    // Get chat conversations
    const { count: chats, error: chatError } = await supabase
      .from('chat_conversations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    if (chatError) console.error('Error fetching chats:', chatError)

    // Get contact messages
    const { count: contacts, error: contactError } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    if (contactError) console.error('Error fetching contacts:', contactError)

    // Calculate revenue
    const estimatedRevenue = (conversions || 0) * 2

    // Store daily analytics
    await supabase.from('daily_analytics').upsert({
      date: today,
      total_conversions: conversions || 0,
      total_revenue: estimatedRevenue,
      new_users: newUsers || 0,
      chat_conversations: chats || 0
    }, { onConflict: 'date' })

    // Generate digest message
    const digestMessage = `
🌑 BSC PRO DAILY DIGEST - ${today}

📊 STATISTICS:
• Nieuwe gebruikers: ${newUsers || 0}
• Conversies vandaag: ${conversions || 0}
• Chat gesprekken: ${chats || 0}
• Contact formulieren: ${contacts || 0}
• Geschatte omzet: €${estimatedRevenue.toFixed(2)}

🚀 Status: OPERATIONAL
    `.trim()

    console.log(digestMessage)

    // Send email notification
    try {
      const response = await fetch('https://www.bscpro.nl/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          type: 'daily_digest',
          date: today,
          newUsers: newUsers || 0,
          conversions: conversions || 0,
          chats: chats || 0,
          contacts: contacts || 0,
          revenue: estimatedRevenue
        })
      })

      if (!response.ok) {
        console.error('Failed to send daily digest email')
      } else {
        console.log(`Daily digest sent to ${ADMIN_EMAIL}`)
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
    }

    console.log('Daily digest completed successfully')
    process.exit(0)

  } catch (error) {
    console.error('Error generating digest:', error)
    process.exit(1)
  }
}

generateDailyDigest()
