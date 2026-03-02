import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    // CSV headers
    const headers = ['Datum', 'Omschrijving', 'Bedrag', 'Categorie']
    
    // CSV rows
    const rows = transactions.map((t: any) => [
      t.datum || '',
      `"${(t.omschrijving || '').replace(/"/g, '""')}"`,
      typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0,
      t.categorie || ''
    ].join(';'))

    const csv = [headers.join(';'), ...rows].join('\n')
    const bom = '\uFEFF' // UTF-8 BOM voor Excel compatibiliteit
    const buffer = Buffer.from(bom + csv, 'utf-8')

    // Response met correcte headers voor mobiel
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.csv"')
    res.setHeader('Content-Length', buffer.length.toString())
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.status(200).send(buffer)
    
  } catch (error: any) {
    console.error('CSV export error:', error)
    return res.status(500).json({ error: error.message })
  }
}
