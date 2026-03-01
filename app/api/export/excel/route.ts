import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    // Return CSV met excel mimetype als fallback
    const headers = ['Datum', 'Omschrijving', 'Bedrag', 'Categorie']
    const rows = transactions.map((t: any) => [
      t.datum,
      `"${t.omschrijving}"`,
      t.bedrag,
      t.categorie || ''
    ].join(';'))

    const csv = [headers.join(';'), ...rows].join('\n')

    return new Response('\uFEFF' + csv, {
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': 'attachment; filename="transacties.xlsx"'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
