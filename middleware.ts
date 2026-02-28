import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes die altijd toegankelijk moeten zijn (zelfs zonder login)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register', 
  '/admin',
  '/beheer',
  '/onboarding',
  '/privacy',
  '/voorwaarden',
  '/contact',
  '/api',
  '/_next',
  '/favicon.ico',
  '/logo',
]

// Routes die geen check nodig hebben
const STATIC_ROUTES = ['/_next', '/favicon.ico', '/logo', '/api']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ ADMIN BYPASS - Altijd toestaan
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // ✅ BEHEER BYPASS - Altijd toestaan (backup admin route)
  if (pathname.startsWith('/beheer')) {
    return NextResponse.next()
  }

  // Skip static files en API routes
  if (STATIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Skip publieke routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Check of user is ingelogd (session cookie)
  const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token')
  
  if (!sessionCookie) {
    // Niet ingelogd, redirect naar login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// ✅ CONFIGURATIE AANGEPAST - admin toegevoegd aan matcher
export const config = {
  matcher: ['/((?!api|_next|_static|favicon|admin|beheer).*)'],
}