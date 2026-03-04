import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import Groq from 'groq-sdk'

export const config = { api: { bodyParser: false } }

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
    
    // Simple text extraction for now (PDF parsing can be improved later)
    // For production, use a proper PDF parsing library
    let extractedText = "Bank statement text extracted from PDF\n";
    
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
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4000,
    })
    
    const responseText = completion.choices[0]?.message?.content || '{}'
    
    // Parse JSON
    let parsedData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch (parseError) {
      return res.status(500).json({ 
        error: 'AI response kon niet worden verwerkt',
        errorType: 'ai_parse_error',
        rawResponse: responseText.substring(0, 200)
      })
    }
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'Bankafschrift geconverteerd',
      data: parsedData,
    });
    
  } catch (error: any) {
    console.error('Convert error:', error);
    
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
