import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ALLEEN deze velden mogen door de gebruiker worden aangepast
const ALLOWED_FIELDS = ['bedrijfsnaam', 'display_name', 'phone']

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const rawUpdates = await request.json()
    
    // Whitelist: alleen toegestane velden doorlaten
    const updates: Record<string, any> = {}
    for (const field of ALLOWED_FIELDS) {
      if (rawUpdates[field] !== undefined) {
        updates[field] = rawUpdates[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: 'Geen geldige velden om bij te werken' 
      }, { status: 400 })
    }

    updates.updated_at = new Date().toISOString()

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
