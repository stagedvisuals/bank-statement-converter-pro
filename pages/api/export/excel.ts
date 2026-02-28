import { NextApiRequest, NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
import SmartCategorizationEngine from '@/lib/smart-categorization';
import { detectBTW, formatBTW } from '@/lib/btw-detection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transactions, bank, rekeningnummer, user } = req.body;
    
    if (!transactions?.length) return res.status(400).json({ error: 'Geen transacties' });

    // Initialiseer categorisatie engine
    const categorizationEngine = new SmartCategorizationEngine(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Classificeer alle transacties
    const classifications = await categorizationEngine.classifyTransactions(
      transactions,
      user?.id || 'anonymous'
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transacties');
    
    // Header info
    worksheet.addRow([`${user?.bedrijfsnaam || 'Bedrijf'} - Bankafschrift Export`]).font = { bold: true, size: 14 };
    worksheet.addRow([`Gegenereerd door BSCPro.nl | ${new Date().toLocaleDateString('nl-NL')}`]);
    worksheet.addRow([]);
    
    // Headers met categorisatie kolommen + Trust Score
    worksheet.addRow([
      'Datum', 
      'Omschrijving', 
      'Categorie',
      'Grootboek', 
      'BTW %', 
      'Trust',  // Nieuw!
      'Bedrag', 
      'Saldo', 
      'IBAN',
      'Match Type'
    ]);
    const headerRow = worksheet.getRow(4);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00b8d9' } };
      cell.font = { bold: true, color: { argb: 'FF080d14' } };
      cell.border = { 
        top: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        left: { style: 'thin' }, 
        right: { style: 'thin' } 
      };
    });
    
    // Kolom breedtes
    worksheet.getColumn(1).width = 12;  // Datum
    worksheet.getColumn(2).width = 35;  // Omschrijving
    worksheet.getColumn(3).width = 18;  // Categorie
    worksheet.getColumn(4).width = 12;  // Grootboek
    worksheet.getColumn(5).width = 10;  // BTW %
    worksheet.getColumn(6).width = 12;  // Trust (Nieuw!)
    worksheet.getColumn(7).width = 12;  // Bedrag
    worksheet.getColumn(8).width = 12;  // Saldo
    worksheet.getColumn(9).width = 22;  // IBAN
    worksheet.getColumn(10).width = 12; // Match Type
    
    // Data rijen met categorisatie
    let runningBalance = 0;
    transactions.forEach((t: any, i: number) => {
      runningBalance += t.bedrag;
      
      // Haal classificatie op voor deze transactie
      const classification = t.id ? classifications.get(t.id) : null;
      
      // BTW detectie met nieuwe engine
      const btwResult = detectBTW(
        t.tegenpartij || t.omschrijving || '',
        t.omschrijving || '',
        classification?.category_name || undefined
      );
      
      const row = worksheet.addRow([
        t.datum,
        t.omschrijving,
        classification?.category_name || t.categoryName || 'Niet geclassificeerd',
        classification?.grootboek_code || '',
        formatBTW(btwResult.tarief),
        `${btwResult.trustScore.badge} ${Math.round(btwResult.trustScore.score)}%`,
        t.bedrag,
        runningBalance,
        rekeningnummer || '',
        classification?.method === 'rule_match' ? '✓ Auto' : 'Handmatig'
      ]);
      
      // Voeg Trust Score uitleg toe als commentaar
      const trustCell = row.getCell(6);
      trustCell.note = `${btwResult.trustScore.userMessage}\n\nUitleg: ${btwResult.explanation}\nBron: ${btwResult.source}`;
      
      // Kleur de trust score cel
      if (btwResult.trustScore.level === 'high') {
        trustCell.font = { color: { argb: 'FF10b981' } }; // Emerald
      } else if (btwResult.trustScore.level === 'medium') {
        trustCell.font = { color: { argb: 'FFf59e0b' } }; // Amber
      } else {
        trustCell.font = { color: { argb: 'FFdc2626' }, bold: true }; // Red
      }
      
      // Afwisselende kleuren
      if (i % 2 === 1) {
        row.eachCell((cell) => { 
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8f9fa' } }; 
        });
      }
      
      // Bedrag kleur
      const bedragCell = row.getCell(6);
      bedragCell.font = { color: { argb: t.bedrag < 0 ? 'FFdc2626' : 'FF16a34a' } };
      bedragCell.numFmt = '€#,##0.00';
      
      // Grootboek cel styling
      if (classification?.grootboek_code) {
        row.getCell(4).font = { color: { argb: 'FF00b8d9' } };
      }
    });
    
    // Totaal rijen
    worksheet.addRow([]);
    const income = transactions.filter((t: any) => t.bedrag > 0).reduce((sum: number, t: any) => sum + t.bedrag, 0);
    const expense = transactions.filter((t: any) => t.bedrag < 0).reduce((sum: number, t: any) => sum + t.bedrag, 0);
    
    const incomeRow = worksheet.addRow(['', '', '', '', '', 'Totaal Inkomsten:', income]);
    incomeRow.getCell(6).font = { color: { argb: 'FF16a34a' }, bold: true };
    incomeRow.getCell(7).numFmt = '€#,##0.00';
    
    const expenseRow = worksheet.addRow(['', '', '', '', '', 'Totaal Uitgaven:', expense]);
    expenseRow.getCell(6).font = { color: { argb: 'FFdc2626' }, bold: true };
    expenseRow.getCell(7).numFmt = '€#,##0.00';
    
    const balanceRow = worksheet.addRow(['', '', '', '', '', 'Saldo:', income + expense]);
    balanceRow.getCell(6).font = { bold: true };
    balanceRow.getCell(7).numFmt = '€#,##0.00';
    
    // BTW overzicht sheet - Nu per BTW tarief EN grootboekrekening
    const btwSheet = workbook.addWorksheet('BTW & Grootboek Overzicht');
    btwSheet.addRow(['BTW Overzicht per Grootboekrekening']);
    btwSheet.addRow([]);
    btwSheet.addRow(['BTW %', 'Grootboek', 'Categorie', 'Aantal', 'Subtotaal ex BTW', 'BTW Bedrag', 'Totaal incl BTW']);
    const btwHeader = btwSheet.getRow(3);
    btwHeader.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00b8d9' } };
      cell.font = { bold: true, color: { argb: 'FF080d14' } };
    });
    
    // Groepeer transacties per BTW tarief EN grootboek
    const groupedData: { [key: string]: { count: number; total: number } } = {};
    
    transactions.forEach((t: any) => {
      const classification = t.id ? classifications.get(t.id) : null;
      const btwRate = classification?.btw_percentage || t.btw?.rate || 21;
      const grootboek = classification?.grootboek_code || 'Geen';
      const category = classification?.category_name || 'Overig';
      const key = `${btwRate}|${grootboek}|${category}`;
      
      if (!groupedData[key]) groupedData[key] = { count: 0, total: 0 };
      groupedData[key].count++;
      groupedData[key].total += Math.abs(t.bedrag);
    });
    
    // Voeg gegroepeerde data toe
    Object.entries(groupedData)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, data]) => {
        const [btwRate, grootboek, category] = key.split('|');
        const rate = parseInt(btwRate);
        const subtotal = data.total / (1 + rate / 100);
        const btwAmount = data.total - subtotal;
        
        const row = btwSheet.addRow([
          `${rate}%`,
          grootboek,
          category,
          data.count,
          subtotal,
          btwAmount,
          data.total
        ]);
        
        // Formatteer bedragen
        [5, 6, 7].forEach(col => {
          row.getCell(col).numFmt = '€#,##0.00';
        });
      });
    
    // Kolom breedtes voor BTW sheet
    btwSheet.getColumn(1).width = 10;  // BTW %
    btwSheet.getColumn(2).width = 12;  // Grootboek
    btwSheet.getColumn(3).width = 20;  // Categorie
    btwSheet.getColumn(4).width = 10;  // Aantal
    btwSheet.getColumn(5).width = 18;  // Subtotaal
    btwSheet.getColumn(6).width = 15;  // BTW Bedrag
    btwSheet.getColumn(7).width = 18;  // Totaal
    
    // Footer
    worksheet.addRow([]);
    worksheet.addRow(['Gegenereerd door BSCPro.nl - Smart Categorization Engine']);
    worksheet.addRow(['AVG-proof | Data automatisch verwijderd']);
    
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="BSC-PRO-${bank}-Export.xlsx"`);
    res.send(buffer);
  } catch (error: any) {
    console.error('Excel export error:', error);
    return res.status(500).json({ error: error.message || 'Export mislukt' });
  }
}
