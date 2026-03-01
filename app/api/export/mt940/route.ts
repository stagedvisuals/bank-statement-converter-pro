import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions, bank, rekeningnummer } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    const mt940Lines: string[] = []
    mt940Lines.push(':20:STARTUMS')
    mt940Lines.push(':25:' + (rekeningnummer || 'NL00BANK0000000000'))
    mt940Lines.push(':28C:00001/001')
    mt940Lines.push(':60F:C' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + 'EUR0,00')

    transactions.forEach((t: any) => {
      const date = (t.datum || '').replace(/-/g, '').slice(2)
      const amount = Math.abs(t.bedrag || 0).toFixed(2).replace('.', ',')
      const dc = t.bedrag >= 0 ? 'C' : 'D'
      mt940Lines.push(':61:' + date + dc + amount + 'NTRFNONREF')
      mt940Lines.push(':86:' + (t.omschrijving || ''))
    })

    mt940Lines.push(':62F:C' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + 'EUR0,00')

    const mt940 = mt940Lines.join('\r\n')

    return new Response(mt940, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="transacties.mt940"'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
