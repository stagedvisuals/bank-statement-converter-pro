import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering - don't try to statically generate this route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Initialize Supabase client inside the function to avoid build-time issues
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // AVG Compliance: Verwijder bestanden ouder dan 24 uur
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString()

    // Haal oude bestanden op (ouder dan 24 uur)
    const { data: oldFiles, error: fetchError } = await supabase
      .from('conversions')
      .select('file_path, id')
      .lt('created_at', twentyFourHoursAgo)

    if (fetchError) {
      console.error('Error fetching old files:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch old files', details: fetchError },
        { status: 500 }
      )
    }

    let deletedCount = 0

    if (oldFiles && oldFiles.length > 0) {
      // Verwijder bestanden uit storage
      const paths = oldFiles.map(f => f.file_path).filter(Boolean)
      
      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('uploads')
          .remove(paths)

        if (storageError) {
          console.error('Error deleting from storage:', storageError)
        }
      }

      // Verwijder database records (ouder dan 24 uur)
      const { error: deleteError } = await supabase
        .from('conversions')
        .delete()
        .lt('created_at', twentyFourHoursAgo)

      if (deleteError) {
        console.error('Error deleting records:', deleteError)
        return NextResponse.json(
          { error: 'Failed to delete records', details: deleteError },
          { status: 500 }
        )
      }

      deletedCount = oldFiles.length
      console.log(`[AVG CLEANUP] ${deletedCount} bestanden ouder dan 24 uur verwijderd op ${new Date().toISOString()}`)
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      message: `${deletedCount} bestanden ouder dan 24 uur verwijderd (AVG compliant)`,
      checkedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// Allow POST for manual triggers
export async function POST() {
  return GET()
}
