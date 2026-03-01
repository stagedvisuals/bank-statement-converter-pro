import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes die ALTIJD toegankelijk zijn (zonder login check)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/admin',
  '/beheer',
  '/over-ons',
  '/tools',
  '/privacy',
  '/voorwaarden',
  '/gdpr',
  '/api-docs',
  '/moneybird',
  '/snelstart',
  '/exact-online',
  '/abn-amro',
  '/ing',
  '/rabobank',
  '/contact',
  '/onboarding',
  '/terms',
  '/api/stats',
  '/_next',
  '/favicon.ico',
  '/logo',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Check of het een publieke route is - ALTJD toestaan zonder check
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 2. Alleen voor non-public routes: check sessie
  const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token')
  
  if (!sessionCookie) {
    // Niet ingelogd, redirect naar login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Matcher: alleen API routes en static assets uitsluiten
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}