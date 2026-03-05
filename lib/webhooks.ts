import { getSupabaseAdmin } from './supabase-admin'
import crypto from 'crypto'

export async function triggerWebhooks(
  userId: string,
  event: string,
  payload: Record<string, any>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin()
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('id, url, secret, events, is_active, failure_count')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error || !webhooks || webhooks.length === 0) return

    for (const webhook of webhooks) {
      // Check of webhook dit event type ondersteunt
      if (webhook.events && !webhook.events.includes(event)) continue
      
      // Skip webhooks met te veel failures
      if (webhook.failure_count >= 10) continue

      try {
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify({ event, payload }))
          .digest('hex')

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event,
          },
          body: JSON.stringify({
            event,
            payload,
            timestamp: new Date().toISOString()
          }),
          signal: AbortSignal.timeout(10000), // 10s timeout
        })

        if (!response.ok) {
          // Increment failure count
          await supabase
            .from('webhooks')
            .update({
              failure_count: webhook.failure_count + 1,
              last_triggered_at: new Date().toISOString(),
            })
            .eq('id', webhook.id)
        } else {
          // Reset failure count on success
          await supabase
            .from('webhooks')
            .update({
              failure_count: 0,
              last_triggered_at: new Date().toISOString(),
            })
            .eq('id', webhook.id)
        }
      } catch {
        // Network error - increment failure
        await supabase
          .from('webhooks')
          .update({
            failure_count: webhook.failure_count + 1
          })
          .eq('id', webhook.id)
      }
    }
  } catch (error) {
    console.error('[Webhooks] Error triggering webhooks:', error)
  }
}
