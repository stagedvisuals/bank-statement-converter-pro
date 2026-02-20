export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    env: {
      hasStripe: !!process.env.STRIPE_SECRET_KEY,
      hasClerk: !!process.env.CLERK_SECRET_KEY,
      hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  })
}
