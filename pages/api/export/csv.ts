import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, rekeninghouder, bank } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    // BOM voor Excel compatibiliteit
    const BOM = '\uFEFF'
    
    // Header
    const headers = ['Datum', 'Omschrijving', 'Bedrag', 'Categorie', 'Bank', 'Rekeninghouder']
    
    // Rows
    const rows = transactions.map((t: any) => [
      t.datum || '',
      `"${(t.omschrijving || '').replace(/"/g, '""')}"`,
      typeof t.bedrag === 'number' ? t.bedrag.toFixed(2) : t.bedrag || '0',
      t.categorie || '',
      bank || '',
      rekeninghouder || ''
    ].join(','))

    const csv = BOM + [headers.join(','), ...rows].join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.csv"')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(200).send(csv)
    
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
