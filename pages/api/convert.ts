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

    // Verwijder temp file DIRECT na verwerking (AVG compliance)
    try {
      if (file.filepath && fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
        console.log(`[Security] Temp file direct verwijderd: ${file.filepath}`);
      }
    } catch (cleanupErr) {
      console.error('[Security] Kon temp file niet verwijderen:', cleanupErr);
    }

    return res.status(200).json({
      success: true,
      bank: 'ING',
      rekeningnummer: 'NL91INGB0001234567',
      transactions: mockTransactions,
      categorySummary
    });
  } catch (error: any) {
    console.error('Convert error:', error);
    
    // User-friendly error messages
    const errorMessage = error.message || '';
    let userFriendlyError = 'Oeps! Er is iets misgegaan bij het verwerken van je document.';
    let errorType = 'unknown';
    
    if (errorMessage.includes('password') || errorMessage.includes('beveiligd') || errorMessage.includes('encrypted')) {
      userFriendlyError = 'Oeps! Dit document is beveiligd met een wachtwoord. Verwijder de beveiliging en probeer opnieuw.';
      errorType = 'password_protected';
    } else if (errorMessage.includes('scan') || errorMessage.includes('quality') || errorMessage.includes('resolution')) {
      userFriendlyError = 'Oeps! De kwaliteit van deze scan is te laag. Probeer een scherpere scan of foto met beter licht.';
      errorType = 'low_quality';
    } else if (errorMessage.includes('format') || errorMessage.includes('unsupported')) {
      userFriendlyError = 'Oeps! Dit bestandsformaat wordt niet ondersteund. Gebruik PDF, JPG of PNG.';
      errorType = 'unsupported_format';
    } else if (errorMessage.includes('size') || errorMessage.includes('large')) {
      userFriendlyError = 'Oeps! Dit bestand is te groot. Maximum is 10MB. Probeer te comprimeren.';
      errorType = 'file_too_large';
    } else if (errorMessage.includes('leesbaar') || errorMessage.includes('readable') || errorMessage.includes('parse')) {
      userFriendlyError = 'Oeps! Dit document is onleesbaar of beschadigd. Probeer een andere scan of check het origineel.';
      errorType = 'unreadable';
    } else if (errorMessage.includes('empty') || errorMessage.includes('geen')) {
      userFriendlyError = 'Oeps! We konden geen transacties vinden in dit document. Controleer of het een bankafschrift is.';
      errorType = 'no_transactions';
    }
    
    return res.status(500).json({ 
      error: userFriendlyError,
      errorType: errorType,
      technicalError: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
