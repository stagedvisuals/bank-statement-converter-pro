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
      // Verwijder emoji uit categorieën voor Excel compatibiliteit
      const categorie = (t.categorie || 'Overig').replace(/[\u2600-\u27BF\u2B50\u2B55\u3000-\u303F\u3297\u3299\u1F004\u1F0CF\u1F170-\u1F251\u1F300-\u1F5FF\u1F600-\u1F64F\u1F680-\u1F6FF\u1F7E0-\u1F7FF\u1F80-\u1F8FF\u1F900-\u1F9FF\u1FA00-\u1FA6F\u1FA70-\u1FAFF]/g, '').trim()
      const subcategorie = (t.subcategorie || '').replace(/[\u2600-\u27BF\u2B50\u2B55\u3000-\u303F\u3297\u3299\u1F004\u1F0CF\u1F170-\u1F251\u1F300-\u1F5FF\u1F600-\u1F64F\u1F680-\u1F6FF\u1F7E0-\u1F7FF\u1F80-\u1F8FF\u1F900-\u1F9FF\u1FA00-\u1FA6F\u1FA70-\u1FAFF]/g, '').trim()
      
      const row = worksheet.addRow({
        datum: t.datum || '',
        omschrijving: t.omschrijving || '',
        bedrag: typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0,
        categorie: categorie,
        subcategorie: subcategorie,
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
      { key: 'IBAN', value: rekeningnummer || 'Onbekend' },
      { key: 'Datum export', value: new Date().toLocaleDateString('nl-NL') },
      { key: 'Aantal transacties', value: transactions.length },
      { key: 'Totaal bedrag', value: `€${totaal.toFixed(2)}` },
      { key: 'Gegenereerd door', value: 'BSCPro - bscpro.nl' },
    ])

    // Buffer genereren
    const buffer = await workbook.xlsx.writeBuffer()
    
    // Response met juiste headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    const filename = `BSCPro-Export-${new Date().toISOString().split('T')[0]}.xlsx`
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.length.toString())
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.send(buffer)
  } catch (error: any) {
    console.error('Excel export error:', error)
    res.status(500).json({ error: 'Export mislukt: ' + error.message })
  }
}
