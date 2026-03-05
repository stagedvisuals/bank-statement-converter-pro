import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabaseAdmin: any = null

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
}

// Helper function to check free scan limit via RPC
async function checkFreeScanLimit(ipAddress: string, cookieId: string): Promise<{ allowed: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return { allowed: false, error: 'Service not initialized' }
  }

  try {
    console.log('Checking free scan limit with EXACT parameters:', { 
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })
    
    // EXACT parameters as per SQL function definition
    const { data, error } = await supabaseAdmin.rpc('can_perform_free_scan', {
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

// Helper function to record free scan via RPC
async function recordFreeScan(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ success: boolean; scanId?: string; error?: string }> {
  if (!supabaseAdmin) {
    return { success: false, error: 'Service not initialized' }
  }

  try {
    console.log('Recording free scan with EXACT parameters:', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie',
      p_local_storage: localStorageId || null // EXACT parameter name from SQL
    })
    
    // EXACT parameters as per SQL function definition
    const { data, error } = await supabaseAdmin.rpc('record_free_scan', {
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

export async function POST(request: NextRequest) {
  console.log('=== FREE-SCAN API POST (EXACT PARAMETERS) ===')
  
  if (!supabaseAdmin) {
    return NextResponse.json(
      { allowed: false, error: 'Service not initialized', message: 'Service tijdelijk niet beschikbaar' },
      { status: 503 }
    )
  }
  
  try {
    const body = await request.json()
    const { action, ipAddress, cookieId, localStorageId } = body
    
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    // Validate parameters
    const safeIpAddress = ipAddress || 'unknown'
    const safeCookieId = cookieId || 'no-cookie'
    const safeLocalStorageId = localStorageId || null // Can be null

    if (action === 'check') {
      const checkResult = await checkFreeScanLimit(safeIpAddress, safeCookieId)
      
      if (checkResult.error) {
        // FAIL-CLOSED: Return 503 if check fails
        return NextResponse.json(
          { 
            allowed: false,
            error: checkResult.error,
            message: 'Service tijdelijk niet beschikbaar'
          },
          { status: 503 }
        )
      }
      
      return NextResponse.json({
        allowed: checkResult.allowed,
        message: checkResult.allowed 
          ? 'Scan toegestaan' 
          : 'Je hebt je gratis proefscan verbruikt. Start je 14-daagse trial om onbeperkt te converteren.'
      })
    }

    if (action === 'record') {
      const recordResult = await recordFreeScan(safeIpAddress, safeCookieId, safeLocalStorageId)
      
      if (!recordResult.success) {
        return NextResponse.json(
          { 
            error: recordResult.error || 'Failed to record scan'
          },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        scanId: recordResult.scanId,
        message: 'Scan geregistreerd' 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Service tijdelijk niet beschikbaar'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        status: 'error', 
        databaseConnected: false, 
        error: 'Not initialized',
        timestamp: new Date().toISOString() 
      }, { status: 503 })
    }
    
    const { error } = await supabaseAdmin.from('free_scans').select('count').limit(1)
    
    return NextResponse.json({
      status: 'ok',
      databaseConnected: !error,
      tableExists: !error,
      error: error?.message,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      databaseConnected: false, 
      error: error instanceof Error ? error.message : 'Unknown',
      timestamp: new Date().toISOString() 
    }, { status: 500 })
  }
}
