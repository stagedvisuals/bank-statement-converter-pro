import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transactions, bank, rekeningnummer } = req.body;
    if (!transactions?.length) return res.status(400).json({ error: 'Geen transacties' });

    // BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    
    // Headers
    const headers = ['Datum', 'Omschrijving', 'Categorie', 'BTW_Percentage', 'Bedrag', 'Saldo', 'IBAN', 'Tegenrekening'];
    let csv = BOM + headers.join(';') + '\n';
    
    let runningBalance = 0;
    transactions.forEach((t: any) => {
      runningBalance += t.bedrag;
      const row = [
        t.datum,  // DD-MM-YYYY formaat
        `"${t.omschrijving?.replace(/"/g, '""')}"`,  // Escape quotes
        `${t.categoryEmoji || ''} ${t.categoryName || t.category}`,
        `${t.btw?.rate || 21}`,
        t.bedrag.toFixed(2),  // Punt als decimaal
        runningBalance.toFixed(2),
        rekeningnummer || '',
        ''  // Tegenrekening
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
