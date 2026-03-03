import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export interface WebhookPayload {
  event: string
  payload: any
  timestamp: string
}

export async function triggerWebhooks(userId: string, event: string, payload: any): Promise<void> {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured, skipping webhooks')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get active webhooks for this user and event
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .contains('events', [event])

    if (error) {
      console.error('Error fetching webhooks:', error)
      return
    }

    if (!webhooks?.length) {
      return
    }

    const webhookPayload: WebhookPayload = {
      event,
      payload,
      timestamp: new Date().toISOString()
    }

    const body = JSON.stringify(webhookPayload)

    // Trigger each webhook
    for (const webhook of webhooks) {
      try {
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(body)
          .digest('hex')

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-bscpro-signature': `sha256=${signature}`,
            'x-bscpro-event': event,
            'x-bscpro-delivery': crypto.randomUUID()
          },
          body,
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })

        if (response.ok) {
          // Update last triggered time and reset failure count
          await supabase
            .from('webhooks')
            .update({
              last_triggered_at: new Date().toISOString(),
              failure_count: 0
            })
            .eq('id', webhook.id)
          
          console.log(`Webhook triggered successfully: ${webhook.url}`)
        } else {
          console.error(`Webhook failed with status ${response.status}: ${webhook.url}`)
          await incrementFailureCount(supabase, webhook.id)
        }
      } catch (err) {
        console.error(`Webhook error for ${webhook.url}:`, err)
        await incrementFailureCount(supabase, webhook.id)
      }
    }
  } catch (err) {
    console.error('Webhook trigger error:', err)
  }
}

async function incrementFailureCount(supabase: any, webhookId: string): Promise<void> {
  try {
    // Get current failure count
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('failure_count')
      .eq('id', webhookId)
      .single()

    const newFailureCount = (webhook?.failure_count || 0) + 1
    
    // Disable webhook after 5 consecutive failures
    const is_active = newFailureCount < 5

    await supabase
      .from('webhooks')
      .update({
        failure_count: newFailureCount,
        is_active,
        last_failure_at: new Date().toISOString()
      })
      .eq('id', webhookId)

    if (!is_active) {
      console.warn(`Webhook ${webhookId} disabled after 5 consecutive failures`)
    }
  } catch (err) {
    console.error('Error updating failure count:', err)
  }
}

// Helper function to verify webhook signatures
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature.replace('sha256=', '')),
      Buffer.from(expectedSignature)
    )
  } catch (err) {
    console.error('Error verifying signature:', err)
    return false
  }
}
