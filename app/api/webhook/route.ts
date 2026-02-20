export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const priceId = session.metadata?.priceId

        if (!userId) break

        if (priceId === 'starter') {
          // Add 5 credits
          const { data: user } = await supabase
            .from('users')
            .select('credits')
            .eq('clerk_id', userId)
            .single()

          await supabase
            .from('users')
            .update({ credits: (user?.credits || 0) + 5 })
            .eq('clerk_id', userId)
        } else {
          // Activate unlimited
          await supabase
            .from('users')
            .update({ 
              plan_type: 'unlimited',
              stripe_subscription_id: session.subscription 
            })
            .eq('clerk_id', userId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
