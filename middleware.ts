import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes die altijd publiek toegankelijk zijn
const PUBLIC_ROUTES = [
  '/',                    // Homepage - MOET publiek zijn!
  '/login',
  '/register',
  '/onboarding',
  '/privacy',
  '/voorwaarden',
  '/contact',
  '/prijzen',
  '/beveiliging',
  '/verwerkersovereenkomst',
  '/api',
  '/_next',
  '/favicon.ico',
  '/logo',
  '/features',
  '/calculator',
  '/pricing',
  '/faq',
]

// Routes die geen check nodig hebben (static files)
const STATIC_ROUTES = ['/_next', '/favicon.ico', '/logo', '/api', '/static']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files en API routes
  if (STATIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Publieke routes: altijd toegankelijk zonder login
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Check of user is ingelogd (session cookie)
  const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token')
  
  if (!sessionCookie) {
    // Niet ingelogd, redirect naar login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Ingelogd - check onboarding status via API
  try {
    const checkResponse = await fetch(`${request.nextUrl.origin}/api/auth/check-onboarding`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    if (checkResponse.ok) {
      const { onboardingVoltooid } = await checkResponse.json()
      
      if (!onboardingVoltooid && pathname !== '/onboarding') {
        // Onboarding niet voltooid, redirect naar onboarding
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
      
      if (onboardingVoltooid && pathname === '/onboarding') {
        // Onboarding al voltooid, redirect naar dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  } catch (error) {
    console.error('Middleware onboarding check error:', error)
    // Bij error toch doorlaten
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
