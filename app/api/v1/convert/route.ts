import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { triggerWebhooks } from '@/lib/webhooks'

export const dynamic = 'force-dynamic'

async function validateApiKey(apiKey: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return null
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex')
    
    const { data, error } = await supabase
      .from('api_keys')
      .select(`
        *,
        profiles:user_id (
          plan,
          user_id
        )
      `)
      .eq('key_hash', hash)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('API key validation error:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    // Check if env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get API key from headers
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key vereist. Gebruik header: x-api-key: bsc_... of Authorization: Bearer bsc_...' 
      }, { status: 401 })
    }

    // Validate API key
    const keyData = await validateApiKey(apiKey)
    if (!keyData) {
      return NextResponse.json({ error: 'Ongeldige of inactieve API key' }, { status: 401 })
    }

    const userId = keyData.user_id

    // Update usage stats
    await supabase.from('api_keys')
      .update({ 
        last_used_at: new Date().toISOString(),
        requests_count: (keyData.requests_count || 0) + 1 
      })
      .eq('id', keyData.id)

    // Check credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('remaining_credits')
      .eq('user_id', userId)
      .single()

    if (creditsError) {
      console.error('Credits check error:', creditsError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!credits || credits.remaining_credits <= 0) {
      return NextResponse.json({ 
        error: 'Geen credits beschikbaar. Koop credits of upgrade je abonnement.',
        errorType: 'no_credits'
      }, { status: 402 })
    }

    // Parse multipart form data voor PDF
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ 
        error: 'Geen bestand gevonden. Stuur PDF als multipart form-data met veld "file"' 
      }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ 
        error: 'Alleen PDF bestanden zijn toegestaan' 
      }, { status: 400 })
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Bestand is te groot (max 10MB)' 
      }, { status: 400 })
    }

    // Convert File to Buffer for internal API
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    
    // Create FormData for internal API
    const internalFormData = new FormData()
    const blob = new Blob([fileBuffer], { type: 'application/pdf' })
    internalFormData.append('file', blob, file.name)

    // Add authorization header for internal API (if user is authenticated)
    const authHeader = request.headers.get('authorization')
    const headers: Record<string, string> = {}
    if (authHeader) {
      headers['authorization'] = authHeader
    }

    // Forward naar interne convert API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const convertResponse = await fetch(`${baseUrl}/api/convert`, {
      method: 'POST',
      headers,
      body: internalFormData
    })

    if (!convertResponse.ok) {
      const err = await convertResponse.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Internal convert API error:', err)
      return NextResponse.json({ 
        error: err.error || 'Conversie mislukt',
        errorType: err.errorType || 'internal_error'
      }, { status: convertResponse.status })
    }

    const result = await convertResponse.json()

    // Deduct credit
    const newRemaining = credits.remaining_credits - 1
    await supabase
      .from('user_credits')
      .update({ remaining_credits: newRemaining })
      .eq('user_id', userId)

    // Log conversion
    await supabase.from('conversions').insert({
      user_id: userId,
      file_path: file.name,
      bank: result.data?.bank || result.bank,
      format: 'pdf',
      transaction_count: result.data?.transacties?.length || result.transacties?.length || 0,
      status: 'completed',
      via_api: true
    })

    // Trigger webhooks
    await triggerWebhooks(userId, 'conversion.completed', {
      transactions_count: result.data?.transacties?.length || result.transacties?.length || 0,
      bank: result.data?.bank || result.bank,
      timestamp: new Date().toISOString(),
      via_api: true
    })

    // Return result with credits info
    return NextResponse.json({
      success: true,
      data: result.data || result,
      credits_remaining: newRemaining,
      credits_used: 1,
      via_api: true
    })

  } catch (error: any) {
    console.error('Public API error:', error)
    
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable. Please try again later.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// GET - API documentation
export async function GET() {
  return NextResponse.json({
    name: 'BSCPro API',
    version: 'v1',
    endpoints: {
      convert: {
        method: 'POST',
        url: '/api/v1/convert',
        description: 'Convert PDF bank statement to structured JSON',
        headers: {
          'x-api-key': 'bsc_... (your API key)',
          'Content-Type': 'multipart/form-data'
        },
        body: {
          file: 'PDF file (max 10MB)'
        },
        response: {
          success: 'boolean',
          data: 'converted transactions',
          credits_remaining: 'number',
          credits_used: 'number'
        }
      }
    },
    limits: {
      file_size: '10MB',
      rate_limit: '10 requests per minute per API key',
      formats: 'PDF only'
    },
    support: 'api@bscpro.nl'
  })
}
