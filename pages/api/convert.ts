import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import Groq from 'groq-sdk'

export const config = { api: { bodyParser: false } }

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 })
  let tempFilePath: string | null = null

  try {
    const [, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      return res.status(400).json({ error: 'Geen bestand ontvangen' })
    }

    tempFilePath = file.filepath

    // PDF naar tekst
    const pdfParse = require('pdf-parse')
    const pdfBuffer = fs.readFileSync(tempFilePath)
    const pdfData = await pdfParse(pdfBuffer)
    const pdfText = pdfData.text

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({ 
        error: 'PDF kon niet worden gelezen. Probeer een andere PDF.',
        errorType: 'unreadable'
      })
    }

    // Groq AI aanroep
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: `Bankafschrift tekst:\n\n${pdfText.substring(0, 12000)}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4096,
    })

    const rawResponse = completion.choices[0]?.message?.content || ''

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

    // Temp file verwijderen (AVG compliance)
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
      }
    } catch (cleanupErr) {
      console.error('[Security] Kon temp file niet verwijderen:', cleanupErr)
    }

    return res.status(200).json({
      success: true,
      data: parsed,
      transactieCount: parsed.transacties.length
    })

  } catch (error: any) {
    console.error('Convert error:', error)
    
    // Cleanup on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath) } catch {}
    }
    
    // User-friendly error messages
    const errorMessage = error.message || ''
    let userFriendlyError = 'Oeps! Er is iets misgegaan bij het verwerken van je document.'
    let errorType = 'unknown'
    
    if (errorMessage.includes('password') || errorMessage.includes('beveiligd') || errorMessage.includes('encrypted')) {
      userFriendlyError = 'Oeps! Dit document is beveiligd met een wachtwoord. Verwijder de beveiliging en probeer opnieuw.'
      errorType = 'password_protected'
    } else if (errorMessage.includes('size') || errorMessage.includes('large')) {
      userFriendlyError = 'Oeps! Dit bestand is te groot. Maximum is 10MB. Probeer te comprimeren.'
      errorType = 'file_too_large'
    }
    
    return res.status(500).json({ 
      error: userFriendlyError,
      errorType: errorType
    })
  }
}
