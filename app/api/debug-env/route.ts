import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING'
  
  // Toon alleen eerste 20 en laatste 5 chars (veilig)
  const keyPreview = key.length > 25 ? key.substring(0, 20) + '...' + key.slice(-5) : key
  
  // Test connectie
  let dbTest = 'niet getest'
  if (url !== 'MISSING' && key !== 'MISSING') {
    try {
      const supabase = createClient(url, key)
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
      dbTest = error ? 'FOUT: ' + error.message : 'OK - verbinding werkt'
    } catch (e: any) {
      dbTest = 'EXCEPTION: ' + e.message
    }
  }

  return NextResponse.json({
    url_preview: url.substring(0, 30) + '...',
    key_starts_with: key.substring(0, 10),
    key_is_jwt: key.startsWith('eyJ'),
    key_preview: keyPreview,
    db_test: dbTest,
    timestamp: new Date().toISOString()
  })
}
