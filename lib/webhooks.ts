import { getSupabaseAdmin } from './supabase-admin'

export interface WebhookEvent {
  id: string
  event: string
  payload: any
  url: string
  signature: string
  status: 'pending' | 'success' | 'failed'
  attempts: number
  lastAttemptAt?: string
  createdAt: string
}

export async function triggerWebhook(
  userId: string,
  event: string,
  payload: any
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin()
    
    // Haal webhooks op voor deze gebruiker en event
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

    if (!webhooks || webhooks.length === 0) {
      return // Geen webhooks geconfigureerd
    }

    // Voor elke webhook, voeg toe aan queue
    for (const webhook of webhooks) {
      const webhookEvent: Omit<WebhookEvent, 'id'> = {
        event,
        payload,
        url: webhook.url,
        signature: '', // Wordt berekend bij verzending
        status: 'pending',
        attempts: 0,
        createdAt: new Date().toISOString()
      }

      const { error: insertError } = await supabase
        .from('webhook_events')
        .insert(webhookEvent)

      if (insertError) {
        console.error('Error queueing webhook event:', insertError)
      }
    }
  } catch (error) {
    console.error('Error in triggerWebhook:', error)
  }
}

// Alias voor backward compatibility
export const triggerWebhooks = triggerWebhook

export async function processPendingWebhooks(): Promise<void> {
  // Deze functie wordt aangeroepen door een cron job
  // Verstuurt pending webhooks met retry logic
  console.log('Webhook processing not implemented yet')
}
