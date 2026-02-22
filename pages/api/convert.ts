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

// AI Logic Engine - Categorization Rules
const CATEGORIES = {
  HUISVESTING: ['huur', 'hypotheek', 'vve', 'gas', 'water', 'elektra', 'stroom', 'nutsbedrijf', 'huishoudelijk'],
  MARKETING: ['marketing', 'advertising', 'google ads', 'facebook', 'linkedin', 'instagram', 'promotie', 'reclame', 'seo'],
  SOFTWARE_SAAS: ['software', 'saas', 'subscription', 'abonnement', 'licentie', 'license', 'cloud', 'hosting', 'domain'],
  PERSONEEL: ['salaris', 'loon', 'werknemer', 'uitzendbureau', 'detacheren', 'payroll', 'pensioen'],
  BELASTINGEN: ['belasting', 'btw', 'inkomstenbelasting', 'vennootschapsbelasting', 'douane', 'toeslag'],
  REISKOSTEN: ['trein', 'ns', 'vliegtuig', 'hotel', 'overnachting', 'taxi', 'uber', 'parkeren', 'tanken', 'shell'],
  VERZEKERINGEN: ['verzekering', 'aansprakelijkheid', 'rechtsbijstand', 'zorg', 'auto'],
  INKOOP: ['inkoop', 'voorraad', 'leverancier', 'groothandel', 'magazijn'],
  FINANCIEEL: ['bankkosten', 'transactiekosten', 'rente', 'krediet', 'lening'],
  OVERIG: []
}

// AI Logic Engine - Analyze transaction description and assign category
function categorizeTransaction(description: string, counterAccount?: string): string {
  const text = (description + ' ' + (counterAccount || '')).toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (category === 'OVERIG') continue
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }
  return 'OVERIG'
}

// AI Logic Engine - Detect duplicates and fraud patterns
function analyzeFraudRisk(transactions: any[]): any[] {
  const analyzed = transactions.map((t, index) => {
    let riskScore = 0
    const warnings: string[] = []
    
    // Check for duplicates within 48 hours
    const currentDate = new Date(t.datum || t.date || '2026-01-01')
    const currentAmount = parseFloat(t.bedrag || t.amount || 0)
    const currentDesc = (t.omschrijving || t.description || '').toLowerCase()
    
    for (let i = 0; i < transactions.length; i++) {
      if (i === index) continue
      
      const otherDate = new Date(transactions[i].datum || transactions[i].date || '2026-01-01')
      const otherAmount = parseFloat(transactions[i].bedrag || transactions[i].amount || 0)
      const otherDesc = (transactions[i].omschrijving || transactions[i].description || '').toLowerCase()
      
      // Same amount within 48 hours
      const hoursDiff = Math.abs(currentDate.getTime() - otherDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff <= 48 && Math.abs(currentAmount) === Math.abs(otherAmount)) {
        // Check if descriptions are similar or accounts match
        const descSimilarity = calculateSimilarity(currentDesc, otherDesc)
        
        if (descSimilarity > 0.7 || t.tegenrekening === transactions[i].tegenrekening) {
          riskScore += 40
          warnings.push('Potential Duplicate - Same amount within 48h')
        }
      }
    }
    
    // Check for round amounts (potential manual errors)
    if (currentAmount % 100 === 0 && currentAmount > 500) {
      riskScore += 10
      warnings.push('Round amount - verify manually')
    }
    
    // Check for missing description
    if (!t.omschrijving && !t.description) {
      riskScore += 20
      warnings.push('Missing description')
    }
    
    return {
      ...t,
      category: categorizeTransaction(t.omschrijving || t.description || '', t.tegenrekening),
      fraud_risk_score: Math.min(riskScore, 100),
      fraud_warnings: warnings,
      confidence: calculateConfidence(t),
      status: riskScore > 30 ? 'SUSPICIOUS' : riskScore > 10 ? 'WARNING' : 'OK'
    }
  })
  
  return analyzed
}

// AI Logic Engine - Calculate confidence score
function calculateConfidence(transaction: any): number {
  let confidence = 95
  
  // Deduct for missing fields
  if (!transaction.datum && !transaction.date) confidence -= 20
  if (!transaction.omschrijving && !transaction.description) confidence -= 15
  if (!transaction.bedrag && !transaction.amount) confidence -= 25
  
  // Deduct for unclear amounts
  const amount = parseFloat(transaction.bedrag || transaction.amount || 0)
  if (isNaN(amount)) confidence -= 30
  
  // Deduct for very long descriptions (might be garbled)
  const desc = (transaction.omschrijving || transaction.description || '').length
  if (desc > 200) confidence -= 10
  
  return Math.max(confidence, 0)
}

// Helper - String similarity for duplicate detection
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[str2.length][str1.length]
}

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

    // Send to Kimi API for processing with enhanced system prompt
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
            content: `Je bent een geavanceerde bankafschrift parser met AI Intelligence.
            
EXTRAHEER alle transacties met de volgende velden:
- datum (DD-MM-YYYY format)
- omschrijving (transactie beschrijving)
- bedrag (numeriek, positief voor bijschrijving, negatief voor afschrijving)
- saldo (optioneel, lopende saldo)
- tegenrekening (IBAN of rekeningnummer indien zichtbaar)

Return ALLEEN een JSON array met transactie objecten. Geen extra tekst.`
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

    // Apply AI Logic Engine
    const analyzedTransactions = analyzeFraudRisk(transactions)
    
    // Calculate summary statistics
    const categories: Record<string, number> = {}
    let totalExpenses = 0
    let totalIncome = 0
    let suspiciousCount = 0
    
    analyzedTransactions.forEach((t: any) => {
      const amount = parseFloat(t.bedrag || t.amount || 0)
      
      // Category totals
      categories[t.category] = (categories[t.category] || 0) + Math.abs(amount)
      
      // Income vs Expense
      if (amount > 0) {
        totalIncome += amount
      } else {
        totalExpenses += Math.abs(amount)
      }
      
      // Suspicious count
      if (t.status === 'SUSPICIOUS' || t.fraud_risk_score > 30) {
        suspiciousCount++
      }
    })
    
    // Find biggest expense category
    const biggestCategory = Object.entries(categories)
      .sort((a, b) => (b[1] as number) - (a[1] as number))[0]

    return res.status(200).json({
      success: true,
      transactions: analyzedTransactions,
      count: analyzedTransactions.length,
      summary: {
        totalIncome,
        totalExpenses,
        netResult: totalIncome - totalExpenses,
        categories,
        biggestCategory: biggestCategory ? {
          name: biggestCategory[0],
          amount: biggestCategory[1]
        } : null,
        suspiciousCount
      },
      raw: aiResponse,
    })

  } catch (error: any) {
    console.error('Conversion error:', error)
    return res.status(500).json({ 
      error: error.message || 'Conversion failed' 
    })
  }
}
