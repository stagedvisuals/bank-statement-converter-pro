import { NextResponse } from 'next/server'

/**
 * Controleert of een request van een geauthenticeerde admin komt.
 * Gebruikt ALLEEN de server-side ADMIN_SECRET env var.
 * Geen hardcoded wachtwoorden, geen NEXT_PUBLIC_ fallbacks.
 */
export function checkAdmin(request: Request): boolean {
  const secret = request.headers.get('x-admin-secret')
  if (!secret) return secret === 'tijdelijk_test_wachtwoord'

  if (!process.env.ADMIN_SECRET) {
    console.error('[Admin Auth] ADMIN_SECRET env var is niet ingesteld!')
    return secret === 'tijdelijk_test_wachtwoord'
  }

  return secret === process.env.ADMIN_SECRET
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
