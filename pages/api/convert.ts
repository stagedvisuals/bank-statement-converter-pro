import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import Groq from 'groq-sdk'

export const config = { api: { bodyParser: false } }

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

/**
 * Extract text from PDF with fallback methods
 * Method 1: pdf-parse (faster, works for most PDFs)
 * Method 2: pdfjs-dist (more robust, handles complex PDFs)
 */
const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  // Method 1: Try pdf-parse first
  try {
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer, { max: 0 })
    if (data.text && data.text.trim().length > 50) {
      console.log('PDF parsed with pdf-parse, length:', data.text.length)
      return data.text
    }
    throw new Error('Insufficient text with pdf-parse')
  } catch (e1: any) {
    console.log('pdf-parse failed:', e1.message)
    
    // Method 2: Fallback to pdfjs-dist
    try {
      console.log('Trying pdfjs-dist fallback...')
      const pdfjsLib = await import('pdfjs-dist').then(m => m.default || m)
      
      // Disable worker for serverless environment
      pdfjsLib.GlobalWorkerOptions.workerSrc = ''
      
      const loadingTask = pdfjsLib.getDocument({ 
        data: new Uint8Array(buffer),
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      })
      
      const pdf = await loadingTask.promise
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }
      
      if (fullText.trim().length > 50) {
        console.log('PDF parsed with pdfjs-dist, length:', fullText.length)
        return fullText
      }
      throw new Error('No text extracted with pdfjs-dist')
    } catch (e2: any) {
      console.error('pdfjs-dist also failed:', e2.message)
      throw new Error(`PDF parsing failed: ${e2.message}`)
    }
  }
}

const PROMPT = `Je bent een expert in het lezen van Nederlandse bankafschriften. Analyseer de tekst hieronder en extraheer ALLE transacties.

Return ALLEEN dit JSON formaat, niets anders:

{
  "bank": "ING of Rabobank of ABN AMRO of SNS of Bunq of Triodos of Onbekend",
  "rekeningnummer": "NLXX...",
  "rekeninghouder": "naam",
  "periode": { "van": "YYYY-MM-DD", "tot": "YYYY-MM-DD" },
  "transacties": [
    {
      "datum": "YYYY-MM-DD",
      "omschrijving": "schone omschrijving",
      "bedrag": -85.43,
      "tegenrekening": "NLXX... of leeg",
      "categorie": "boodschappen of vervoer of kantoor of salaris of belasting of overig"
    }
  ],
  "saldoStart": 0.00,
  "saldoEind": 0.00
}

Regels:
- Positief bedrag = inkomsten/credit
- Negatief bedrag = uitgaven/debit
- datum altijd YYYY-MM-DD formaat
- bedragen als getal niet als string
- omschrijving opschonen zonder SEPA/BETALING prefixes
- als iets niet te lezen is gebruik lege string
- return ALLEEN geldige JSON, geen uitleg`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check of dit een preview request is
  const isPreview = req.headers['x-preview-mode'] === 'true'

  // Rate limiting: max 5 preview requests per uur per IP, 10 voor authenticated
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown'
  const rateLimitKey = `convert_${isPreview ? 'preview_' : ''}${ip}`
  const now = Date.now()
  const limit = isPreview ? 5 : 10

  // Simple in-memory rate limit (resets bij server restart)
  if (!global.rateLimitMap) global.rateLimitMap = new Map()
  const userRequests = global.rateLimitMap.get(rateLimitKey) || []
  const recentRequests = userRequests.filter((t: number) => now - t < 3600000)

  if (recentRequests.length >= limit) {
    return res.status(429).json({
      error: isPreview 
        ? 'Te veel preview verzoeken. Maak een account aan om verder te gaan.' 
        : 'Te veel verzoeken. Probeer over een uur opnieuw.',
      errorType: 'rate_limit'
    })
  }

  global.rateLimitMap.set(rateLimitKey, [...recentRequests, now])

  // Gebruik /tmp voor Vercel compatibility
  const form = formidable({ 
    maxFileSize: 10 * 1024 * 1024,
    uploadDir: '/tmp',
    keepExtensions: true
  })
  
  let tempFilePath: string | null = null

  try {
    const [fields, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    
    // Check preview flag uit form data
    const previewMode = fields.preview?.[0] === 'true' || isPreview

    if (!file) {
      return res.status(400).json({ error: 'Geen bestand ontvangen' })
    }

    tempFilePath = file.filepath
    console.log('Processing file:', tempFilePath, 'Size:', file.size)

    // PDF naar tekst
    const pdfBuffer = fs.readFileSync(tempFilePath)
    
    // Extract text using robust method with fallback
    const pdfText = await extractTextFromPDF(pdfBuffer)

    console.log('PDF text extracted, length:', pdfText?.length || 0)

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({ 
        error: 'PDF kon niet worden gelezen. Probeer een andere PDF.',
        errorType: 'unreadable'
      })
    }

    // Groq AI aanroep
    console.log('Calling Groq API...')
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: `Bankafschrift tekst:

${pdfText.substring(0, 12000)}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4096,
    })

    const rawResponse = completion.choices[0]?.message?.content || ''
    console.log('Groq response received, length:', rawResponse.length)

    // JSON extraheren uit response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ 
        error: 'AI kon geen transacties herkennen in dit document.',
        errorType: 'no_transactions'
      })
    }

    let parsed
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('JSON parse error:', e)
      return res.status(500).json({ 
        error: 'Verwerking mislukt. Probeer opnieuw.',
        errorType: 'parse_error'
      })
    }

    if (!parsed.transacties || !Array.isArray(parsed.transacties) || parsed.transacties.length === 0) {
      return res.status(400).json({ 
        error: 'Geen transacties gevonden in dit document.',
        errorType: 'no_transactions'
      })
    }

    // Kwaliteitschecks
    const warnings: string[] = []
    if (parsed.transacties.length < 3) {
      warnings.push('Weinig transacties gevonden – controleer of de PDF leesbaar is')
    }
    if (!parsed.rekeningnummer || parsed.rekeningnummer === '') {
      warnings.push('Rekeningnummer niet gevonden')
    }
    if (parsed.bank === 'Onbekend') {
      warnings.push('Bank niet herkend – resultaat kan afwijken')
    }

    // Voor preview mode: return direct het resultaat zonder extra wrapper
    if (previewMode) {
      return res.status(200).json({
        ...parsed,
        _preview: true,
        transactieCount: parsed.transacties.length,
        warnings: warnings
      })
    }

    // Voor authenticated mode: return met wrapper
    return res.status(200).json({
      success: true,
      data: parsed,
      transactieCount: parsed.transacties.length,
      warnings: warnings
    })

  } catch (error: any) {
    console.error('Convert error:', error)
    console.error('Error stack:', error.stack)
    
    if (error.message?.includes('password')) {
      return res.status(400).json({ 
        error: 'PDF is beveiligd met wachtwoord.', 
        errorType: 'password_protected' 
      })
    }
    
    if (error.message?.includes('maxFileSize')) {
      return res.status(400).json({ 
        error: 'Bestand is te groot (max 10MB).', 
        errorType: 'file_too_large' 
      })
    }
    
    // PDF format errors
    if (error.message?.includes('Illegal character') || 
        error.message?.includes('FormatError') ||
        error.message?.includes('Invalid PDF') ||
        error.message?.includes('PDF parsing failed')) {
      return res.status(422).json({ 
        error: 'Dit PDF bestand kan niet worden verwerkt. Probeer een ander bestand of exporteer het PDF opnieuw vanuit je bank.', 
        errorType: 'pdf_format_error' 
      })
    }
    
    return res.status(500).json({ 
      error: 'Er is iets misgegaan. Probeer het opnieuw.', 
      errorType: 'unknown',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  } finally {
    // Verwijder temp bestand altijd (AVG compliance)
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
      console.log('Temp file cleaned up:', tempFilePath)
    }
  }
}
