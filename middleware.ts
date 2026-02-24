import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/privacy',
  '/terms',
  '/gdpr',
  '/contact',
  '/api-docs',
  '/api/webhook',
  '/api/health',
  '/api/monitor',
  '/api/contact',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/session',
  '/api/convert',
  '/api/convert/',
]

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method
  
  console.log('[Middleware]', method, pathname)
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
  
  // CORS headers for bscpro.nl
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    console.log('[Middleware] Allowing route:', pathname)
    return response
  }
  
  console.log('[Middleware] Protected route:', pathname)
  return response
}

export const config = {
  matcher: ['/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
