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

// EXCEL EXPORT
export async function PUT(req: NextRequest) {
  try {
    const { transactions, bank = 'Onbekend' } = await req.json()
    
    const categorizedTransactions = categorizeTransactions(transactions)
    
    const workbook = new ExcelJS.Workbook()
    
    const categoryColors: Record<string, string> = {
      'boodschappen': 'FFD5F4E6',
      'huur': 'FFDBEAFE',
      'salaris': 'FFD1FAE5',
      'brandstof': 'FFFEE2E2',
      'horeca': 'FFFFEDD5',
      'telecom': 'FFF3E8FF',
      'transport': 'FFCFFAFE',
      'software': 'FFE0E7FF',
      'bankkosten': 'FFF1F5F9',
      'overig': 'FFF3F4F6'
    }
    
    const worksheet = workbook.addWorksheet('Transacties')
    
    worksheet.mergeCells('A1:G1')
    worksheet.getCell('A1').value = 'BSC PRO - AI Document Scanner'
    worksheet.getCell('A1').font = { size: 18, bold: true, color: { argb: 'FF2563EB' } }
    worksheet.getCell('A1').alignment = { horizontal: 'center' }
    
    worksheet.mergeCells('A2:G2')
    worksheet.getCell('A2').value = `Bank: ${bank} | ${new Date().toLocaleDateString('nl-NL')}`
    worksheet.getCell('A2').alignment = { horizontal: 'center' }

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

    const headers = ['Datum', 'Omschrijving', 'Categorie', 'Bedrag', 'Type', 'BTW %', 'BTW Bedrag']
    const headerRow = worksheet.getRow(6)
    headers.forEach((h, i) => {
      headerRow.getCell(i + 1).value = h
      headerRow.getCell(i + 1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      headerRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    })

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
      
      const btwRate = t.btw?.rate || 0
      const amount = Math.abs(t.bedrag || 0)
      const btwAmount = btwRate > 0 ? amount * btwRate / (100 + btwRate) : 0
      row.getCell(7).value = btwAmount
      row.getCell(7).numFmt = '€#,##0.00'
      
      row.getCell(4).font = { color: { argb: isIncome ? 'FF059669' : 'FFDC2626' } }
      
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

    const summarySheet = workbook.addWorksheet('Samenvatting')
    
    summarySheet.mergeCells('A1:D1')
    summarySheet.getCell('A1').value = '📊 Categorie Samenvatting'
    summarySheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FF2563EB' } }
    
    summarySheet.mergeCells('A2:D2')
    summarySheet.getCell('A2').value = `Totaal: ${categorizedTransactions.length} transacties`
    summarySheet.getCell('A2').font = { italic: true }
    
    const sumHeaders = ['Categorie', 'Aantal', 'Totaal', 'Percentage']
    const sumHeaderRow = summarySheet.getRow(4)
    sumHeaders.forEach((h, i) => {
      sumHeaderRow.getCell(i + 1).value = h
      sumHeaderRow.getCell(i + 1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      sumHeaderRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    })
    
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

    const btwSheet = workbook.addWorksheet('BTW overzicht')
    
    btwSheet.mergeCells('A1:D1')
    btwSheet.getCell('A1').value = '🏦 BTW Overzicht'
    btwSheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FF2563EB' } }
    
    btwSheet.mergeCells('A2:D2')
    btwSheet.getCell('A2').value = 'Klaar voor je BTW-aangifte!'
    btwSheet.getCell('A2').font = { italic: true, color: { argb: 'FF059669' } }
    
    const btwHeaders = ['BTW Tarief', 'Omschrijving', 'Totaal bedrag', 'BTW Bedrag']
    const btwHeaderRow = btwSheet.getRow(4)
    btwHeaders.forEach((h, i) => {
      btwHeaderRow.getCell(i + 1).value = h
      btwHeaderRow.getCell(i + 1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      btwHeaderRow.getCell(i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } }
    })
    
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
