import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, bank, rekeningnummer } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    // MT940 formaat genereren
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    let mt940 = `:20:BSCPRO${today}\n`
    mt940 += `:25:${rekeningnummer || 'NL00BANK0000000000'}\n`
    mt940 += `:28C:00001/1\n`
    mt940 += `:60F:C${today}EUR0,00\n`

    transactions.forEach((t: any, index: number) => {
      const date = (t.datum || '').replace(/-/g, '')
      const amount = Math.abs(parseFloat(t.bedrag) || 0)
      const isCredit = parseFloat(t.bedrag) > 0
      const code = isCredit ? 'C' : 'D'
      const amountStr = amount.toFixed(2).replace('.', ',')
      
      mt940 += `:61:${date}${code}EUR${amountStr}NTRF${String(index + 1).padStart(4, '0')}\n`
      mt940 += `:86:${t.omschrijving || ''}\n`
    })

    mt940 += `:62F:C${today}EUR0,00\n`

    const buffer = Buffer.from(mt940, 'utf-8')

    // Response met correcte headers voor mobiel
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.sta"')
    res.setHeader('Content-Length', buffer.length.toString())
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.status(200).send(buffer)
    
  } catch (error: any) {
    console.error('MT940 export error:', error)
    return res.status(500).json({ error: error.message })
  }
}
