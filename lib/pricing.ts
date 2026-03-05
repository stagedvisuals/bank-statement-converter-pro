export const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 12,
  pro: 29,
  business: 69,
  enterprise: 199,
}

export const PLAN_LIMITS: Record<string, { scans: number; bulkUpload: number; users: number }> = {
  free: { scans: 2, bulkUpload: 0, users: 1 },
  starter: { scans: 15, bulkUpload: 0, users: 1 },
  pro: { scans: 100, bulkUpload: 5, users: 1 },
  business: { scans: 500, bulkUpload: 25, users: 3 },
  enterprise: { scans: 2000, bulkUpload: 50, users: 25 },
}

export function getPlanPrice(plan: string): number {
  return PLAN_PRICES[plan?.toLowerCase()] || 0
}
