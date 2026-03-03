import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = 'bsc_' + crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  const prefix = key.substring(0, 12)
  return { key, hash, prefix }
}

// GET - lijst api keys
export async function GET(request: Request) {
  try {
    // Check if env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { data: keys, error: dbError } = await supabase
      .from('api_keys')
      .select('id, key_prefix, name, is_active, last_used_at, requests_count, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Database error fetching API keys:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ keys: keys || [] })
  } catch (error: any) {
    console.error('API keys GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - nieuwe api key aanmaken
export async function POST(request: Request) {
  try {
    // Check if env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check plan
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, api_access')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Allow API access for business and enterprise plans
    const allowedPlans = ['enterprise', 'business']
    if (!allowedPlans.includes(profile?.plan || '') && !profile?.api_access) {
      return NextResponse.json({ 
        error: 'API toegang is alleen beschikbaar voor Business en Enterprise klanten. Upgrade je plan of neem contact op met support.' 
      }, { status: 403 })
    }

    const { name } = await request.json()
    const { key, hash, prefix } = generateApiKey()

    const { data: apiKey, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_hash: hash,
        key_prefix: prefix,
        name: name || 'API Key',
        plan: profile.plan || 'enterprise'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error creating API key:', insertError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Stuur de volledige key EENMALIG terug
    return NextResponse.json({ 
      key, 
      prefix,
      id: apiKey.id,
      name: apiKey.name,
      created_at: apiKey.created_at,
      message: '⚠️ Sla deze API key op — je ziet hem maar één keer! Bewaar hem op een veilige plaats.'
    })
  } catch (error: any) {
    console.error('API keys POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - api key verwijderen
export async function DELETE(request: Request) {
  try {
    // Check if env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 })
    }

    // Verify API key belongs to user
    const { data: existingKey, error: verifyError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (verifyError || !existingKey) {
      return NextResponse.json({ error: 'API key not found or unauthorized' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Database error deleting API key:', deleteError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API keys DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
