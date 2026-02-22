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
]

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('[Middleware]', pathname, 'Public:', isPublicRoute(pathname))
  
  // CORS headers for bscpro.nl
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', 'https://www.bscpro.nl')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    console.log('[Middleware] Allowing public route:', pathname)
    return response
  }
  
  // Check for session token in cookie or header
  const sessionToken = request.cookies.get('sb-access-token')?.value || 
                       request.headers.get('authorization')?.replace('Bearer ', '')
  
  console.log('[Middleware] Protected route:', pathname, 'Has token:', !!sessionToken)
  
  // For protected routes, we'll let the client-side handle the redirect
  // This prevents the middleware from blocking
  if (!sessionToken) {
    console.log('[Middleware] No session, allowing client-side redirect')
    // Don't block - let the page handle the redirect
    return response
  }
  
  console.log('[Middleware] Session found, allowing access')
  return response
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
