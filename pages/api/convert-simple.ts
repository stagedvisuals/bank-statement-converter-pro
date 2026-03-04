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
    console.log('Convert simple endpoint called');
    
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
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
    
    // Read file
    const fileBuffer = fs.readFileSync(tempFilePath)
    console.log(`File received: ${file.originalFilename}, size: ${fileBuffer.length} bytes`);
    
    // For testing, use simple text instead of PDF parsing
    let extractedText = "Test bank statement text\nDatum: 2024-01-15\nBeschrijving: Albert Heijn\nBedrag: -85.43\n\nDatum: 2024-01-16\nBeschrijving: Salaris\nBedrag: 2500.00";
    
    // Initialize Groq
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not set');
    }
    
    const groq = new Groq({
      apiKey: groqApiKey
    })
    
    console.log('Groq initialized, calling API...');
    
    // Simple prompt for testing
    const prompt = `Analyseer deze banktransacties en geef ze terug als JSON:
${extractedText}

Geef alleen JSON terug in dit formaat:
{
  "bank": "Test Bank",
  "rekeninghouder": "Test User",
  "periode": { "van": "2024-01-01", "tot": "2024-01-31" },
  "transacties": [
    {
      "datum": "YYYY-MM-DD",
      "omschrijving": "schone omschrijving",
      "bedrag": -85.43,
      "tegenrekening": "",
      "categorie": "Boodschappen",
      "subcategorie": "Supermarkt",
      "btw_percentage": "9%"
    }
  ],
  "saldoStart": 1000.00,
  "saldoEind": 3414.57
}`;
    
    // Call Groq API with NEW MODEL (llama-3.3-70b-versatile)
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',  // Updated model
      temperature: 0.1,
      max_tokens: 2000,
    })
    
    const responseText = completion.choices[0]?.message?.content || '{}'
    console.log('Groq response received');
    
    // Parse JSON response
    let parsedData;
    try {
      // Extract JSON from response (might have markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', responseText);
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
      debug: {
        textLength: extractedText.length,
        model: 'llama-3.3-70b-versatile',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Convert simple error:', error.message, error.stack);
    
    // Better error messages
    if (error.message?.includes('Groq') || error.message?.includes('API key')) {
      return res.status(503).json({ 
        error: 'AI service niet beschikbaar. Check API key.', 
        errorType: 'ai_service_error',
        hint: 'GROQ_API_KEY=' + (process.env.GROQ_API_KEY ? 'SET' : 'NOT SET')
      })
    }
    
    return res.status(500).json({ 
      error: 'Fout: ' + error.message,
      errorType: 'internal_error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  } finally {
    // Cleanup
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
      } catch (e) {
        console.error('Error deleting temp file:', e)
      }
    }
  }
}
