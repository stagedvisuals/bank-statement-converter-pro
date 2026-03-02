import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, rekeninghouder, bank, rekeningnummer } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    const ExcelJS = require('exceljs')
    const workbook = new ExcelJS.Workbook()
    
    // Metadata
    workbook.creator = 'BSCPro'
    workbook.created = new Date()
    
    const worksheet = workbook.addWorksheet('Transacties', {
      pageSetup: { paperSize: 9, orientation: 'portrait' }
    })

    // Kolom definities
    worksheet.columns = [
      { header: 'Datum', key: 'datum', width: 14 },
      { header: 'Omschrijving', key: 'omschrijving', width: 45 },
      { header: 'Bedrag (€)', key: 'bedrag', width: 14 },
      { header: 'Categorie', key: 'categorie', width: 20 },
      { header: 'Subcategorie', key: 'subcategorie', width: 20 },
      { header: 'BTW %', key: 'btw', width: 10 },
    ]

    // Header rij stijl
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FF080d14' }, size: 11 }
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B8D9' } }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 22

    // Data rijen toevoegen
    transactions.forEach((t: any, index: number) => {
      const row = worksheet.addRow({
        datum: t.datum || '',
        omschrijving: t.omschrijving || '',
        bedrag: typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0,
        categorie: t.categorie || 'Overig',
        subcategorie: t.subcategorie || '',
        btw: t.btw_percentage || t.btw || '21%',
      })

      // Afwisselende rij kleuren
      if (index % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FEFF' } }
      }

      // Bedrag kolom rood/groen
      const bedragCell = row.getCell('bedrag')
      const bedragWaarde = typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0
      bedragCell.numFmt = '€#,##0.00;[Red]-€#,##0.00'
      bedragCell.font = { color: { argb: bedragWaarde >= 0 ? 'FF10B981' : 'FFEF4444' }, bold: true }
    })

    // Totaal rij
    const totaal = transactions.reduce((sum: number, t: any) => {
      return sum + (typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0)
    }, 0)
    
    const totaalRow = worksheet.addRow({
      datum: '',
      omschrijving: 'TOTAAL',
      bedrag: totaal,
      categorie: '',
      subcategorie: '',
      btw: ''
    })
    
    totaalRow.font = { bold: true }
    totaalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5F9FF' } }
    totaalRow.getCell('bedrag').numFmt = '€#,##0.00;[Red]-€#,##0.00'
    totaalRow.getCell('bedrag').font = { bold: true, color: { argb: totaal >= 0 ? 'FF10B981' : 'FFEF4444' } }

    // Info blad toevoegen
    const infoSheet = workbook.addWorksheet('Info')
    infoSheet.columns = [
      { header: 'Gegeven', key: 'key', width: 25 },
      { header: 'Waarde', key: 'value', width: 40 },
    ]
    
    const infoHeader = infoSheet.getRow(1)
    infoHeader.font = { bold: true }
    infoHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B8D9' } }
    
    infoSheet.addRows([
      { key: 'Rekeninghouder', value: rekeninghouder || 'Onbekend' },
      { key: 'Bank', value: bank || 'Onbekend' },
      { key: 'Rekeningnummer', value: rekeningnummer || 'Onbekend' },
      { key: 'Export datum', value: new Date().toLocaleDateString('nl-NL') },
      { key: 'Aantal transacties', value: transactions.length.toString() },
      { key: 'Totaal bedrag', value: `€${totaal.toFixed(2)}` },
      { key: 'Geëxporteerd door', value: 'BSCPro.nl' },
    ])

    // Buffer genereren
    const buffer = await workbook.xlsx.writeBuffer()
    
    // Response met juiste headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="BSCPro-Export.xlsx"')
    res.send(buffer)
  } catch (error: any) {
    console.error('Excel export error:', error)
    res.status(500).json({ error: 'Export mislukt: ' + error.message })
  }
}
