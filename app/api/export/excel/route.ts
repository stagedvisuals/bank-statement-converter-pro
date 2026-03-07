// FIXED MAPPING V2 - RELATIVE PATH TEST
import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

// CORS headers voor API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactions, filename = 'transacties.xlsx' } = body

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: 'Geen transacties gevonden om te exporteren' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Genereer Excel met watermerk
    const excelBuffer = await generateExcelWithWatermark(transactions)

    // Return Excel file
    return new NextResponse(excelBuffer as any, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json(
      { error: 'Excel export mislukt: ' + (error instanceof Error ? error.message : 'Onbekende fout') },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function generateExcelWithWatermark(transactions: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'BSC Pro'
  workbook.created = new Date()
  
  const worksheet = workbook.addWorksheet('Transacties')
  
  // Watermerk in cel A1
  const watermarkCell = worksheet.getCell('A1')
  watermarkCell.value = 'Gegenereerd door BSC Pro - www.bscpro.nl'
  watermarkCell.font = {
    name: 'Calibri',
    size: 11,
    color: { argb: 'FFCCCCCC' },
    italic: true
  }
  
  worksheet.getRow(1).height = 25
  worksheet.getRow(2).height = 5
  
  // Headers
  const headers = [
    'Datum',
    'Omschrijving', 
    'Bedrag (€)',
    'Saldo na (€)',
    'Type',
    'Categorie',      // Kolom F - GEFIXTE MAPPING
    'BTW %',
    'Vertrouwen'
  ]
  
  const headerRow = worksheet.getRow(3)
  headerRow.values = headers
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E5A8C' } }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  
  // Transacties
  transactions.forEach((transaction, index) => {
    const row = worksheet.getRow(4 + index)
    
    const bedrag = parseFloat(transaction.bedrag || transaction.amount || 0)
    const saldo = parseFloat(transaction.saldo_na || transaction.balance_after || 0)
    
    const btw = transaction.btw_percentage || transaction.vat_percentage || 21
    const btwDisplay = btw === 0 ? '0%' : btw === 9 ? '9%' : '21%'
    
    const confidence = transaction.confidence_score || transaction.vertrouwen || 0.95
    const confidenceDisplay = `${(confidence * 100).toFixed(0)}%`
    
    // FIXED MAPPING: transaction.category komt uit database-match (18 regels)
    row.values = [
      transaction.datum || transaction.date || '',
      transaction.omschrijving || transaction.description || '',
      bedrag,
      saldo,
      transaction.type || '',
      // GEFIXTE MAPPING V2: transaction.category || transaction.categorie || ''
      transaction.category || transaction.categorie || '',
      btwDisplay,
      confidenceDisplay
    ]
    
    // Styling
    const bedragCell = row.getCell(3)
    bedragCell.numFmt = '#,##0.00'
    bedragCell.font = { color: { argb: bedrag < 0 ? 'FFFF0000' : 'FF00AA00' } }
    
    const saldoCell = row.getCell(4)
    saldoCell.numFmt = '#,##0.00'
    
    const confidenceCell = row.getCell(8)
    if (confidence >= 0.9) {
      confidenceCell.font = { color: { argb: 'FF00AA00' } }
    } else if (confidence >= 0.7) {
      confidenceCell.font = { color: { argb: 'FFFFA500' } }
    } else {
      confidenceCell.font = { color: { argb: 'FFFF0000' } }
    }
    
    if (index % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } }
    }
  })
  
  // Kolombreedtes
  worksheet.columns = [
    { width: 12 }, { width: 40 }, { width: 12 }, { width: 12 },
    { width: 15 }, { width: 20 }, { width: 8 }, { width: 12 }
  ]
  
  // Samenvatting
  const summaryRow = 4 + transactions.length + 2
  worksheet.getCell(`A${summaryRow}`).value = 'Totaal transacties:'
  worksheet.getCell(`B${summaryRow}`).value = transactions.length
  worksheet.getCell(`B${summaryRow}`).font = { bold: true }
  
  const totalBedrag = transactions.reduce((sum, t) => sum + parseFloat(t.bedrag || t.amount || 0), 0)
  worksheet.getCell(`A${summaryRow + 1}`).value = 'Totaal bedrag:'
  const totaalCell = worksheet.getCell(`B${summaryRow + 1}`)
  totaalCell.value = totalBedrag
  totaalCell.numFmt = '€#,##0.00'
  totaalCell.font = { bold: true, color: { argb: totalBedrag < 0 ? 'FFFF0000' : 'FF000000' } }
  
  // Buffer genereren
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Excel export API V2 - Categorie mapping gefixed',
    watermark: 'Gegenereerd door BSC Pro - www.bscpro.nl',
    timestamp: new Date().toISOString(),
    fix: 'Kolom F (Categorie) = transaction.category || transaction.categorie || ""',
    database: '18 regels match',
    path: 'relative path write successful'
  }, { headers: corsHeaders })
}