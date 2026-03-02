import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, rekeningnummer, bank, rekeninghouder } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    const iban = rekeningnummer || 'NL00BANK0000000000'
    const bankCode = bank || 'BANK'

    // Sorteer op datum
    const sorted = [...transactions].sort((a: any, b: any) => 
      new Date(a.datum).getTime() - new Date(b.datum).getTime()
    )

    // Bereken saldo
    const totaal = sorted.reduce((sum: number, t: any) => sum + (t.bedrag || 0), 0)
    const openingSaldo = 0
    const slotSaldo = openingSaldo + totaal

    const formatDate = (datum: string) => {
      if (!datum) return '010101'
      return datum.replace(/-/g, '').slice(2, 8)
    }

    const formatAmount = (amount: number) => {
      return Math.abs(amount).toFixed(2).replace('.', ',')
    }

    const lines: string[] = []
    lines.push(':20:BSCPro-' + Date.now())
    lines.push(':25:' + iban)
    lines.push(':28C:00001/001')

    // Openingssaldo
    const openDate = formatDate(sorted[0]?.datum)
    lines.push(`:60F:C${openDate}EUR${formatAmount(openingSaldo)}`)

    // Transacties
    sorted.forEach((t: any) => {
      const date = formatDate(t.datum)
      const dc = t.bedrag >= 0 ? 'C' : 'D'
      const amount = formatAmount(t.bedrag)
      const omschrijving = (t.omschrijving || 'Transactie')
        .substring(0, 140)
        .replace(/[^\w\s\-\.\/]/g, ' ')
      
      lines.push(`:61:${date}${date}${dc}${amount}NTRFNONREF`)
      lines.push(`:86:${omschrijving}`)
    })

    // Slotsaldo
    const closeDate = formatDate(sorted[sorted.length - 1]?.datum)
    lines.push(`:62F:${slotSaldo >= 0 ? 'C' : 'D'}${closeDate}EUR${formatAmount(slotSaldo)}`)
    lines.push('-')

    const mt940 = lines.join('\r\n')

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.mt940"')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(200).send(mt940)
    
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
