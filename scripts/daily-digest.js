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

async function generateDailyDigest() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  console.log(`Generating daily digest for ${today}...`)

  try {
    // Get new users today
    const { count: newUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    if (usersError) console.error('Error fetching users:', usersError)

    // Get conversions today (you'll need to create this table)
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

    // Get revenue (estimate based on conversions)
    // This is simplified - you'd want proper order tracking
    const estimatedRevenue = (conversions || 0) * 2 // €2 per conversion avg

    // Store daily analytics
    await supabase.from('daily_analytics').upsert({
      date: today,
      total_conversions: conversions || 0,
      total_revenue: estimatedRevenue,
      new_users: newUsers || 0,
      chat_conversations: chats || 0
    }, { onConflict: 'date' })

    // Generate digest message
    const digest = {
      date: today,
      summary: {
        newUsers: newUsers || 0,
        conversions: conversions || 0,
        chatConversations: chats || 0,
        estimatedRevenue: estimatedRevenue
      },
      message: `
🌑 BSC PRO DAILY DIGEST - ${today}

📊 STATISTICS:
• Nieuwe gebruikers: ${newUsers || 0}
• Conversies vandaag: ${conversions || 0}
• Chat gesprekken: ${chats || 0}
• Geschatte omzet: €${estimatedRevenue.toFixed(2)}

🚀 Status: OPERATIONAL
      `.trim()
    }

    // Send to Arthur via Telegram (using OpenClaw message tool)
    // This would need to be integrated with the actual messaging system
    console.log(digest.message)
    
    // You could also send email:
    // await fetch('https://bscpro.nl/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: 'arthur@your-email.com',
    //     type: 'daily_digest',
    //     ...digest
    //   })
    // })

    console.log('Daily digest generated successfully')
    process.exit(0)

  } catch (error) {
    console.error('Error generating digest:', error)
    process.exit(1)
  }
}

generateDailyDigest()
