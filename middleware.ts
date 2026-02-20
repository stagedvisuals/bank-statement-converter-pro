import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/convert(.*)',
])

const isProRoute = createRouteMatcher([
  '/api/convert(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  // Check Pro role for conversion routes
  if (isProRoute(req)) {
    const { sessionClaims } = auth()
    const role = sessionClaims?.metadata?.role
    
    if (role !== 'pro' && role !== 'admin') {
      return new Response('Pro subscription required', { status: 403 })
    }
  }
})

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}
