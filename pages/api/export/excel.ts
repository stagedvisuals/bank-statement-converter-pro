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

    // Gebruik ExcelJS voor echte .xlsx
    const ExcelJS = require('exceljs')
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Transacties')

    // Kolommen
    worksheet.columns = [
      { header: 'Datum', key: 'datum', width: 15 },
      { header: 'Omschrijving', key: 'omschrijving', width: 40 },
      { header: 'Bedrag', key: 'bedrag', width: 15 },
      { header: 'Categorie', key: 'categorie', width: 20 },
    ]

    // Stijl header rij
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FF00B8D9' } 
    }

    // Data toevoegen
    transactions.forEach((t: any) => {
      worksheet.addRow({
        datum: t.datum || '',
        omschrijving: t.omschrijving || '',
        bedrag: typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0,
        categorie: t.categorie || ''
      })
    })

    // Bedrag kolom als getal formatteren
    worksheet.getColumn('bedrag').numFmt = '€#,##0.00;[Red]-€#,##0.00'

    // Buffer genereren
    const buffer = await workbook.xlsx.writeBuffer()

    // Response met correcte headers voor mobiel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.xlsx"')
    res.setHeader('Content-Length', buffer.byteLength.toString())
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.status(200).send(buffer)
    
  } catch (error: any) {
    console.error('Excel export error:', error)
    return res.status(500).json({ error: error.message })
  }
}
