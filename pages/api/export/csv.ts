import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transactions, bank, rekeningnummer } = req.body;
    if (!transactions?.length) return res.status(400).json({ error: 'Geen transacties' });

    // BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    
    // Headers met categorisatie
    const headers = ['Datum', 'Omschrijving', 'Categorie', 'Grootboek', 'BTW_Percentage', 'Bedrag', 'Saldo', 'IBAN', 'Tegenrekening', 'Methode'];
    let csv = BOM + headers.join(';') + '\n';
    
    // Haal classificaties op
    const SmartCategorizationEngine = (await import('@/lib/smart-categorization')).default;
    const categorizationEngine = new SmartCategorizationEngine(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const classifications = await categorizationEngine.classifyTransactions(
      transactions,
      req.body.user?.id || 'anonymous'
    );
    
    let runningBalance = 0;
    transactions.forEach((t: any) => {
      runningBalance += t.bedrag;
      const classification = t.id ? classifications.get(t.id) : null;
      
      const row = [
        t.datum,  // DD-MM-YYYY formaat
        `"${t.omschrijving?.replace(/"/g, '""')}"`,  // Escape quotes
        classification?.category_name || t.categoryName || t.category || 'Niet geclassificeerd',
        classification?.grootboek_code || '',  // Grootboekrekening
        classification?.btw_percentage || t.btw?.rate || 21,
        t.bedrag.toFixed(2),  // Punt als decimaal
        runningBalance.toFixed(2),
        rekeningnummer || '',
        '',  // Tegenrekening
        classification?.method === 'rule_match' ? 'Automatisch' : 'Handmatig'
      ];
      csv += row.join(';') + '\n';
    });
    
    // Filename
    const now = new Date();
    const month = now.toLocaleString('nl-NL', { month: 'long' });
    const year = now.getFullYear();
    const filename = `${bank || 'Bank'}_transacties_${month}_${year}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error: any) {
    console.error('CSV export error:', error);
    return res.status(500).json({ error: error.message || 'Export mislukt' });
  }
}
