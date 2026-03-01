import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions, bank, rekeningnummer } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    // MT940 formaat genereren
    let mt940 = ':20:BSCPRO\n'
    mt940 += ':25:' + (rekeningnummer || 'NL00XXXX0000000000') + '\n'
    mt940 += ':28C:00001/1\n'
    mt940 += ':60F:C' + new Date().toISOString().slice(0,8) + 'EUR0,00\n'

    transactions.forEach((t: any) => {
      const date = t.datum?.replace(/-/g, '').slice(2) || new Date().toISOString().slice(2,8)
      const bedrag = Math.abs(t.bedrag).toFixed(2).replace('.', ',')
      mt940 += ':61:' + date + (t.bedrag < 0 ? 'D' : 'C') + bedrag + 'NTRF' + t.omschrijving?.slice(0,16) + '\n'
      mt940 += ':86:' + t.omschrijving + '\n'
    })

    mt940 += ':62F:C' + new Date().toISOString().slice(0,8) + 'EUR0,00\n'

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
