import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { checkAdmin } from '@/lib/admin-auth'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Cleanup service actief',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  // Check admin of cron secret
  const cronSecret = request.headers.get('x-cron-secret')
  const isAdmin = checkAdmin(request)
  const isCron = cronSecret === process.env.CRON_SECRET

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - 24)
    const cutoffISO = cutoff.toISOString()
    let cleanedCount = 0

    // Verwijder oude conversie records (ouder dan 24 uur)
    const { data: oldConversions, error: convError } = await supabase
      .from('conversions')
      .select('id, file_path')
      .lt('created_at', cutoffISO)

    if (!convError && oldConversions && oldConversions.length > 0) {
      // Verwijder bestanden uit Supabase Storage
      const filePaths = oldConversions
        .map((c: any) => c.file_path)
        .filter(Boolean)

      if (filePaths.length > 0) {
        await supabase.storage
          .from('uploads')
          .remove(filePaths)
      }

      // Verwijder database records
      const ids = oldConversions.map((c: any) => c.id)
      await supabase
        .from('conversions')
        .delete()
        .in('id', ids)

      cleanedCount = oldConversions.length
    }

    return NextResponse.json({
      status: 'ok',
      cleaned: cleanedCount,
      cutoff: cutoffISO,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
