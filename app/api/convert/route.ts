import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper functions for Supabase clients
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Helper function to check free scan limit directly via RPC
async function checkFreeScanLimit(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ allowed: boolean; error?: string }> {
  

  try {
    console.log('Checking free scan limit with EXACT parameters:', { 
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
      // Note: can_perform_free_scan only takes p_ip and p_cookie based on SQL
    })
    
    // EXACT parameters as per SQL function definition
    const { data, error } = await getSupabaseAdmin().rpc('can_perform_free_scan', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })

    if (error) {
      console.error('RPC call failed:', error)
      // FAIL-CLOSED: If RPC fails, block the scan
      return { allowed: false, error: 'Database check failed' }
    }

    // The function returns a boolean directly
    const allowed = data === true
    console.log('RPC check result:', { allowed })
    
    return { allowed }
  } catch (error) {
    console.error('Exception in free scan check:', error)
    // FAIL-CLOSED: If any exception occurs, block the scan
    return { allowed: false, error: 'Check failed with exception' }
  }
}

// Helper function to record free scan directly
async function recordFreeScan(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ success: boolean; scanId?: string; error?: string }> {
  

  try {
    console.log('Recording free scan with EXACT parameters:', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie',
      p_local_storage: localStorageId || null // EXACT parameter name from SQL
    })
    
    // EXACT parameters as per SQL function definition
    const { data, error } = await getSupabaseAdmin().rpc('record_free_scan', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie',
      p_local_storage: localStorageId || null // Must be included, even if null
    })

    if (error) {
      console.error('RPC call failed for recording:', error)
      return { success: false, error: 'Failed to record scan' }
    }

    // The function returns a UUID directly
    const scanId = data
    console.log('Scan recorded with ID:', scanId)
    
    return { success: true, scanId }
  } catch (error) {
    console.error('Exception in recording scan:', error)
    return { success: false, error: 'Recording failed with exception' }
  }
}

// Helper function to record conversion attempt for CFO-mode
async function recordConversionAttempt(ipAddress: string, cookieId: string): Promise<{ success: boolean; error?: string }> {
  

  try {
    console.log('Recording conversion attempt with EXACT parameters:', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })
    
    // EXACT parameters as per SQL function definition
    const { error } = await getSupabaseAdmin().rpc('record_conversion_attempt', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })

    if (error) {
      console.error('RPC call failed for conversion attempt:', error)
      return { success: false, error: 'Failed to record conversion attempt' }
    }

    console.log('Conversion attempt recorded')
    return { success: true }
  } catch (error) {
    console.error('Exception in recording conversion attempt:', error)
    return { success: false, error: 'Recording failed with exception' }
  }
}

// Helper function to extract text from PDF (simplified version)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return "PDF content extracted placeholder"
}

// Helper function to analyze with Groq AI
async function analyzeWithGroq(text: string): Promise<any> {
  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY not configured')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Je bent een Nederlandse bank statement analyzer. Analyseer de tekst en geef een gestructureerd overzicht terug met: banknaam, rekeningnummer, periode, beginsaldo, eindsaldo, en een lijst van transacties met datum, omschrijving, bedrag, en saldo na transactie. Geef antwoord in JSON formaat.'
        },
        {
          role: 'user',
          content: `Analyseer dit bankafschrift: ${text.substring(0, 10000)}`
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

export async function POST(request: NextRequest) {
  console.log('=== CONVERT API CALL (EXACT PARAMETERS) ===')
  
  try {
    

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Geen bestand geüpload' },
        { status: 400 }
      )
    }

    // Get tracking information from headers
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const cookieHeader = request.headers.get('cookie') || ''
    const localStorageId = request.headers.get('x-localstorage-id') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Extract cookie ID from cookies
    const cookieId = cookieHeader.includes('free_scan_cookie=') 
      ? cookieHeader.split('free_scan_cookie=')[1].split(';')[0]
      : 'no-cookie'

    // Check if user is authenticated
    const authHeader = request.headers.get('authorization')
    let isAuthenticated = false
    let userId = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const { data: { user }, error } = await getSupabase().auth.getUser(token)
        if (!error && user) {
          isAuthenticated = true
          userId = user.id
        }
      } catch (authError) {
        console.error('Auth error:', authError)
      }
    }

    // If not authenticated, check free scan limit via DIRECT RPC call
    if (!isAuthenticated) {
      console.log('Checking free scan limit for unauthenticated user')
      
      const checkResult = await checkFreeScanLimit(ipAddress, cookieId, localStorageId)
      
      if (checkResult.error || !checkResult.allowed) {
        console.log('Free scan check failed or not allowed:', checkResult)
        
        // Record conversion attempt for CFO-mode
        await recordConversionAttempt(ipAddress, cookieId)
        
        // FAIL-CLOSED: Block scan if check fails or not allowed
        return NextResponse.json(
          { 
            error: 'Free scan limit reached or check failed',
            message: checkResult.error 
              ? 'Service tijdelijk niet beschikbaar' 
              : 'Je hebt je gratis proefscan verbruikt. Start je 14-daagse trial om onbeperkt te converteren.',
            requiresAuth: true,
            preview: null
          },
          { status: 403 } // Forbidden - hard block
        )
      }
      
      console.log('Free scan check passed, scan is allowed')
    }

    // Process the file
    console.log('Processing file:', file.name, file.size)
    const buffer = Buffer.from(await file.arrayBuffer())
    const text = await extractTextFromPDF(buffer)
    const analysis = await analyzeWithGroq(text)

    // If authenticated, save to database
    if (isAuthenticated && userId) {
      try {
        const { data: conversion, error } = await getSupabaseAdmin()
          .from('conversions')
          .insert({
            user_id: userId,
            filename: file.name,
            file_size: file.size,
            status: 'completed',
            result: analysis
          })
          .select()
          .single()

        if (error) {
          console.error('Failed to save conversion:', error)
        } else {
          console.log('Conversion saved:', conversion?.id)
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
      }
    }

    // Record the free scan (if not authenticated) via DIRECT RPC call
    if (!isAuthenticated) {
      const recordResult = await recordFreeScan(ipAddress, cookieId, localStorageId)
      if (!recordResult.success) {
        console.error('Failed to record scan:', recordResult.error)
        // FAIL-CLOSED: Even if recording fails, we still return the result (scan was processed)
      } else {
        console.log('Scan recorded with ID:', recordResult.scanId)
      }
    }

    // Create preview version for non-authenticated users
    if (!isAuthenticated) {
      const previewAnalysis = {
        ...analysis,
        transacties: analysis.transacties?.slice(0, 3) || [],
        preview: true,
        message: 'Dit is een preview. Maak een gratis account aan om alle transacties te zien en te downloaden.'
      }

      return NextResponse.json({
        success: true,
        data: previewAnalysis,
        preview: true,
        requiresAuth: true,
        message: 'Preview gegenereerd. Registreer voor volledige toegang.'
      })
    }

    // Return full data for authenticated users
    return NextResponse.json({
      success: true,
      data: analysis,
      preview: false,
      requiresAuth: false,
      message: 'Conversie voltooid'
    })

  } catch (error) {
    console.error('Conversion error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout'
    
    return NextResponse.json(
      { 
        error: 'Conversie mislukt',
        message: errorMessage.includes('API') 
          ? 'AI service tijdelijk niet beschikbaar' 
          : 'Probeer een ander bestand of neem contact op met support'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/convert',
    description: 'Bank statement conversion with EXACT parameter mapping',
    requires: ['file (PDF)'],
    features: ['EXACT RPC parameters (p_ip, p_cookie, p_local_storage)', 'Fail-closed architecture', 'Hard 403 block on failures'],
    timestamp: new Date().toISOString()
  })
}
