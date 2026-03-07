with open('app/api/convert/route.ts', 'r') as f:
    content = f.read()

# Verwijder de top-level initialisatie
lines = content.split('\n')
new_lines = []
skip = False
for line in lines:
    if line.strip().startswith('// Initialize Supabase clients'):
        skip = True
    elif skip and line.strip().startswith('if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {'):
        continue
    elif skip and line.strip().startswith('  supabase = createClient(supabaseUrl, supabaseAnonKey)'):
        continue
    elif skip and line.strip().startswith('  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)'):
        continue
    elif skip and line.strip().startswith('}'):
        skip = False
        continue
    elif skip:
        continue
    else:
        new_lines.append(line)

content = '\n'.join(new_lines)

# Voeg initialisatie toe aan helper functies
import re

# Helper om Supabase clients te initialiseren
def init_supabase():
    return """  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return { allowed: false, error: 'Service not initialized' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)"""

# Vervang checkFreeScanLimit functie
check_func_pattern = r'async function checkFreeScanLimit\([^)]*\):[^{]*{[\s\S]*?}'
check_func_match = re.search(check_func_pattern, content)
if check_func_match:
    old_check_func = check_func_match.group(0)
    new_check_func = """// Helper function to check free scan limit directly via RPC
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
    content = content.replace(old_check_func, new_check_func)

# Vervang recordFreeScan functie
record_func_pattern = r'async function recordFreeScan\([^)]*\):[^{]*{[\s\S]*?}'
record_func_match = re.search(record_func_pattern, content)
if record_func_match:
    old_record_func = record_func_match.group(0)
    new_record_func = """// Helper function to record free scan directly
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
    content = content.replace(old_record_func, new_record_func)

# Vervang recordConversionAttempt functie
conv_func_pattern = r'async function recordConversionAttempt\([^)]*\):[^{]*{[\s\S]*?}'
conv_func_match = re.search(conv_func_pattern, content)
if conv_func_match:
    old_conv_func = conv_func_match.group(0)
    new_conv_func = """// Helper function to record conversion attempt for CFO-mode
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
    content = content.replace(old_conv_func, new_conv_func)

# Vervang de POST handler om Supabase clients binnen te initialiseren
post_handler_pattern = r'export async function POST\(request: NextRequest\) \{[\s\S]*?\n\}'
post_handler_match = re.search(post_handler_pattern, content)
if post_handler_match:
    old_post_handler = post_handler_match.group(0)
    # Voeg initialisatie toe aan het begin van de POST handler
    new_post_start = """export async function POST(request: NextRequest) {
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
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)"""
    
    # Vervang het begin van de POST handler
    old_post_lines = old_post_handler.split('\n')
    # Zoek de regel na de eerste {
    for i, line in enumerate(old_post_lines):
        if line.strip() == 'try {' and i > 0:
            # Vervang alles van 'export async function POST' tot na 'try {'
            lines_before_try = old_post_lines[:i]
            lines_after_try = old_post_lines[i+1:]
            
            # Bouw nieuwe POST handler
            new_post_handler = '\n'.join([new_post_start] + lines_after_try)
            content = content.replace(old_post_handler, new_post_handler)
            break

with open('app/api/convert/route.ts', 'w') as f:
    f.write(content)

print('Bestand bijgewerkt')
