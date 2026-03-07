with open('app/api/free-scan/route.ts', 'r') as f:
    content = f.read()

# Verwijder de top-level initialisatie (regels na imports tot aan eerste functie)
lines = content.split('\n')
new_lines = []

# Keep imports
new_lines.append(lines[0])
new_lines.append(lines[1])

# Skip tot aan de eerste functie
i = 2
while i < len(lines) and not lines[i].strip().startswith('async function'):
    i += 1

# Voeg de rest toe
while i < len(lines):
    new_lines.append(lines[i])
    i += 1

content = '\n'.join(new_lines)

# Nu moeten we de helper functies aanpassen om supabase binnen te initialiseren
import re

# Update checkFreeScanLimit
check_func = '''async function checkFreeScanLimit(ipAddress: string, cookieId: string): Promise<{ allowed: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { allowed: false, error: 'Service not initialized' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('Checking free scan limit with EXACT parameters:', { 
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })
    
    const { data, error } = await supabaseAdmin.rpc('can_perform_free_scan', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })

    if (error) {
      console.error('RPC call failed:', error)
      return { allowed: false, error: 'Database check failed' }
    }

    const allowed = data === true
    console.log('RPC check result:', { allowed })
    
    return { allowed }
  } catch (error) {
    console.error('Exception in free scan check:', error)
    return { allowed: false, error: 'Check failed with exception' }
  }
}'''

# Update recordFreeScan
record_func = '''async function recordFreeScan(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ success: boolean; scanId?: string; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'Service not initialized' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('Recording free scan with EXACT parameters:', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie',
      p_local_storage: localStorageId || null
    })
    
    const { data, error } = await supabaseAdmin.rpc('record_free_scan', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie',
      p_local_storage: localStorageId || null
    })

    if (error) {
      console.error('RPC call failed for recording:', error)
      return { success: false, error: 'Failed to record scan' }
    }

    const scanId = data
    console.log('Scan recorded with ID:', scanId)
    
    return { success: true, scanId }
  } catch (error) {
    console.error('Exception in recording scan:', error)
    return { success: false, error: 'Recording failed with exception' }
  }
}'''

# Vervang de functies
content = re.sub(r'async function checkFreeScanLimit\([^)]*\):[^{]*{[\s\S]*?^\}', check_func, content, flags=re.MULTILINE | re.DOTALL)
content = re.sub(r'async function recordFreeScan\([^)]*\):[^{]*{[\s\S]*?^\}', record_func, content, flags=re.MULTILINE | re.DOTALL)

# Update POST handler om supabase binnen te initialiseren
post_handler = '''export async function POST(request: NextRequest) {
  console.log('=== FREE-SCAN API POST (EXACT PARAMETERS) ===')
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { allowed: false, error: 'Service not initialized', message: 'Service tijdelijk niet beschikbaar' },
        { status: 503 }
      )
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    
    const body = await request.json()
    const { action, ipAddress, cookieId, localStorageId } = body
    
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    const safeIpAddress = ipAddress || 'unknown'
    const safeCookieId = cookieId || 'no-cookie'
    const safeLocalStorageId = localStorageId || null

    if (action === 'check') {
      const checkResult = await checkFreeScanLimit(safeIpAddress, safeCookieId)
      
      if (checkResult.error) {
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
}'''

# Update GET handler
get_handler = '''export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        status: 'error', 
        databaseConnected: false, 
        error: 'Not initialized',
        timestamp: new Date().toISOString() 
      }, { status: 503 })
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    
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
}'''

# Vervang de handlers
content = re.sub(r'export async function POST\(request: NextRequest\) \{[\s\S]*?^\}', post_handler, content, flags=re.MULTILINE | re.DOTALL)
content = re.sub(r'export async function GET\(request: NextRequest\) \{[\s\S]*?^\}', get_handler, content, flags=re.MULTILINE | re.DOTALL)

with open('app/api/free-scan/route.ts', 'w') as f:
    f.write(content)

print('free-scan/route.ts bijgewerkt')
