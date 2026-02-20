import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, isDemoMode } from '@/lib/supabase'
import { deductCredit } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check credits
    const hasCredits = await deductCredit(userId)
    if (!hasCredits) {
      return NextResponse.json({ error: 'No credits available' }, { status: 403 })
    }

    // Get file
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Parse PDF text (simplified for demo)
    const text = await file.text()
    
    // Extract transactions (basic pattern)
    const lines = text.split('\n')
    const transactions = []
    for (const line of lines) {
      const match = line.match(/(\d{2}[/-]\d{2}[/-]\d{4})\s+(.+?)\s+([\d.,]+)/)
      if (match) {
        transactions.push({
          date: match[1],
          description: match[2].trim(),
          amount: match[3].replace(',', '.'),
        })
      }
    }

    // Generate CSV
    let csv = 'Date,Description,Amount\n'
    for (const t of transactions) {
      csv += `${t.date},"${t.description}",${t.amount}\n`
    }

    return NextResponse.json({
      success: true,
      downloadUrl: 'data:text/csv;base64,' + Buffer.from(csv).toString('base64'),
      transactionCount: transactions.length,
    })

  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}
