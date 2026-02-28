import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const sig = req.headers['stripe-signature'] as string
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        
        if (userId) {
          // Update user metadata in Clerk to Pro role
          await clerkClient.users.updateUser(userId, {
            publicMetadata: {
              role: 'pro',
              plan: session.metadata?.priceId || 'starter',
              stripeCustomerId: session.customer,
            },
          })
          console.log(`✅ User ${userId} upgraded to Pro`)
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        // Handle subscription renewal
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription
        // Could add logic here for subscription renewals
        break
      }
      
      case 'customer.subscription.deleted': {
        // Handle cancellation
        const subscription = event.data.object as Stripe.Subscription
        // Could add logic here for downgrading user
        break
      }
    }

    return res.status(200).json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return res.status(400).json({ error: error.message })
  }
}
