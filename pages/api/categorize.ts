import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { categorizeTransaction } from '@/lib/merchantCategories'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Categoriseer een omschrijving
  if (req.method === 'GET') {
    const { q } = req.query
    const omschrijving = (q || '') as string
    
    if (!omschrijving) {
      return res.status(400).json({ error: 'Omschrijving is verplicht (parameter: q)' })
    }

    try {
      // Check eerst de user corrections database
      const { data: corrections } = await supabase
        .from('merchant_corrections')
        .select('*')
        .eq('goedgekeurd', true)
        .order('gebruik_count', { ascending: false })

      if (corrections?.length) {
        const lower = omschrijving.toLowerCase()
        for (const correction of corrections) {
          if (lower.includes(correction.keyword.toLowerCase())) {
            // Update gebruik count
            await supabase
              .from('merchant_corrections')
              .update({ gebruik_count: correction.gebruik_count + 1 })
              .eq('id', correction.id)
            
            return res.status(200).json({
              categorie: correction.categorie,
              subcategorie: correction.subcategorie,
              btw: correction.btw,
              icon: correction.icon,
              source: 'community',
              confidence: 'high'
            })
          }
        }
      }

      // Fallback naar lokale database
      const result = categorizeTransaction(omschrijving)
      return res.status(200).json({
        ...result,
        source: 'local',
        confidence: 'medium'
      })
    } catch (error: any) {
      console.error('Categorize GET error:', error)
      const result = categorizeTransaction(omschrijving)
      return res.status(200).json({
        ...result,
        source: 'local',
        confidence: 'low'
      })
    }
  }

  // POST: Sla een correctie op
  if (req.method === 'POST') {
    try {
      const authHeader = req.headers.authorization
      let userId = null
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabase.auth.getUser(token)
        userId = user?.id
      }

      const { omschrijving, categorie, subcategorie, btw, icon } = req.body

      if (!omschrijving || !categorie) {
        return res.status(400).json({ 
          error: 'Omschrijving en categorie zijn verplicht' 
        })
      }

      // Extraheer keyword uit omschrijving (eerste 3 woorden, zonder stopwoorden)
      const stopWords = ['van', 'der', 'den', 'de', 'het', 'een', 'en', 'met', 'voor', 'op', 'aan', 'bij', 'te', 'is', 'met', 'vanaf', 'tot', 'per', 'via', 'door', 'naar']
      const words = omschrijving.toLowerCase().split(/\s+/).filter((w: string) => 
        w.length > 2 && !stopWords.includes(w)
      )
      const keyword = words.slice(0, 3).join(' ') || omschrijving.toLowerCase().substring(0, 40)

      // Check of deze keyword al bestaat
      const { data: existing } = await supabase
        .from('merchant_corrections')
        .select('*')
        .ilike('keyword', keyword)
        .single()

      if (existing) {
        // Update bestaande correctie
        const { data, error } = await supabase
          .from('merchant_corrections')
          .update({
            categorie,
            subcategorie: subcategorie || existing.subcategorie,
            btw: btw || existing.btw,
            icon: icon || existing.icon,
            gebruik_count: existing.gebruik_count + 1,
            goedgekeurd: existing.gebruik_count >= 2 // Auto-approve na 3 gebruikers
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error

        return res.status(200).json({
          success: true,
          message: 'Correctie bijgewerkt',
          data,
          isNew: false
        })
      }

      // Voeg nieuwe correctie toe
      const { data, error } = await supabase
        .from('merchant_corrections')
        .insert({
          keyword,
          categorie,
          subcategorie: subcategorie || '',
          btw: btw || '21%',
          icon: icon || '📋',
          toegevoegd_door: userId,
          goedgekeurd: true, // Direct goedkeuren voor nu
          gebruik_count: 1
        })
        .select()
        .single()

      if (error) throw error

      return res.status(201).json({
        success: true,
        message: 'Nieuwe correctie toegevoegd',
        data,
        isNew: true
      })

    } catch (error: any) {
      console.error('Categorize POST error:', error)
      return res.status(500).json({ 
        error: error.message || 'Kon correctie niet opslaan' 
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
