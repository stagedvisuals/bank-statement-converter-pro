import { NextApiRequest, NextApiResponse } from 'next';

/**
 * MT940 Sanitizer - Verwijder karakters die MT940 formaat breken
 * MT940 is een fixed-width tekst formaat, geen XML
 */
function sanitizeMT940(text: string | undefined | null): string {
  if (!text) return 'Transactie';
  return text
    .replace(/\r\n/g, ' ')  // Newlines naar spaties
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/:/g, ' ')     // Kolons zijn field separators in MT940
    .replace(/'/g, '')      // Quotes kunnen problemen geven
    .substring(0, 65)       // MT940 tag 86 max 65 chars
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transactions, bank, rekeningnummer } = req.body;
    if (!transactions?.length) return res.status(400).json({ error: 'Geen transacties' });

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    
    // MT940 formaat
    let mt940 = `:20:BSCPRO${dateStr}${timeStr}\r\n`;
    mt940 += `:25:${rekeningnummer || 'NL00XXXX0000000000'}\r\n`;
    mt940 += `:28C:00001/1\r\n`;
    mt940 += `:60F:C${dateStr}EUR0,00\r\n`;
    
    transactions.forEach((t: any, i: number) => {
      const datum = t.datum?.replace(/-/g, '')?.substring(2) || dateStr.substring(2);
      const bedrag = Math.abs(t.bedrag).toFixed(2).replace('.', ',');
      const isCredit = t.bedrag > 0;
      const safeOmschrijving = sanitizeMT940(t.omschrijving);
      
      mt940 += `:61:${datum}${isCredit ? 'C' : 'D'}${bedrag}NTRF${String(i + 1).padStart(4, '0')}\r\n`;
      mt940 += `:86:${safeOmschrijving}\r\n`;
    });
    
    // Eindsaldo (simplified)
    const total = transactions.reduce((sum: number, t: any) => sum + t.bedrag, 0);
    const eindSaldo = Math.abs(total).toFixed(2).replace('.', ',');
    mt940 += `:62F:${total >= 0 ? 'C' : 'D'}${dateStr}EUR${eindSaldo}\r\n`;
    mt940 += `-`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="BSC-PRO-${bank}-MT940.sta"`);
    res.send(mt940);
  } catch (error: any) {
    console.error('MT940 export error:', error);
    return res.status(500).json({ error: error.message || 'Export mislukt' });
  }
}
