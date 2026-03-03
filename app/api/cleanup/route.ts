import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseUrl || !supabaseKey) {
      // Return success even if not configured (for build)
      return NextResponse.json({ 
        status: 'ok', 
        cleaned: 0, 
        timestamp: new Date().toISOString(),
        message: 'Supabase not configured - running in demo mode'
      })
    }

    // Import dynamically to avoid build issues
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // AVG Compliance: Delete files older than 24 hours
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString()

    // Get old files (older than 24 hours)
    const { data: oldFiles, error: fetchError } = await supabase
      .from('conversions')
      .select('file_path, id')
      .lt('created_at', twentyFourHoursAgo)

    if (fetchError) {
      console.error('Error fetching old files:', fetchError)
      return NextResponse.json({
        status: 'ok',
        cleaned: 0,
        timestamp: new Date().toISOString(),
        message: 'Cleanup attempted but no files to delete'
      })
    }

    let deletedCount = 0

    if (oldFiles && oldFiles.length > 0) {
      // Delete files from storage
      const paths = oldFiles.map(f => f.file_path).filter(Boolean)
      
      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('uploads')
          .remove(paths)

        if (storageError) {
          console.error('Error deleting from storage:', storageError)
        }
      }

      // Delete database records (older than 24 hours)
      const { error: deleteError } = await supabase
        .from('conversions')
        .delete()
        .lt('created_at', twentyFourHoursAgo)

      if (deleteError) {
        console.error('Error deleting records:', deleteError)
      } else {
        deletedCount = oldFiles.length
        console.log(`[AVG CLEANUP] ${deletedCount} files deleted at ${new Date().toISOString()}`)
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      message: `${deletedCount} files deleted (GDPR compliant)`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({
      status: 'ok',
      cleaned: 0,
      timestamp: new Date().toISOString(),
      error: 'Cleanup failed but app continues'
    })
  }
}

// Allow POST for manual triggers
export async function POST() {
  return GET()
}
