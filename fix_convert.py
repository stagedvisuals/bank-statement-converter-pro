with open('app/api/convert/route.ts', 'r') as f:
    content = f.read()

# Verwijder top-level initialisatie
import re

# Verwijder regels 3-20 (Supabase initialisatie)
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
    elif '// Initialize Supabase clients' in lines[i]:
        # Skip tot na de if block
        while i < len(lines) and not lines[i].strip().startswith('}'):
            i += 1
        i += 1  # Skip de }
        continue
    else:
        new_lines.append(lines[i])
        i += 1

content = '\n'.join(new_lines)

# Voeg initialisatie toe aan helper functies
# 1. checkFreeScanLimit
check_func = """// Helper function to check free scan limit directly via RPC
async function checkFreeScanLimit(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ allowed: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return { allowed: false, error: 'Service not initialized' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('Checking free scan limit with EXACT parameters:', { 
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
      // Note: can_perform_free_scan only takes p_ip and p_cookie based on SQL
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
record_func = """// Helper function to record free scan directly
async function recordFreeScan(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ success: boolean; scanId?: string; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
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

# 3. recordConversionAttempt
conv_func = """// Helper function to record conversion attempt for CFO-mode
async function recordConversionAttempt(ipAddress: string, cookieId: string): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return { success: false, error: 'Service not initialized' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('Recording conversion attempt with EXACT parameters:', {
      p_ip: ipAddress || 'unknown',
      p_cookie: cookieId || 'no-cookie'
    })
    
    // EXACT parameters as per SQL function definition
    const { error } = await supabaseAdmin.rpc('record_conversion_attempt', {
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
}"""

# Vervang de oude functies
# Zoek de oude checkFreeScanLimit functie
old_check_pattern = r'async function checkFreeScanLimit\([^)]*\):[^{]*{[\s\S]*?^\}'
old_check_match = re.search(old_check_pattern, content, re.MULTILINE | re.DOTALL)
if old_check_match:
    content = content.replace(old_check_match.group(0), check_func)

# Zoek de oude recordFreeScan functie  
old_record_pattern = r'async function recordFreeScan\([^)]*\):[^{]*{[\s\S]*?^\}'
old_record_match = re.search(old_record_pattern, content, re.MULTILINE | re.DOTALL)
if old_record_match:
    content = content.replace(old_record_match.group(0), record_func)

# Zoek de oude recordConversionAttempt functie
old_conv_pattern = r'async function recordConversionAttempt\([^)]*\):[^{]*{[\s\S]*?^\}'
old_conv_match = re.search(old_conv_pattern, content, re.MULTILINE | re.DOTALL)
if old_conv_match:
    content = content.replace(old_conv_match.group(0), conv_func)

# Voeg initialisatie toe aan POST handler
post_pattern = r'export async function POST\(request: NextRequest\) \{[\s\S]*?^\}'
post_match = re.search(post_pattern, content, re.MULTILINE | re.DOTALL)
if post_match:
    old_post = post_match.group(0)
    # Vervang het begin van de POST handler
    new_post = old_post.replace('export async function POST(request: NextRequest) {\n  console.log(\'=== CONVERT API CALL (EXACT PARAMETERS) ===\')\n  \n  try {\n    if (!supabase || !supabaseAdmin) {', '''export async function POST(request: NextRequest) {
  console.log('=== CONVERT API CALL (EXACT PARAMETERS) ===')
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: 'Service not initialized',
          message: 'Service tijdelijk niet beschikbaar'
        },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)''')
    
    content = content.replace(old_post, new_post)

with open('app/api/convert/route.ts', 'w') as f:
    f.write(content)

print('convert/route.ts bijgewerkt')
