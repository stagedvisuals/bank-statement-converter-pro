import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { categorizeTransactions, getCategorySummary, getBTWSummary, CATEGORIES, BTW_RATES } from '@/lib/categorization'

export const runtime = 'edge'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

// MT940 Format Generator
function generateMT940(transactions: any[], bank: string, accountNumber: string = 'NL00BSCP0000000000'): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
  
  // Calculate opening and closing balance
  const totalAmount = transactions.reduce((sum, t) => sum + (parseFloat(t.bedrag) || 0), 0)
  const openingBalance = 0
  const closingBalance = openingBalance + totalAmount
  
  // Determine currency (default EUR)
  const currency = 'EUR'
  
  // Build MT940 content
  let mt940 = ''
  
  // Record 20 - Transaction Reference Number
  mt940 += `:20:BSCPro-${dateStr}-${timeStr}\r\n`
  
  // Record 25 - Account Identification
  mt940 += `:25:${accountNumber}\r\n`
  
  // Record 28C - Statement Number/Sequence Number
  mt940 += `:28C:00001/001\r\n`
  
  // Record 60F - Opening Balance
  const openBalanceStr = Math.abs(openingBalance).toFixed(2).replace('.', ',')
  const openSign = openingBalance >= 0 ? 'C' : 'D'
  mt940 += `:60F:${openSign}${dateStr}${currency}${openBalanceStr}\r\n`
  
  // Transaction records (61 and 86)
  transactions.forEach((t, index) => {
    const amount = parseFloat(t.bedrag) || 0
    const txDate = t.datum ? t.datum.replace(/-/g, '').slice(0, 8) : dateStr
    const entryDate = txDate
    const amountStr = Math.abs(amount).toFixed(2).replace('.', ',')
    const sign = amount >= 0 ? 'C' : 'D'
    const fundsCode = '' // Optional
    const txRef = `TRX${(index + 1).toString().padStart(5, '0')}`
    
    // Record 61 - Statement Line
    mt940 += `:61:${txDate}${entryDate}${sign}${fundsCode}${amountStr}NTRF${txRef}\r\n`
    
    // Record 86 - Information to Account Owner
    const description = (t.omschrijving || 'Transactie').substring(0, 65)
    mt940 += `:86:${description}\r\n`
  })
  
  // Record 62F - Closing Balance
  const closeBalanceStr = Math.abs(closingBalance).toFixed(2).replace('.', ',')
  const closeSign = closingBalance >= 0 ? 'C' : 'D'
  mt940 += `:62F:${closeSign}${dateStr}${currency}${closeBalanceStr}\r\n`
  
  return mt940
}

export async function POST(req: NextRequest) {
  console.log('[Vision Scanner] Request received')

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand' }, { status: 400 })
    }

    console.log(`[Vision Scanner] Processing: ${file.name}`)

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // AI VISION ANALYSIS
    console.log('[Vision Scanner] Sending to Groq Vision...')
    
    const visionResponse = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all transactions from this bank statement. Return as JSON with fields: date (DD-MM-YYYY), description, amount (positive for income, negative for expenses), balance. Format: {"bank": "bank name", "rekeningnummer": "IBAN", "transacties": [{"datum": "...", "omschrijving": "...", "bedrag": 0.00}]}'
              },
              {
                type: 'image_url',
                image_url: { url: `data:${file.type};base64,${base64}` }
              }
            ]
          }
        ],
        temperature: 0.1
      })
    })

    if (!visionResponse.ok) {
      throw new Error(`Vision API failed: ${visionResponse.status}`)
    }

    const aiData = await visionResponse.json()
    const aiContent = aiData.choices?.[0]?.message?.content || ''
    
    console.log('[Vision Scanner] AI Response:', aiContent.substring(0, 600))

    // Parse JSON
    let parsedData: any = { transacties: [], rekeningnummer: '' }
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.log('[Vision Scanner] JSON parse failed')
    }

    const bank = parsedData.bank || 'Onbekend'
    const accountNumber = parsedData.rekeningnummer || 'NL00BSCP0000000000'
    let transactions = parsedData.transacties || []

    console.log(`[Vision Scanner] Found ${transactions.length} transactions from ${bank}`)

    if (transactions.length === 0) {
      return NextResponse.json({
        error: 'Geen transacties gevonden',
        details: 'De AI kon geen transacties herkennen in dit document.',
        tip: 'Zorg dat het document duidelijk leesbaar is en financiële data bevat.'
      }, { status: 400 })
    }

    // APPLY AUTOMATIC CATEGORIZATION
    transactions = categorizeTransactions(transactions)
    
    // Generate category summary
    const categorySummary = getCategorySummary(transactions)
    
    // Generate BTW summary
    const btwSummary = getBTWSummary(transactions)

    return NextResponse.json({
      success: true,
      bank: bank,
      rekeningnummer: accountNumber,
      count: transactions.length,
      transactions: transactions.map((t: any) => ({
        datum: t.datum || '',
        omschrijving: (t.omschrijving || '').trim(),
        bedrag: parseFloat(t.bedrag || 0),
        rekeningnummer: t.rekeningnummer || '',
        category: t.category,
        categoryName: t.categoryName,
        categoryEmoji: t.categoryEmoji,
        btw: t.btw
      })),
      categorySummary,
      btwSummary,
      message: `${transactions.length} transacties gedetecteerd (${bank})`
    })

  } catch (error: any) {
    console.error('[Vision Scanner] Error:', error)
    return NextResponse.json({ 
      error: 'Verwerking mislukt', 
      message: error.message 
    }, { status: 500 })
  }
}

// EXCEL EXPORT
export async function PUT(req: NextRequest) {
  try {
    const { transactions, bank = 'Onbekend' } = await req.json()
    
    // Categorize transactions if not already done
    const categorizedTransactions = categorizeTransactions(transactions)
    
    const workbook = new ExcelJS.Workbook()
    
    // Category color mapping for Excel
    const categoryColors: Record<string, string> = {
      'boodschappen': 'FFD5F4E6', // Green
      'huur': 'FFDBEAFE', // Blue
      'salaris': 'FFD1FAE5', // Emerald
      'brandstof': 'FFFEE2E2', // Red
      'horeca': 'FFFFEDD5', // Orange
      'telecom': 'FFF3E8FF', // Purple
      'transport': 'FFCFFAFE', // Cyan
      'software': 'FFE0E7FF', // Indigo
      'bankkosten': 'FFF1F5F9', // Slate
      'overig': 'FFF3F4F6' // Gray
    }
    
    // ===== SHEET 1: TRANSACTIES =====
    const worksheet = workbook.addWorksheet('Transacties')
    
    // Header
    worksheet.mergeCells('A1:G1')
    worksheet.getCell('A1').value = 'BSC PRO - AI Document Scanner'
    worksheet.getCell('A1').font = { size: 18, bold: true, color: { argb: 'FF2563EB' } }
    worksheet.getCell('A1').alignment = { horizontal: 'center' }
    
    worksheet.mergeCells('A2:G2')
    worksheet.getCell('A2').value = `Bank: ${bank} | ${new Date().toLocaleDateString('nl-NL')}`
    worksheet.getCell('A2').alignment = { horizontal: 'center' }

    // Summary
    const totalIn = categorizedTransactions.filter((t: any) => t.bedrag > 0).reduce((sum: number, t: any) => sum + t.bedrag, 0)
    const totalOut = categorizedTransactions.filter((t: any) => t.bedrag < 0).reduce((sum: number, t: any) => sum + Math.abs(t.bedrag), 0)
    
    worksheet.getCell('A4').value = 'Samenvatting:'
    worksheet.getCell('A4').font = { bold: true }
    worksheet.getCell('B4').value = `In: €${totalIn.toFixed(2)}`
    worksheet.getCell('B4').font = { color: { argb: 'FF059669' } }
    worksheet.getCell('C4').value = `Uit: €${totalOut.toFixed(2)}`
    worksheet.getCell('C4').font = { color: { argb: 'FFDC2626' } }
    
    worksheet.getCell('E4').value = 'Automatisch gecategoriseerd ✨'
    worksheet.getCell('E4').font = { color: { argb: 'FF7C3AED' }, italic: true }

    // Table headers - updated with new columns
    const headers = ['Datum', 'Omschrijving', 'Categorie', 'Bedrag', 'Type', 'BTW %', 'BTW Bedrag']
    const headerRow = worksheet.getRow(6)
    headers.forEach((h, i) => {
      headerRow.getCell(i + 1).value = h
      headerRow.getCell(i + 1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      headerRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    })

    // Data
    let rowNum = 7
    categorizedTransactions.forEach((t: any, index: number) => {
      const row = worksheet.getRow(rowNum++)
      const isIncome = t.bedrag >= 0
      const bgColor = categoryColors[t.category] || 'FFF3F4F6'
      
      row.getCell(1).value = t.datum
      row.getCell(2).value = t.omschrijving
      row.getCell(3).value = `${t.categoryEmoji} ${t.categoryName}`
      row.getCell(4).value = Math.abs(t.bedrag)
      row.getCell(4).numFmt = '€#,##0.00'
      row.getCell(5).value = isIncome ? 'Inkomst' : 'Uitgave'
      row.getCell(6).value = t.btw?.rate + '%'
      
      // Calculate BTW amount (bedrag is incl. BTW)
      const btwRate = t.btw?.rate || 0
      const amount = Math.abs(t.bedrag || 0)
      const btwAmount = btwRate > 0 ? amount * btwRate / (100 + btwRate) : 0
      row.getCell(7).value = btwAmount
      row.getCell(7).numFmt = '€#,##0.00'
      
      row.getCell(4).font = { color: { argb: isIncome ? 'FF059669' : 'FFDC2626' } }
      
      // Apply category background color
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor.replace('#', '') } }
      })
    })

    worksheet.getColumn(1).width = 12
    worksheet.getColumn(2).width = 45
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 15
    worksheet.getColumn(5).width = 12
    worksheet.getColumn(6).width = 10
    worksheet.getColumn(7).width = 15

    // ===== SHEET 2: SAMENVATTING =====
    const summarySheet = workbook.addWorksheet('Samenvatting')
    
    summarySheet.mergeCells('A1:D1')
    summarySheet.getCell('A1').value = '📊 Categorie Samenvatting'
    summarySheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FF2563EB' } }
    
    summarySheet.mergeCells('A2:D2')
    summarySheet.getCell('A2').value = `Totaal: ${categorizedTransactions.length} transacties`
    summarySheet.getCell('A2').font = { italic: true }
    
    // Category summary headers
    const sumHeaders = ['Categorie', 'Aantal', 'Totaal', 'Percentage']
    const sumHeaderRow = summarySheet.getRow(4)
    sumHeaders.forEach((h, i) => {
      sumHeaderRow.getCell(i + 1).value = h
      sumHeaderRow.getCell(i + 1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      sumHeaderRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    })
    
    // Category data
    const categorySummary = getCategorySummary(categorizedTransactions)
    let catRowNum = 5
    categorySummary.forEach((cat: any) => {
      const row = summarySheet.getRow(catRowNum++)
      row.getCell(1).value = `${cat.category.emoji} ${cat.category.name}`
      row.getCell(2).value = cat.count
      row.getCell(3).value = cat.total
      row.getCell(3).numFmt = '€#,##0.00'
      row.getCell(4).value = cat.percentage + '%'
    })
    
    summarySheet.getColumn(1).width = 25
    summarySheet.getColumn(2).width = 12
    summarySheet.getColumn(3).width = 15
    summarySheet.getColumn(4).width = 12

    // ===== SHEET 3: BTW OVERZICHT =====
    const btwSheet = workbook.addWorksheet('BTW overzicht')
    
    btwSheet.mergeCells('A1:D1')
    btwSheet.getCell('A1').value = '🏦 BTW Overzicht'
    btwSheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FF2563EB' } }
    
    btwSheet.mergeCells('A2:D2')
    btwSheet.getCell('A2').value = 'Klaar voor je BTW-aangifte!'
    btwSheet.getCell('A2').font = { italic: true, color: { argb: 'FF059669' } }
    
    // BTW headers
    const btwHeaders = ['BTW Tarief', 'Omschrijving', 'Totaal bedrag', 'BTW Bedrag']
    const btwHeaderRow = btwSheet.getRow(4)
    btwHeaders.forEach((h, i) => {
      btwHeaderRow.getCell(i + 1).value = h
      btwHeaderRow.getCell(i + 1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      btwHeaderRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    })
    
    // BTW data
    const btwSummary = getBTWSummary(categorizedTransactions)
    let btwRowNum = 5
    let totalBTW = 0
    btwSummary.forEach((btw: any) => {
      const row = btwSheet.getRow(btwRowNum++)
      row.getCell(1).value = btw.rate + '%'
      row.getCell(2).value = btw.description
      row.getCell(3).value = btw.total
      row.getCell(3).numFmt = '€#,##0.00'
      row.getCell(4).value = parseFloat(btw.btwAmountFormatted)
      row.getCell(4).numFmt = '€#,##0.00'
      totalBTW += parseFloat(btw.btwAmountFormatted)
    })
    
    // Total row
    const totalRow = btwSheet.getRow(btwRowNum + 1)
    totalRow.getCell(3).value = 'Totaal BTW:'
    totalRow.getCell(3).font = { bold: true }
    totalRow.getCell(4).value = totalBTW
    totalRow.getCell(4).numFmt = '€#,##0.00'
    totalRow.getCell(4).font = { bold: true, color: { argb: 'FF059669' } }
    
    btwSheet.getColumn(1).width = 15
    btwSheet.getColumn(2).width = 25
    btwSheet.getColumn(3).width = 18
    btwSheet.getColumn(4).width = 18

    const buffer = await workbook.xlsx.writeBuffer()
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="BSC-PRO-${bank}-Scan.xlsx"`
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// MT940 EXPORT - NEW
export async function PATCH(req: NextRequest) {
  try {
    const { transactions, bank = 'Onbekend', rekeningnummer } = await req.json()
    
    const mt940Content = generateMT940(transactions, bank, rekeningnummer)
    
    return new NextResponse(mt940Content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="BSC-PRO-${bank}-MT940.sta"`
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
