import { createClient } from '@supabase/supabase-js'

// Lazy initialized client
let _client: any = null

function getClient() {
  if (_client) return _client
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if properly configured
  const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey && supabaseAnonKey.length > 20

  if (!isConfigured) {
    // Mock database for demo mode
    const mockUsers: any[] = []
    const mockConversions: any[] = []
    
    _client = {
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: mockUsers.find(u => u.clerk_id), error: null }),
            order: () => ({ data: mockConversions, error: null })
          }),
          order: () => ({ data: mockConversions, error: null })
        }),
        insert: async () => ({ error: null }),
        update: async () => ({ error: null }),
        delete: async () => ({ error: null })
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null })
      }
    }
  } else {
    _client = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return _client
}

// Export as regular object that proxies to getClient()
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getClient()
    return client[prop]
  }
})
