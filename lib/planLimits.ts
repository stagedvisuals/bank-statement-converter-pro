/**
 * Centralized plan limits configuration
 * Used across the application for consistent pricing and feature limits
 */

export const PLAN_LIMITS = {
  basic: {
    scans: 0, // pay per use, no monthly limit
    bulk: 0,
    users: 1,
    pricePerScan: 2.00,
    price: 0,
    label: 'Basic',
    description: 'Pay-per-use',
  },
  business: {
    scans: 50,
    bulk: 5,
    users: 1,
    price: 15,
    label: 'Business',
    description: 'Voor ZZP\'ers & MKB',
  },
  enterprise: {
    scans: 2000,
    bulk: 50,
    users: 25,
    price: 30,
    label: 'Enterprise',
    description: 'Voor accountants & grootgebruikers',
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS

/**
 * Plan prices for revenue calculations
 */
export const PLAN_PRICES: Record<string, number> = {
  'basic': 0,
  'business': 15,
  'enterprise': 30,
}

/**
 * Get plan display name
 */
export function getPlanLabel(plan: PlanType): string {
  return PLAN_LIMITS[plan].label
}

/**
 * Check if a user has exceeded their scan limit
 */
export function hasExceededScanLimit(plan: PlanType, scansUsed: number): boolean {
  if (plan === 'basic') return false // Pay per use
  const limit = PLAN_LIMITS[plan].scans
  return scansUsed >= limit
}

/**
 * Get remaining scans for a plan
 */
export function getRemainingScans(plan: PlanType, scansUsed: number): number {
  if (plan === 'basic') return Infinity
  const limit = PLAN_LIMITS[plan].scans
  return Math.max(0, limit - scansUsed)
}
