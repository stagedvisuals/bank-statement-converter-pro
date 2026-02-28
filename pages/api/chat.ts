import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// AI System Prompt for Customer Support
const SYSTEM_PROMPT = `Je bent de BSC Pro AI Klantenservice Assistant. BSC Pro is een AI Financial Document Processor die bankafschriften, creditcards en facturen naar Excel/CSV converteert.

BELANGRIJKE INFORMATIE:
- Prijzen: Basic €2/doc, Business €15/maand (50 docs), Enterprise €30/maand (unlimited)
- Veiligheid: 24u data-delete, GDPR compliant, geen AI training op gebruikersdata
- Ondersteunde banken: ING, Rabobank, ABN AMRO, Bunq, Revolut, SNS, ASN, Triodos
- Features: Smart categorisatie, fraude detectie, business insights
- Contact: support@bscpro.ai

JOUW ROL:
1. Beantwoord vragen over hoe het werkt, veiligheid, prijzen en ondersteunde formaten
2. Help gebruikers met technische problemen (uploaden, converteren, downloaden)
3. Leg de AI features uit (smart categorisatie, fraude detectie)
4. Wees vriendelijk, professioneel en beknopt
5. Als je het antwoord niet weet, verwijs naar support@bscpro.ai

ANTWOORD ALTIJD IN HET NEDERLANDS.`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, sessionId, history } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  let conversationId: string | undefined

  try {
    // Store user message in database
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      // Get or create conversation
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('session_id', sessionId)
        .single()

      conversationId = conversation?.id

      if (!conversationId) {
        const { data: newConv } = await supabase
          .from('chat_conversations')
          .insert({ session_id: sessionId })
          .select('id')
          .single()
        conversationId = newConv?.id
      }

      // Store user message
      if (conversationId) {
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: message
        })
      }
    }

    // Check if AI is available
    const moonshotKey = process.env.MOONSHOT_API_KEY
    let aiResponse: string

    if (moonshotKey) {
      try {
        // Call AI API (Moonshot/Kimi)
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${moonshotKey}`
          },
          body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...history.slice(-5),
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        })

        if (response.ok) {
          const data = await response.json()
          aiResponse = data.choices?.[0]?.message?.content || 'Sorry, ik kon je vraag niet verwerken.'
        } else {
          // AI unavailable - use fallback
          aiResponse = getFallbackResponse(message)
        }
      } catch (error) {
        // AI error - use fallback
        aiResponse = getFallbackResponse(message)
      }
    } else {
      // No AI key - use fallback
      aiResponse = getFallbackResponse(message)
    }

    // Store AI response in database
    if (supabaseUrl && supabaseServiceKey && conversationId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse
      })
    }

    return res.status(200).json({ response: aiResponse })

  } catch (error) {
    console.error('Chat error:', error)
    return res.status(200).json({ 
      response: 'Bedankt voor je bericht! Ons support team neemt zo snel mogelijk contact met je op. Voor dringende vragen, mail naar support@bscpro.ai'
    })
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase()
  
  if (lowerMsg.includes('prijs') || lowerMsg.includes('kost') || lowerMsg.includes('euro') || lowerMsg.includes('€')) {
    return `Onze prijzen zijn:
• Basic: €2 per document (pay-as-you-go)
• Business: €15/maand (50 conversies)
• Enterprise: €30/maand (onbeperkt)

Meer info op https://bscpro.nl/#pricing`
  }
  
  if (lowerMsg.includes('veilig') || lowerMsg.includes('privacy') || lowerMsg.includes('gdpr') || lowerMsg.includes('avg')) {
    return `Ja, BSC Pro is volledig veilig:
• GDPR/AVG compliant
• 24-uurs data-delete
• AES-256 versleuteling
• Geen AI training op jouw data
• Servers binnen de EU`
  }
  
  if (lowerMsg.includes('bank') || lowerMsg.includes('ing') || lowerMsg.includes('rabobank') || lowerMsg.includes('abn')) {
    return `We ondersteunen alle Nederlandse banken:
• ING, Rabobank, ABN AMRO
• Bunq, Revolut
• SNS, ASN, Triodos
• En alle andere Nederlandse banken`
  }
  
  if (lowerMsg.includes('werkt') || lowerMsg.includes('hoe') || lowerMsg.includes('uitleg')) {
    return `Zo werkt BSC Pro:
1. Upload je PDF bankafschrift
2. Onze AI analyseert en categoriseert automatisch
3. Download je Excel/CSV bestand

Het duurt minder dan 30 seconden!`
  }
  
  if (lowerMsg.includes('hallo') || lowerMsg.includes('hi') || lowerMsg.includes('goedendag')) {
    return `Hallo! Welkom bij BSC Pro. Ik ben je AI assistent (momenteel in onderhoudsmodus). 

Ik kan je helpen met vragen over:
• Prijzen en abonnementen
• Veiligheid en privacy
• Ondersteunde banken
• Hoe het werkt

Wat wil je weten?`
  }
  
  // Default response
  return `Bedankt voor je bericht! 

Ik ben momenteel in onderhoudsmodus, maar je bericht is opgeslagen. Ons support team neemt zo snel mogelijk contact met je op.

Voor dringende vragen:
📧 support@bscpro.ai
🌐 https://bscpro.nl`
}
