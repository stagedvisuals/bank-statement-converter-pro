import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import formidable from 'formidable'
import fs from 'fs'
import pdfParse from 'pdf-parse'

// Disable body parser for file upload
export const config = {
  api: {
    bodyParser: false,
  },
}

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY
const MOONSHOT_BASE_URL = 'https://api.moonshot.cn/v1'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = getAuth(req)
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Parse form with file
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    const [fields, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('PDF file received:', file.originalFilename || file.newFilename)

    // Read PDF content using pdf-parse
    let pdfText = ''
    try {
      const dataBuffer = fs.readFileSync(file.filepath)
      const pdfData = await pdfParse(dataBuffer)
      pdfText = pdfData.text
      fs.unlinkSync(file.filepath)
      console.log('PDF parsed successfully, text length:', pdfText.length)
    } catch (parseError: any) {
      fs.unlinkSync(file.filepath)
      console.error('PDF parsing error:', parseError)
      return res.status(400).json({ 
        error: 'PDF parsing failed',
        details: parseError.message 
      })
    }

    // Send to Kimi API for processing
    const response = await fetch(`${MOONSHOT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'Je bent een bankafschrift parser. Extraheer alle transacties en return als JSON met format: [{"datum": "DD-MM-YYYY", "omschrijving": "string", "bedrag": "99.99", "saldo": "999.99"}]'
          },
          {
            role: 'user',
            content: `Parse dit bankafschrift en return alleen JSON:\n\n${pdfText.substring(0, 5000)}`
          }
        ],
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Kimi API error:', error)
      return res.status(500).json({ error: 'AI processing failed' })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || ''

    // Extract JSON from response
    let transactions = []
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        transactions = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('JSON parse error:', e)
    }

    return res.status(200).json({
      success: true,
      transactions,
      count: transactions.length,
      raw: aiResponse,
    })

  } catch (error: any) {
    console.error('Conversion error:', error)
    return res.status(500).json({ 
      error: error.message || 'Conversion failed' 
    })
  }
}
