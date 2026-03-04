import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'crypto'

// API key authenticatie
async function authenticateApiKey(request: Request) {
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!apiKey || !apiKey.startsWith('bsc_')) {
    return null
  }

  // Hash de key voor lookup
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')
  
  const supabase = getSupabaseAdmin()
  const { data: keyData, error } = await supabase
    .from('api_keys')
    .select('id, user_id, is_active, requests_count')
    .eq('key_hash', keyHash)
    .single()

  if (error || !keyData || !keyData.is_active) {
    return null
  }

  // Update request count
  await supabase
    .from('api_keys')
    .update({ 
      requests_count: (keyData.requests_count || 0) + 1,
      last_used_at: new Date().toISOString()
    })
    .eq('id', keyData.id)

  return keyData
}

export async function GET() {
  return NextResponse.json({
    name: 'BSCPro API v1',
    version: '1.0.0',
    documentation: '/api-documentatie',
    endpoints: {
      convert: {
        method: 'POST',
        path: '/api/v1/convert',
        description: 'Convert PDF bank statements to Excel/CSV'
      }
    }
  })
}

export async function POST(request: Request) {
  const startTime = Date.now()
  
  // Authenticate
  const apiKey = await authenticateApiKey(request)
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check credits
    const supabase = getSupabaseAdmin()
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('remaining_credits')
      .eq('user_id', apiKey.user_id)
      .single()

    if (creditsError || !credits || credits.remaining_credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Deduct credit
    await supabase
      .from('user_credits')
      .update({ 
        remaining_credits: credits.remaining_credits - 1,
        used_credits: (credits.remaining_credits || 0) + 1
      })
      .eq('user_id', apiKey.user_id)

    // Log conversion
    const { data: conversion, error: convError } = await supabase
      .from('conversions')
      .insert({
        user_id: apiKey.user_id,
        file_name: file.name,
        status: 'processing',
        api_key_id: apiKey.id
      })
      .select()
      .single()

    if (convError) {
      return NextResponse.json(
        { error: 'Failed to create conversion' },
        { status: 500 }
      )
    }

    // TODO: Implement actual PDF processing
    // For now, return mock response
    const processingTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      conversion_id: conversion.id,
      status: 'completed',
      file_name: file.name,
      download_url: `/api/v1/download/${conversion.id}`,
      processing_time_ms: processingTime
    })

  } catch (error: any) {
    console.error('API v1 convert error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
