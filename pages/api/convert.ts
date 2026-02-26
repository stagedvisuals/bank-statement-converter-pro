import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];
    
    if (!file) return res.status(400).json({ error: 'Geen bestand geüpload' });

    // Simuleer AI processing - in productie zou dit OCR + AI zijn
    const mockTransactions = [
      { datum: '15-01-2024', omschrijving: 'Albert Heijn B.V.', bedrag: -85.43, category: 'boodschappen', categoryName: 'Boodschappen', categoryEmoji: '🛒', btw: { rate: 9 } },
      { datum: '16-01-2024', omschrijving: 'Shell Station Amsterdam', bedrag: -65.00, category: 'vervoer', categoryName: 'Vervoer', categoryEmoji: '🚗', btw: { rate: 21 } },
      { datum: '17-01-2024', omschrijving: 'Klantbetaling - Factuur 2024-001', bedrag: 1250.00, category: 'inkomsten', categoryName: 'Inkomsten', categoryEmoji: '💰', btw: { rate: 21 } },
      { datum: '18-01-2024', omschrijving: 'KPN Zakelijk', bedrag: -45.99, category: 'telecom', categoryName: 'Telecom', categoryEmoji: '📞', btw: { rate: 21 } },
      { datum: '19-01-2024', omschrijving: 'WeWork Amsterdam', bedrag: -350.00, category: 'kantoor', categoryName: 'Kantoor', categoryEmoji: '🏢', btw: { rate: 21 } },
    ];

    const categorySummary = [
      { id: '1', count: 1, total: 85.43, percentage: '18', category: { name: 'Boodschappen', emoji: '🛒' } },
      { id: '2', count: 1, total: 65.00, percentage: '14', category: { name: 'Vervoer', emoji: '🚗' } },
      { id: '3', count: 1, total: 350.00, percentage: '60', category: { name: 'Kantoor', emoji: '🏢' } },
      { id: '4', count: 1, total: 45.99, percentage: '8', category: { name: 'Telecom', emoji: '📞' } },
    ];

    // Verwijder temp file
    if (file.filepath) fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      bank: 'ING',
      rekeningnummer: 'NL91INGB0001234567',
      transactions: mockTransactions,
      categorySummary
    });
  } catch (error: any) {
    console.error('Convert error:', error);
    return res.status(500).json({ error: error.message || 'Verwerking mislukt' });
  }
}
