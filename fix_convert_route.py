#!/usr/bin/env python3
import re

# Read the original file
with open('app/api/convert/route.ts', 'r') as f:
    content = f.read()

# Replace lines 5-15 with the new helper functions
old_code = '''// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialize Supabase clients only if environment variables are available
let supabase: any = null
let supabaseAdmin: any = null

if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
}'''

new_code = '''// Helper functions for Supabase clients
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
}'''

# Replace the old code with new code
content = content.replace(old_code, new_code)

# Remove the check for supabaseAdmin in checkFreeScanLimit function
content = re.sub(r'if \(!supabaseAdmin\) \{\s*return \{ allowed: false, error: \'Service not initialized\' \}\s*\}', '', content)

# Remove the check for supabaseAdmin in recordFreeScan function  
content = re.sub(r'if \(!supabaseAdmin\) \{\s*return \{ success: false, error: \'Service not initialized\' \}\s*\}', '', content)

# Remove the check for supabaseAdmin in recordConversionAttempt function
content = re.sub(r'if \(!supabaseAdmin\) \{\s*return \{ success: false, error: \'Service not initialized\' \}\s*\}', '', content)

# Replace supabaseAdmin. with getSupabaseAdmin().
content = content.replace('supabaseAdmin.', 'getSupabaseAdmin().')

# Replace supabase. with getSupabase().
content = content.replace('supabase.', 'getSupabase().')

# Remove the check at the beginning of POST function
content = re.sub(r'if \(!supabase \|\| !supabaseAdmin\) \{\s*return NextResponse\.json\(\s*\{ \s*error: \'Service not initialized\',\s*message: \'Service tijdelijk niet beschikbaar\'\s*\},\s*\{ status: 503 \}\s*\)\s*\}', '', content)

# Write the modified content back
with open('app/api/convert/route.ts', 'w') as f:
    f.write(content)

print("File updated successfully!")
