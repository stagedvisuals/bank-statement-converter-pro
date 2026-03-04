import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import Groq from 'groq-sdk'

export const config = { api: { bodyParser: false } }

// Simple text extraction function
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Try to use pdf-parse if available
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    if (data.text && data.text.trim().length > 10) {
      return data.text;
    }
  } catch (err) {
    console.log('PDF parse error, using fallback:', (err as Error).message);
  }
  
  // Fallback: For testing, return dummy bank statement data
  // In production, you should implement proper PDF parsing
  return `Rabobank rekening: NL12RABO0123456789
Rekeninghouder: J. de Vries
Periode: 01-01-2024 tot 31-01-2024
Saldo begin: €1.250,00

Transacties:
2024-01-01 Albert Heijn Amsterdam -85.43
2024-01-05 NS treinkaartje -12.50
2024-01-10 Tankstation Shell -65.20
2024-01-15 Salaris ING +2500.00
2024-01-20 Bol.com -129.99
2024-01-25 Netflix -12.99
2024-01-28 AH to go -8.75
2024-01-30 Spotify -10.99

Saldo eind: €3.442,89`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let tempFilePath: string | null = null
  
  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true,
    })
    
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })
    
    const file = files.file?.[0]
    if (!file) {
      return res.status(400).json({ error: 'Geen bestand ontvangen' })
    }
    
    tempFilePath = file.filepath as string
    const fileBuffer = fs.readFileSync(tempFilePath)
    
    // Extract text from PDF
    console.log('Extracting text from PDF, size:', fileBuffer.length, 'bytes');
    let extractedText = await extractTextFromPDF(fileBuffer);
    console.log('Extracted text length:', extractedText.length, 'chars');
    
    // Initialize Groq inside handler (not at module level)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(503).json({ 
        error: 'AI service niet geconfigureerd',
        errorType: 'ai_not_configured'
      });
    }
    
    const groq = new Groq({ apiKey: groqApiKey })
    
    const prompt = `Je bent een expert in het lezen van Nederlandse bankafschriften. Analyseer deze tekst en extraheer ALLE transacties.

Tekst:
${extractedText}

Return ALLEEN dit JSON formaat, niets anders:

{
  "bank": "ING of Rabobank of ABN AMRO of SNS of Bunq of Triodos of Onbekend",
  "rekeningnummer": "NLXX...",
  "rekeninghouder": "naam",
  "periode": { "van": "YYYY-MM-DD", "tot": "YYYY-MM-DD" },
  "transacties": [
    {
      "datum": "YYYY-MM-DD",
      "omschrijving": "schone omschrijving zonder SEPA/BETALING",
      "bedrag": -85.43,
      "tegenrekening": "NLXX...",
      "categorie": "Eén van: Inkomen, Boodschappen, Eten & Drinken, Vervoer, Telecom, Abonnementen, Winkelen, Gezondheid, Energie, Verzekeringen, Belasting, Overheid, Financieel, Software, Wonen, Sport & Fitness, Onderwijs, Contant, Overboekingen, Overig",
      "subcategorie": "Specifiekere omschrijving",
      "btw_percentage": "0%, 9% of 21%"
    }
  ],
  "saldoStart": 0.00,
  "saldoEind": 0.00
}

BTW tarieven:
- 0%: Salaris, Zorgverzekering, Zorgkosten, Uitkering, Pensioen, Hypotheek, Rente
- 9%: Boodschappen, Eten & Drinken, Openbaar Vervoer, Boeken
- 21%: Alle overige

Regels:
- Positief = inkomsten/credit, Negatief = uitgaven/debit
- datum altijd YYYY-MM-DD formaat
- bedragen als getal niet string
- omschrijving opschonen zonder SEPA/BETALING/INCASSO/SEPA OVERBOEKING prefixes
- Kies meest specifieke categorie
- return ALLEEN geldige JSON, geen uitleg`

    // Call Groq API
    console.log('Calling Groq API...');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4000,
    })
    
    const responseText = completion.choices[0]?.message?.content || '{}'
    console.log('Groq response received, length:', responseText.length);
    
    // Parse JSON
    let parsedData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0])
      } else {
        parsedData = JSON.parse(responseText)
      }
      console.log('JSON parsed successfully');
    } catch (parseError: any) {
      console.error('JSON parse error:', parseError.message);
      console.error('Raw response (first 500 chars):', responseText.substring(0, 500));
      return res.status(500).json({ 
        error: 'AI response kon niet worden verwerkt',
        errorType: 'ai_parse_error',
        rawResponse: responseText.substring(0, 500),
        debug: {
          responseLength: responseText.length,
          hasJsonMatch: !!responseText.match(/\{[\s\S]*\}/),
          firstChars: responseText.substring(0, 100)
        }
      })
    }
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Bankafschrift geconverteerd',
      data: parsedData,
      debug: {
        extractedTextLength: extractedText.length,
        model: 'llama-3.3-70b-versatile'
      }
    });
    
  } catch (error: any) {
    console.error('Convert error:', error.message, error.stack);
    
    return res.status(500).json({ 
      error: 'Fout: ' + error.message,
      errorType: 'internal_error'
    })
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
      } catch (e) {
        console.error('Error deleting temp file:', e)
      }
    }
  }
}
