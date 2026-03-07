with open('app/api/convert/route.ts', 'r') as f:
    content = f.read()

# Verwijder regels 3-20 (de hele top-level initialisatie)
lines = content.split('\n')
new_lines = lines[:2]  # Keep imports

# Skip de initialisatie regels
i = 2
while i < len(lines):
    line = lines[i]
    if line.strip() == '// Initialize Supabase clients' or \
       line.strip() == 'const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL' or \
       line.strip() == 'const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY' or \
       line.strip() == 'const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY' or \
       line.strip() == '// Initialize Supabase clients only if environment variables are available' or \
       line.strip() == 'let supabase: any = null' or \
       line.strip() == 'let supabaseAdmin: any = null' or \
       line.strip() == 'if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {' or \
       line.strip() == '  supabase = createClient(supabaseUrl, supabaseAnonKey)' or \
       line.strip() == '  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)' or \
       line.strip() == '}':
        i += 1
        continue
    new_lines.append(line)
    i += 1

content = '\n'.join(new_lines)

# Nu moeten we de helper functies aanpassen
# We gaan ze eenvoudig herschrijven
import re

# Vind en vervang checkFreeScanLimit
check_pattern = r'async function checkFreeScanLimit\([^)]*\):[^{]*{[\s\S]*?^\}'
check_match = re.search(check_pattern, content, re.MULTILINE | re.DOTALL)
if check_match:
    new_check = '''async function checkFreeScanLimit(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ allowed: boolean; error?: string }> {
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
    content = content.replace(check_match.group(0), new_check)

# Vind en vervang recordFreeScan
record_pattern = r'async function recordFreeScan\([^)]*\):[^{]*{[\s\S]*?^\}'
record_match = re.search(record_pattern, content, re.MULTILINE | re.DOTALL)
if record_match:
    new_record = '''async function recordFreeScan(ipAddress: string, cookieId: string, localStorageId: string): Promise<{ success: boolean; scanId?: string; error?: string }> {
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
    content = content.replace(record_match.group(0), new_record)

# Vind en vervang recordConversionAttempt
conv_pattern = r'async function recordConversionAttempt\([^)]*\):[^{]*{[\s\S]*?^\}'
conv_match = re.search(conv_pattern, content, re.MULTILINE | re.DOTALL)
if conv_match:
    new_conv = '''async function recordConversionAttempt(ipAddress: string, cookieId: string): Promise<{ success: boolean; error?: string }> {
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
}'''
    content = content.replace(conv_match.group(0), new_conv)

# Nu de POST handler aanpassen
# Zoek de POST handler
post_start = content.find('export async function POST(request: NextRequest)')
if post_start != -1:
    # Vind het einde van de POST handler
    brace_count = 0
    i = post_start
    while i < len(content):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                post_end = i + 1
                break
        i += 1
    
    post_handler = content[post_start:post_end]
    
    # Vervang de if (!supabase || !supabaseAdmin) check
    new_post_handler = post_handler.replace(
        '    if (!supabase || !supabaseAdmin) {',
        '''    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
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
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)'''
    )
    
    content = content[:post_start] + new_post_handler + content[post_end:]

with open('app/api/convert/route.ts', 'w') as f:
    f.write(content)

print('Bestand bijgewerkt')
