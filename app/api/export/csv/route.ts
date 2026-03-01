import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    const headers = ['Datum', 'Omschrijving', 'Bedrag', 'Categorie']
    const rows = transactions.map((t: any) => [
      t.datum,
      `"${t.omschrijving?.replace(/"/g, '""') || ''}"`,
      t.bedrag,
      t.categorie || ''
    ].join(';'))

    const csv = [headers.join(';'), ...rows].join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="transacties.csv"'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
