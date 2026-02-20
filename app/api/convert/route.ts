export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get file
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read file content
    const text = await file.text()
    
    // Extract transactions (basic pattern matching)
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

  } catch (error: any) {
    console.error('Conversion error:', error)
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 })
  }
}
