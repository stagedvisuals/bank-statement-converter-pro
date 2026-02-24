import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if properly configured
const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey && supabaseAnonKey.length > 20

// Mock database for demo mode
const mockUsers: any[] = []
const mockConversions: any[] = []

export const supabase = !isConfigured ? {
  // Mock client
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: mockUsers.find(u => u.clerk_id), error: null }),
        order: () => ({ data: mockConversions, error: null })
      }),
      order: () => ({ data: mockConversions, error: null })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          if (table === 'users') {
            mockUsers.push({ ...data, id: 'mock-' + Date.now(), credits: 2 })
            return { data: mockUsers[mockUsers.length - 1], error: null }
          }
          mockConversions.push({ ...data, id: 'mock-' + Date.now() })
          return { data: mockConversions[mockConversions.length - 1], error: null }
        }
      })
    }),
    update: (data: any) => ({
      eq: () => ({ error: null })
    })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: 'mock' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/mock.xlsx' } })
    })
  }
} as any : createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (only use in API routes)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(supabaseUrl, serviceRoleKey)
}

// Database types
export type User = {
  id: string
  clerk_id: string
  email: string
  stripe_customer_id?: string
  credits: number
  plan_type: 'starter' | 'pro' | 'unlimited'
  created_at: string
}

export type Conversion = {
  id: string
  user_id: string
  pdf_name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  download_url?: string
  transaction_count?: number
  created_at: string
  completed_at?: string
}

export const isDemoMode = !isConfigured
