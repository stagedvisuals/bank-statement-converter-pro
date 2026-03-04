/**
 * Simpele in-memory rate limiter.
 * Voor productie: vervang door Upstash Redis.
 */
const requests = new Map<string, { count: number; resetAt: number }>()

// Ruim oude entries op elke 5 minuten
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of requests) {
      if (val.resetAt < now) requests.delete(key)
    }
  }, 5 * 60 * 1000)
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = requests.get(identifier)

  if (!existing || existing.resetAt < now) {
    requests.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return { allowed: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt }
}
