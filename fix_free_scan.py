with open('app/api/free-scan/route.ts', 'r') as f:
    content = f.read()

import re

# Verwijder top-level initialisatie (regels 3-8)
lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    if i == 0 and 'import { NextRequest, NextResponse }' in lines[i]:
        new_lines.append(lines[i])
        i += 1
    elif i == 1 and 'import { createClient }' in lines[i]:
        new_lines.append(lines[i])
        i += 1
    elif 'const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL' in lines[i] and i == 2:
        # Skip de top-level initialisatie
        while i < len(lines) and not lines[i].strip().startswith('if (supabaseUrl && supabaseServiceKey) {'):
            i += 1
        # Skip de if block
        while i < len(lines) and not lines[i].strip().startswith('}'):
            i += 1
        i += 1  # Skip de }
        continue
    else:
        new_lines.append(lines[i])
        i += 1

content = '\n'.join(new_lines)

# Update helper functies
# 1. checkFreeScanLimit
check_func = """// Helper function to check free scan limit via RPC
async function checkFreeScanLimit(ipAddress: string, cookieId: string): Promise<{ allowed: boolean; error?: string }> {
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
}"""

# 2. recordFreeScan
record_func = """// Helper function to record free scan via RPC
async function recordFreeScan(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ success: boolean; scanId?: string; error?: string }> {
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
}"""

# Vervang de oude functies
old_check_pattern = r'async function checkFreeScanLimit\([^)]*\):[^{]*{[\s\S]*?^\}'
old_check_match = re.search(old_check_pattern, content, re.MULTILINE | re.DOTALL)
if old_check_match:
    content = content.replace(old_check_match.group(0), check_func)

old_record_pattern = r'async function recordFreeScan\([^)]*\):[^{]*{[\s\S]*?^\}'
old_record_match = re.search(old_record_pattern, content, re.MULTILINE | re.DOTALL)
if old_record_match:
    content = content.replace(old_record_match.group(0), record_func)

# Update POST handler
post_pattern = r'export async function POST\(request: NextRequest\) \{[\s\S]*?^\}'
post_match = re.search(post_pattern, content, re.MULTILINE | re.DOTALL)
if post_match:
    old_post = post_match.group(0)
    # Verwijder de supabaseAdmin check aan het begin
    new_post = old_post.replace('''export async function POST(request: NextRequest) {
  console.log('=== FREE-SCAN API POST (EXACT PARAMETERS) ===')
  
  if (!supabaseAdmin) {
    return NextResponse.json(
      { allowed: false, error: 'Service not initialized', message: 'Service tijdelijk niet beschikbaar' },
      { status: 503 }
    )
  }
  
  try {''', '''export async function POST(request: NextRequest) {
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
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)''')
    
    content = content.replace(old_post, new_post)

# Update GET handler
get_pattern = r'export async function GET\(request: NextRequest\) \{[\s\S]*?^\}'
get_match = re.search(get_pattern, content, re.MULTILINE | re.DOTALL)
if get_match:
    old_get = get_match.group(0)
    new_get = old_get.replace('''export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        status: 'error', 
        databaseConnected: false, 
        error: 'Not initialized',
        timestamp: new Date().toISOString() 
      }, { status: 503 })
    }
    
    const { error } = await supabaseAdmin.from('free_scans').select('count').limit(1)''', '''export async function GET(request: NextRequest) {
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
    
    const { error } = await supabaseAdmin.from('free_scans').select('count').limit(1)''')
    
    content = content.replace(old_get, new_get)

with open('app/api/free-scan/route.ts', 'w') as f:
    f.write(content)

print('free-scan/route.ts bijgewerkt')
