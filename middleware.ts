import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes die ALTIJD toegankelijk zijn (zonder login check)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
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
  '/cookies',
  '/accountants',
  '/api/stats',
  '/_next',
  '/favicon.ico',
  '/logo',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap',
  '/api/v1', // API v1 routes zijn publiek (met API key)
  '/api-documentatie', // API documentatie is publiek
]

// API rate limiting
const apiRateLimit = new Map<string, { count: number; resetTime: number }>()

function checkApiRateLimit(apiKey: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // 10 requests per minute per API key
  
  const keyData = apiRateLimit.get(apiKey)
  
  if (!keyData || now > keyData.resetTime) {
    // New window
    apiRateLimit.set(apiKey, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }
  
  if (keyData.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: keyData.resetTime - now }
  }
  
  // Increment count
  keyData.count++
  apiRateLimit.set(apiKey, keyData)
  return { allowed: true, remaining: maxRequests - keyData.count, resetIn: keyData.resetTime - now }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. ALLE API ROUTES ZIJN PUBLIEK (behalve admin API)
  if (pathname.startsWith('/api/')) {
    // Admin API routes vereisen admin secret
    if (pathname.startsWith('/api/admin/')) {
      const adminSecret = request.headers.get('x-admin-secret')
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      return NextResponse.next()
    }
    
    // API v1 routes hebben rate limiting
    if (pathname.startsWith('/api/v1/')) {
      // Get API key
      const apiKey = request.headers.get('x-api-key') || 
                     request.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key required' },
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      // Check rate limit
      const rateLimit = checkApiRateLimit(apiKey)
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(rateLimit.resetIn / 1000)
          },
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': '10',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': Math.ceil(rateLimit.resetIn / 1000).toString(),
              'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString()
            }
          }
        )
      }
      
      // Add rate limit headers to response
      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Limit', '10')
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetIn / 1000).toString())
      
      return response
    }
    
    // Alle andere API routes zijn publiek
    return NextResponse.next()
  }

  // 2. Check of het een publieke route is - ALTJD toestaan zonder check
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 3. Alleen voor non-public routes: check sessie
  const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token') || request.cookies.get('bscpro-session')
  
  if (!sessionCookie) {
    // Redirect naar login met return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Admin auth wordt afgehandeld in de pagina zelf via x-admin-secret header

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
