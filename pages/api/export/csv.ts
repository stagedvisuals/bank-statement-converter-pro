import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, rekeninghouder, bank, rekeningnummer } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    // BOM voor Excel compatibiliteit
    const BOM = '\uFEFF'
    
    const headers = [
      'Datum',
      'Omschrijving',
      'Categorie',
      'Subcategorie',
      'Type',
      'Bedrag',
      'BTW %',
      'Bank',
      'Rekeninghouder'
    ].join(',')

    const rows = transactions.map((t: any) => {
      const bedrag = typeof t.bedrag === 'number' ? t.bedrag : parseFloat(t.bedrag) || 0
      const type = bedrag >= 0 ? 'Inkomst' : 'Uitgave'
      // Verwijder emoji uit categorieën voor CSV compatibiliteit
      const categorie = (t.categorie || 'Overig').replace(/[☀-➿⭐⭕　-〿㊗㊙ἀ4ἌF἗0-ἥ1ἰ0-ὟFὠ0-ὤFὨ0-ὯF὾0-὿Fᾀ-ᾏFᾐ0-ᾟFᾠ0-ᾦFᾧ0-ᾯF]/g, '').trim()
      const subcategorie = (t.subcategorie || '').replace(/[☀-➿⭐⭕　-〿㊗㊙ἀ4ἌF἗0-ἥ1ἰ0-ὟFὠ0-ὤFὨ0-ὯF὾0-὿Fᾀ-ᾏFᾐ0-ᾟFᾠ0-ᾦFᾧ0-ᾯF]/g, '').trim()
      
      return [
        t.datum || '',
        `"${(t.omschrijving || '').replace(/"/g, '""')}"`,
        `"${categorie}"`,
        `"${subcategorie}"`,
        type,
        bedrag.toFixed(2),
        t.btw_percentage || t.btw || '21%',
        bank || '',
        rekeninghouder || ''
      ].join(',')
    })

    const csv = BOM + [headers, ...rows].join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="BSCPro-${new Date().toISOString().split('T')[0]}.csv"`)
    res.setHeader('Cache-Control', 'no-cache')
    res.status(200).send(csv)
    
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
