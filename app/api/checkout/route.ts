import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://saas-factory-nine.vercel.app'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://saas-factory-nine.vercel.app'}/dashboard?canceled=true`,
      metadata: {
        userId,
        priceId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create checkout' }, { status: 500 })
  }
}
