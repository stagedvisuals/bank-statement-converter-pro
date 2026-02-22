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

ANTWOORD ALTIJD IN HET NEDERLANDS.

Voorbeeld vragen die je kunt beantwoorden:
- "Hoe werkt het?" → Leg de 3 stappen uit (upload, AI analyse, download)
- "Is het veilig?" → Leg GDPR compliance en 24u delete uit
- "Welke banken?" → Noem de belangrijkste Nederlandse banken
- "Hoeveel kost het?" → Leg de 3 prijzen uit
- "Wat is smart categorisatie?" → Leg uit dat AI automatisch categorieën toewijst`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, sessionId, history } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

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

      let conversationId = conversation?.id

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

    // Call AI API (Moonshot/Kimi)
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-5), // Keep last 5 messages for context
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error('AI API error')
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, ik kon je vraag niet verwerken.'

    // Store AI response in database
    if (supabaseUrl && supabaseServiceKey && sessionId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('session_id', sessionId)
        .single()

      if (conversation?.id) {
        await supabase.from('chat_messages').insert({
          conversation_id: conversation.id,
          role: 'assistant',
          content: aiResponse
        })
      }
    }

    return res.status(200).json({ response: aiResponse })

  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ 
      response: 'Sorry, er is een technische storing. Probeer het later opnieuw of neem contact op via support@bscpro.ai.'
    })
  }
}
