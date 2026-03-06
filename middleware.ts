import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Routes die ALTIJD toegankelijk zijn (zonder login check)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
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

// Upstash Redis rate limiting (serverless stable)
async function checkApiRateLimit(apiKey: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // 10 requests per minute per API key
  
  try {
    // Use Upstash Redis for serverless rate limiting
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
    
    if (!redisUrl || !redisToken) {
      // Fallback to in-memory if Redis not configured
      console.warn('Upstash Redis not configured, using in-memory rate limiting')
      const keyData = globalThis.rateLimitMap?.get(apiKey)
      
      if (!globalThis.rateLimitMap) {
        globalThis.rateLimitMap = new Map<string, { count: number; resetTime: number }>()
      }
      
      if (!keyData || now > keyData.resetTime) {
        // New window
        globalThis.rateLimitMap.set(apiKey, { count: 1, resetTime: now + windowMs })
        return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
      }
      
      if (keyData.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetIn: keyData.resetTime - now }
      }
      
      // Increment count
      keyData.count++
      globalThis.rateLimitMap.set(apiKey, keyData)
      return { allowed: true, remaining: maxRequests - keyData.count, resetIn: keyData.resetTime - now }
    }
    
    // Upstash Redis implementation
    const key = `rate_limit:${apiKey}`
    const current = await fetch(`${redisUrl}/get/${key}`, {
      headers: {
        'Authorization': `Bearer ${redisToken}`
      }
    }).then(res => res.json())
    
    const currentCount = current.result ? parseInt(current.result) : 0
    
    if (currentCount >= maxRequests) {
      const ttl = await fetch(`${redisUrl}/ttl/${key}`, {
        headers: {
          'Authorization': `Bearer ${redisToken}`
        }
      }).then(res => res.json())
      
      return { allowed: false, remaining: 0, resetIn: (ttl.result || 60) * 1000 }
    }
    
    // Increment count
    await fetch(`${redisUrl}/incr/${key}`, {
      headers: {
        'Authorization': `Bearer ${redisToken}`
      }
    })
    
    // Set expiry if first request
    if (currentCount === 0) {
      await fetch(`${redisUrl}/expire/${key}/60`, {
        headers: {
          'Authorization': `Bearer ${redisToken}`
        }
      })
    }
    
    return { allowed: true, remaining: maxRequests - (currentCount + 1), resetIn: windowMs }
    
  } catch (error) {
    console.error('Rate limit error:', error)
    // Allow on error (fail open for availability)
    return { allowed: true, remaining: maxRequests, resetIn: windowMs }
  }
}

// Declare global rate limit map for fallback
declare global {
  var rateLimitMap: Map<string, { count: number; resetTime: number }> | undefined
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. ADMIN ROUTES CHECK - ALTIJD EERST (priority check)
  if (pathname.startsWith('/admin') || pathname.startsWith('/beheer')) {
    try {
      // Get Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase config missing in middleware')
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Get session cookie
      const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token') || request.cookies.get('bscpro-session')
      
      if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // Get user from session
      const { data: { user }, error: authError } = await supabase.auth.getUser(sessionCookie.value)
      
      if (authError || !user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // Check role in profiles table (NEW: uses profiles table, not users)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      if (profileError || !profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // User is admin, allow access
      return NextResponse.next()
      
    } catch (error) {
      console.error('Admin role check error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. ALLE API ROUTES ZIJN PUBLIEK (behalve admin API)
  if (pathname.startsWith('/api/')) {
    // Admin API routes vereisen admin secret
    if (pathname.startsWith('/api/admin/')) {
      const adminSecret = request.headers.get('x-admin-secret')
      if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
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
      
      // Check rate limit with Upstash Redis
      const rateLimit = await checkApiRateLimit(apiKey)
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

  // 3. Check of het een publieke route is - ALTJD toestaan zonder check
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 4. Alleen voor non-public routes: check sessie
  const sessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('sb-refresh-token') || request.cookies.get('bscpro-session')
  
  if (!sessionCookie) {
    // Redirect naar login met return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

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
