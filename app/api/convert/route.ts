import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { categorizeTransactions, getCategorySummary, getBTWSummary, CATEGORIES, BTW_RATES } from '@/lib/categorization'
import pdfParse from 'pdf-parse'

export const runtime = 'nodejs'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

// MT940 Format Generator
function generateMT940(transactions: any[], bank: string, accountNumber: string = 'NL00BSCP0000000000'): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
  
  const totalAmount = transactions.reduce((sum, t) => sum + (parseFloat(t.bedrag) || 0), 0)
  const openingBalance = 0
  const closingBalance = openingBalance + totalAmount
  const currency = 'EUR'
  
  let mt940 = ''
  mt940 += `:20:BSCPro-${dateStr}-${timeStr}\r\n`
  mt940 += `:25:${accountNumber}\r\n`
  mt940 += `:28C:00001/001\r\n`
  
  const openBalanceStr = Math.abs(openingBalance).toFixed(2).replace('.', ',')
  const openSign = openingBalance >= 0 ? 'C' : 'D'
  mt940 += `:60F:${openSign}${dateStr}${currency}${openBalanceStr}\r\n`
  
  transactions.forEach((t, index) => {
    const amount = parseFloat(t.bedrag) || 0
    const txDate = t.datum ? t.datum.replace(/-/g, '').slice(0, 8) : dateStr
    const entryDate = txDate
    const amountStr = Math.abs(amount).toFixed(2).replace('.', ',')
    const sign = amount >= 0 ? 'C' : 'D'
    const txRef = `TRX${(index + 1).toString().padStart(5, '0')}`
    
    mt940 += `:61:${txDate}${entryDate}${sign}${amountStr}NTRF${txRef}\r\n`
    const description = (t.omschrijving || 'Transactie').substring(0, 65)
    mt940 += `:86:${description}\r\n`
  })
  
  const closeBalanceStr = Math.abs(closingBalance).toFixed(2).replace('.', ',')
  const closeSign = closingBalance >= 0 ? 'C' : 'D'
  mt940 += `:62F:${closeSign}${dateStr}${currency}${closeBalanceStr}\r\n`
  
  return mt940
}

// Process PDF text with Groq text model
async function processPdfWithGroq(pdfText: string, fileName: string): Promise<any> {
  console.log(`[Groq Text] Processing PDF: ${fileName}`)
  console.log(`[Groq Text] PDF text length: ${pdfText.length} characters`)
  console.log(`[Groq Text] PDF text preview:`, pdfText.substring(0, 500))
  
  // Truncate text if too long (Groq has token limits)
  const maxChars = 15000
  const truncatedText = pdfText.length > maxChars ? pdfText.substring(0, maxChars) + '\n...[truncated]' : pdfText
  
  const requestBody = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a bank statement parser. Extract all transactions from the provided text and return them as a JSON object. Identify the bank name and account number if present.'
      },
      {
        role: 'user',
        content: `Extract all bank transactions from this bank statement text and return as JSON with this exact format:
{
  "bank": "bank name (e.g., ING, Rabobank, ABN AMRO)",
  "rekeningnummer": "IBAN if found",
  "transacties": [
    {"datum": "DD-MM-YYYY", "omschrijving": "transaction description", "bedrag": -123.45}
  ]
}

Important categorization rules:
- "Belastingdienst" = government tax payment (overheid)
- Monthly transfers with fixed amounts = likely rent (huur)
- "Zorgverzekering", "CZ", "VGZ", "Menzis", "Zilveren Kruis" = healthcare insurance (zorg)
- "Spotify", "Netflix", "Disney+", "HBO", "Videoland" = subscriptions (abonnementen)
- "Overboeking" with same amount every month = rent (huur)
- Use Dutch descriptions from the bank statement

Important:
- Amount should be positive for income, negative for expenses
- Date format: DD-MM-YYYY
- Return ONLY valid JSON, no markdown, no explanation

Bank statement text:
${truncatedText}`
      }
    ],
    temperature: 0.1,
    max_tokens: 4096
  }
  
  console.log('[Groq Text] Sending request to Groq...')
  
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(requestBody)
  })
  
  console.log(`[Groq Text] Response status: ${response.status}`)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[Groq Text] Error response: ${errorText}`)
    throw new Error(`Groq API failed: ${response.status} - ${errorText}`)
  }
  
  const rawText = await response.text()
  console.log(`[Groq Text] Raw response length: ${rawText.length}`)
  
  let aiData: any
  try {
    aiData = JSON.parse(rawText)
  } catch (parseError) {
    console.error(`[Groq Text] JSON parse error:`, parseError)
    console.error(`[Groq Text] Full raw response:`, rawText)
    throw new Error(`Failed to parse Groq response as JSON`)
  }
  
  const aiContent = aiData.choices?.[0]?.message?.content || ''
  
  if (!aiContent || aiContent.trim() === '') {
    console.log(`[Groq Text] Empty response from Groq`)
    console.log(`[Groq Text] Full response:`, JSON.stringify(aiData))
    return { transacties: [], rekeningnummer: '' }
  }
  
  console.log(`[Groq Text] AI Response content:`, aiContent.substring(0, 1000))
  
  // Parse JSON from response
  let parsedData: any = { transacties: [], rekeningnummer: '' }
  try {
    // Try to find JSON in the response (in case there's markdown or extra text)
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[0])
    } else {
      // Try parsing the whole content
      parsedData = JSON.parse(aiContent)
    }
  } catch (e) {
    console.log(`[Groq Text] JSON parse failed:`, e)
    console.log(`[Groq Text] Raw content:`, aiContent)
  }
  
  return parsedData
}

export async function POST(req: NextRequest) {
  console.log('[Vision Scanner] Request received')

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand' }, { status: 400 })
    }

    console.log(`[Vision Scanner] Processing: ${file.name}, type: ${file.type}`)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    let allTransactions: any[] = []
    let bank = 'Onbekend'
    let accountNumber = ''
    
    // Check if file is PDF
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    
    if (isPdf) {
      // Extract text from PDF using pdf-parse
      console.log('[Vision Scanner] Extracting text from PDF...')
      console.log(`[Vision Scanner] PDF buffer size: ${buffer.length} bytes`)
      
      let pdfData
      try {
        pdfData = await pdfParse(buffer)
        console.log(`[Vision Scanner] PDF text extracted: ${pdfData.text.length} characters`)
        console.log(`[Vision Scanner] PDF pages: ${pdfData.numpages}`)
      } catch (pdfError) {
        console.error('[Vision Scanner] PDF parsing failed:', pdfError)
        throw new Error(`PDF parsing failed: ${pdfError}`)
      }
      
      // Process the extracted text with Groq
      const result = await processPdfWithGroq(pdfData.text, file.name)
      
      allTransactions = result.transacties || []
      bank = result.bank || 'Onbekend'
      accountNumber = result.rekeningnummer || ''
      
    } else {
      // For images, we can't use pdf-parse
      // Return error for now - images not supported in this version
      return NextResponse.json({
        error: 'Alleen PDF bestanden worden ondersteund',
        details: 'Upload een PDF bankafschrift. Afbeeldingen worden momenteel niet ondersteund.'
      }, { status: 400 })
    }

    console.log(`[Vision Scanner] Total transactions extracted: ${allTransactions.length}`)

    if (allTransactions.length === 0) {
      return NextResponse.json({
        error: 'Geen transacties gevonden',
        details: 'De AI kon geen transacties herkennen in dit document.',
        tip: 'Zorg dat het PDF bankafschrift duidelijk leesbaar is en financiële data bevat.'
      }, { status: 400 })
    }

    // APPLY AUTOMATIC CATEGORIZATION
    let transactions = categorizeTransactions(allTransactions)
    
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
    console.error('[Vision Scanner] ERROR CAUGHT:')
    console.error('[Vision Scanner] Error message:', error.message)
    console.error('[Vision Scanner] Error name:', error.name)
    console.error('[Vision Scanner] Error stack:', error.stack)
    
    return NextResponse.json({ 
      error: 'Verwerking mislukt', 
      message: error.message,
      type: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// Helper function to sanitize values for Excel
function sanitizeValue(value: any): any {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' && isNaN(value)) return 0;
  if (value === 'NaN') return 0;
  if (typeof value === 'string' && value.toLowerCase() === 'nan') return 0;
  return value;
}

// EXCEL EXPORT
export async function PUT(req: NextRequest) {
  try {
    const { transactions, bank = 'Onbekend' } = await req.json()
    
    const categorizedTransactions = categorizeTransactions(transactions)
    
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'BSC Pro'
    workbook.lastModifiedBy = 'BSC Pro'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    // Colors
    const HEADER_COLOR = 'FF1E3A5F' // Dark blue
    const INCOME_COLOR = 'FF059669' // Green
    const EXPENSE_COLOR = 'FFDC2626' // Red
    const ALT_ROW_COLOR = 'FFF3F4F6' // Light gray
    
    // ========== TRANSACTIONS SHEET ==========
    const wsTrans = workbook.addWorksheet('Transacties')
    
    // Freeze top row
    wsTrans.views = [{ state: 'frozen', ySplit: 1 }]
    
    // Define columns with headers
    wsTrans.columns = [
      { header: 'Datum', key: 'datum', width: 12 },
      { header: 'Omschrijving', key: 'omschrijving', width: 50 },
      { header: 'Categorie', key: 'categorie', width: 25 },
      { header: 'Bedrag', key: 'bedrag', width: 15 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'BTW %', key: 'btwPerc', width: 10 },
      { header: 'BTW Bedrag', key: 'btwBedrag', width: 15 }
    ]
    
    // Style header row
    const headerRow = wsTrans.getRow(1)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } }
      }
    })
    
    // Calculate totals
    const totalIn = categorizedTransactions
      .filter((t: any) => (sanitizeValue(t.bedrag) as number) > 0)
      .reduce((sum: number, t: any) => sum + (sanitizeValue(t.bedrag) as number), 0)
    
    const totalOut = categorizedTransactions
      .filter((t: any) => (sanitizeValue(t.bedrag) as number) < 0)
      .reduce((sum: number, t: any) => sum + Math.abs(sanitizeValue(t.bedrag) as number), 0)
    
    // Add transaction rows
    categorizedTransactions.forEach((t: any, index: number) => {
      const bedrag = sanitizeValue(t.bedrag) as number
      const isIncome = bedrag > 0
      const absBedrag = Math.abs(bedrag)
      
      const btwRate = sanitizeValue(t.btw?.rate) || 0
      const btwAmount = (btwRate as number) > 0 ? absBedrag * ((btwRate as number) / (100 + (btwRate as number))) : 0
      
      const row = wsTrans.addRow({
        datum: sanitizeValue(t.datum),
        omschrijving: sanitizeValue(t.omschrijving),
        categorie: `${sanitizeValue(t.categoryEmoji) || ''} ${sanitizeValue(t.categoryName) || 'Overig'}`,
        bedrag: absBedrag,
        type: isIncome ? 'Inkomst' : 'Uitgave',
        btwPerc: `${btwRate}%`,
        btwBedrag: btwAmount
      })
      
      // Alternating row colors
      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ALT_ROW_COLOR } }
        })
      }
      
      // Style amount column
      const bedragCell = row.getCell(4)
      bedragCell.numFmt = '€#,##0.00'
      bedragCell.font = { color: { argb: isIncome ? INCOME_COLOR : EXPENSE_COLOR } }
      
      // Style BTW amount
      const btwCell = row.getCell(7)
      btwCell.numFmt = '€#,##0.00'
    })
    
    // ========== SUMMARY SHEET ==========
    const wsSummary = workbook.addWorksheet('Samenvatting')
    wsSummary.views = [{ state: 'frozen', ySplit: 1 }]
    
    // Title
    wsSummary.mergeCells('A1:D1')
    wsSummary.getCell('A1').value = 'BSC Pro - Bankafschrift Samenvatting'
    wsSummary.getCell('A1').font = { bold: true, size: 16, color: { argb: HEADER_COLOR } }
    wsSummary.getCell('A1').alignment = { horizontal: 'center' }
    
    wsSummary.mergeCells('A2:D2')
    wsSummary.getCell('A2').value = `Bank: ${bank} | ${new Date().toLocaleDateString('nl-NL')}`
    wsSummary.getCell('A2').alignment = { horizontal: 'center' }
    wsSummary.getCell('A2').font = { italic: true }
    
    // Financial summary
    let currentRow = 4
    
    wsSummary.getCell(`A${currentRow}`).value = 'FINANCIEEL OVERZICHT'
    wsSummary.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
    currentRow++
    
    wsSummary.getCell(`A${currentRow}`).value = 'Totaal Inkomsten:'
    wsSummary.getCell(`B${currentRow}`).value = totalIn
    wsSummary.getCell(`B${currentRow}`).numFmt = '€#,##0.00'
    wsSummary.getCell(`B${currentRow}`).font = { color: { argb: INCOME_COLOR } }
    currentRow++
    
    wsSummary.getCell(`A${currentRow}`).value = 'Totaal Uitgaven:'
    wsSummary.getCell(`B${currentRow}`).value = totalOut
    wsSummary.getCell(`B${currentRow}`).numFmt = '€#,##0.00'
    wsSummary.getCell(`B${currentRow}`).font = { color: { argb: EXPENSE_COLOR } }
    currentRow++
    
    wsSummary.getCell(`A${currentRow}`).value = 'Saldo:'
    wsSummary.getCell(`B${currentRow}`).value = totalIn - totalOut
    wsSummary.getCell(`B${currentRow}`).numFmt = '€#,##0.00'
    wsSummary.getCell(`B${currentRow}`).font = { bold: true }
    wsSummary.getCell(`A${currentRow}`).font = { bold: true }
    currentRow += 2
    
    // Category breakdown
    wsSummary.getCell(`A${currentRow}`).value = 'VERDELING PER CATEGORIE'
    wsSummary.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
    currentRow++
    
    // Headers
    wsSummary.getCell(`A${currentRow}`).value = 'Categorie'
    wsSummary.getCell(`B${currentRow}`).value = 'Aantal'
    wsSummary.getCell(`C${currentRow}`).value = 'Totaal'
    wsSummary.getCell(`D${currentRow}`).value = 'Percentage'
    
    const catHeaderRow = wsSummary.getRow(currentRow)
    catHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } }
    })
    currentRow++
    
    // Category data
    const categorySummary = getCategorySummary(categorizedTransactions)
    categorySummary.forEach((cat: any, idx: number) => {
      wsSummary.getCell(`A${currentRow}`).value = `${cat.category.emoji} ${cat.category.name}`
      wsSummary.getCell(`B${currentRow}`).value = sanitizeValue(cat.count)
      wsSummary.getCell(`C${currentRow}`).value = sanitizeValue(cat.total)
      wsSummary.getCell(`C${currentRow}`).numFmt = '€#,##0.00'
      wsSummary.getCell(`D${currentRow}`).value = `${sanitizeValue(cat.percentage)}%`
      
      if (idx % 2 === 1) {
        const row = wsSummary.getRow(currentRow)
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ALT_ROW_COLOR } }
        })
      }
      currentRow++
    })
    
    // Set column widths
    wsSummary.getColumn('A').width = 30
    wsSummary.getColumn('B').width = 12
    wsSummary.getColumn('C').width = 18
    wsSummary.getColumn('D').width = 15
    
    // ========== BTW SHEET ==========
    const wsBtw = workbook.addWorksheet('BTW Overzicht')
    wsBtw.views = [{ state: 'frozen', ySplit: 1 }]
    
    wsBtw.mergeCells('A1:D1')
    wsBtw.getCell('A1').value = 'BTW Overzicht'
    wsBtw.getCell('A1').font = { bold: true, size: 16, color: { argb: HEADER_COLOR } }
    wsBtw.getCell('A1').alignment = { horizontal: 'center' }
    
    wsBtw.columns = [
      { key: 'tarief', width: 15 },
      { key: 'omschrijving', width: 30 },
      { key: 'totaal', width: 18 },
      { key: 'btw', width: 18 }
    ]
    
    // Headers
    const btwHeaders = ['BTW Tarief', 'Omschrijving', 'Totaal bedrag', 'BTW Bedrag']
    btwHeaders.forEach((h, i) => {
      const cell = wsBtw.getCell(2, i + 1)
      cell.value = h
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } }
    })
    
    const btwSummary = getBTWSummary(categorizedTransactions)
    let totalBTW = 0
    
    btwSummary.forEach((btw: any, idx: number) => {
      const rowNum = idx + 3
      const btwAmt = parseFloat(sanitizeValue(btw.btwAmountFormatted) as string) || 0
      totalBTW += btwAmt
      
      wsBtw.getCell(rowNum, 1).value = `${sanitizeValue(btw.rate)}%`
      wsBtw.getCell(rowNum, 2).value = sanitizeValue(btw.description)
      wsBtw.getCell(rowNum, 3).value = sanitizeValue(btw.total)
      wsBtw.getCell(rowNum, 3).numFmt = '€#,##0.00'
      wsBtw.getCell(rowNum, 4).value = btwAmt
      wsBtw.getCell(rowNum, 4).numFmt = '€#,##0.00'
      
      if (idx % 2 === 1) {
        const row = wsBtw.getRow(rowNum)
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ALT_ROW_COLOR } }
        })
      }
    })
    
    // Total row
    const totalRowNum = btwSummary.length + 4
    wsBtw.getCell(totalRowNum, 2).value = 'TOTAAL BTW:'
    wsBtw.getCell(totalRowNum, 2).font = { bold: true }
    wsBtw.getCell(totalRowNum, 4).value = totalBTW
    wsBtw.getCell(totalRowNum, 4).numFmt = '€#,##0.00'
    wsBtw.getCell(totalRowNum, 4).font = { bold: true, color: { argb: INCOME_COLOR } }
    
    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer()
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="BSC-PRO-${bank}-Scan.xlsx"`
      }
    })

  } catch (error: any) {
    console.error('Excel export error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// MT940 EXPORT
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
