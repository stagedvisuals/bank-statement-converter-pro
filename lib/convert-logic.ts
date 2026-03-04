import { getSupabaseAdmin } from './supabase-admin'

interface ConvertResult {
  success: boolean
  data?: any
  error?: string
  status?: number
}

export async function performConversion(
  file: File,
  userId: string,
  outputFormat: string = 'csv'
): Promise<ConvertResult> {
  try {
    const supabase = getSupabaseAdmin()

    // 1. Check credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('remaining_credits')
      .eq('user_id', userId)
      .single()

    if (creditsError || !credits || credits.remaining_credits <= 0) {
      return { success: false, error: 'Geen credits meer', status: 403 }
    }

    // 2. Lees bestand als text
    const fileBuffer = await file.arrayBuffer()
    const fileText = Buffer.from(fileBuffer).toString('base64')

    // 3. Stuur naar AI voor parsing (Groq)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert in het extraheren van transactiegegevens uit bankafschriften. Geef de data terug als JSON array met objecten: { datum, omschrijving, bedrag, saldo }. Alleen de JSON, geen tekst eromheen.'
          },
          {
            role: 'user',
            content: `Analyseer dit bankafschrift (base64 PDF) en extraheer alle transacties:\n${fileText}`
          }
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    })

    if (!groqResponse.ok) {
      const err = await groqResponse.text()
      return { success: false, error: 'AI parsing mislukt: ' + err, status: 502 }
    }

    const groqData = await groqResponse.json()
    const parsedText = groqData.choices?.[0]?.message?.content || '[]'

    // 4. Parse de JSON response
    let transactions: any[]
    try {
      // Strip eventuele markdown code blocks
      const cleaned = parsedText.replace(/```json\n|\n```/g, '')
      transactions = JSON.parse(cleaned)
    } catch {
      return { success: false, error: 'Kon AI response niet parsen als JSON', status: 500 }
    }

    // 5. Verminder credits
    await supabase
      .from('user_credits')
      .update({
        remaining_credits: credits.remaining_credits - 1,
        used_credits: (credits as any).used_credits ? (credits as any).used_credits + 1 : 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    // 6. Log conversie
    await supabase.from('conversions').insert({
      user_id: userId,
      status: 'completed',
      output_format: outputFormat,
      transaction_count: transactions.length,
      created_at: new Date().toISOString(),
    })

    return {
      success: true,
      data: {
        transactions,
        count: transactions.length,
        format: outputFormat,
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Conversie mislukt', status: 500 }
  }
}
