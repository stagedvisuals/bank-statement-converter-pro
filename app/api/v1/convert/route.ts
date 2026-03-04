import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { performConversion } from '@/lib/convert-logic'
import { triggerWebhooks } from '@/lib/webhooks'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function POST(request: Request) {
  try {
    // 1. Haal API key uit header
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is verplicht' }, { status: 401 })
    }

    // 2. Rate limiting (10 requests per minuut per API key)
    const rateLimit = checkRateLimit(apiKey, 10, 60_000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit bereikt. Probeer het later opnieuw.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000)),
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          }
        }
      )
    }

    // 3. Valideer API key
    const supabase = getSupabaseAdmin()
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id, is_active')
      .eq('key', apiKey)
      .single()

    if (keyError || !keyData || !keyData.is_active) {
      return NextResponse.json({ error: 'Ongeldige of inactieve API key' }, { status: 401 })
    }

    // 4. Lees het bestand uit de request
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const outputFormat = (formData.get('format') as string) || 'csv'

    if (!file) {
      return NextResponse.json(
        { error: 'Geen bestand meegegeven. Stuur een PDF als "file" in multipart/form-data.' },
        { status: 400 }
      )
    }

    // 5. Voer conversie uit (direct, geen HTTP self-call)
    const result = await performConversion(file, keyData.user_id, outputFormat)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 })
    }

    // 6. Trigger webhooks (asynchroon, niet blokkend)
    triggerWebhooks(keyData.user_id, 'conversion.completed', {
      transactions: result.data?.count,
      format: outputFormat,
    }).catch(() => {}) // Fire and forget

    // 7. Return response met rate limit headers
    return NextResponse.json({
      success: true,
      data: result.data,
    }, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetAt / 1000)),
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
