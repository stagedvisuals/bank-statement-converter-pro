import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return res.status(500).json({ error: 'Payment system not configured' })
    }

    const { userId } = getAuth(req)
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { priceId } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: priceId === 'starter' ? '5 Conversions Pack' : 'Unlimited Monthly',
              description: priceId === 'starter' ? 'Convert 5 bank statements' : 'Unlimited conversions',
            },
            unit_amount: priceId === 'starter' ? 500 : 2900,
            recurring: priceId === 'unlimited' ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: priceId === 'starter' ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://saas-factory-bnpyop1wv-stagedvisuals-projects.vercel.app'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://saas-factory-bnpyop1wv-stagedvisuals-projects.vercel.app'}/dashboard?canceled=true`,
      metadata: {
        userId,
        priceId,
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return res.status(500).json({ error: error.message || 'Failed to create checkout' })
  }
}
