import { NextApiRequest, NextApiResponse } from 'next';
import ExcelJS from 'exceljs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transactions, bank, rekeningnummer, user } = req.body;
    
    if (!transactions?.length) return res.status(400).json({ error: 'Geen transacties' });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transacties');
    
    // Header info
    worksheet.addRow([`${user?.bedrijfsnaam || 'Bedrijf'} - Bankafschrift Export`]);
    worksheet.addRow([`Gegenereerd door BSCPro.nl | ${new Date().toLocaleDateString('nl-NL')}`]);
    worksheet.addRow([]);
    
    // Headers
    worksheet.addRow(['Datum', 'Omschrijving', 'Categorie', 'BTW %', 'Bedrag', 'Saldo', 'IBAN']);
    const headerRow = worksheet.getRow(4);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1a3a5c' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    
    // Kolom breedtes
    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 25;
    
    // Data rijen
    let runningBalance = 0;
    transactions.forEach((t: any, i: number) => {
      runningBalance += t.bedrag;
      const row = worksheet.addRow([
        t.datum,
        t.omschrijving,
        `${t.categoryEmoji || ''} ${t.categoryName || t.category}`,
        `${t.btw?.rate || 21}%`,
        t.bedrag,
        runningBalance,
        rekeningnummer || ''
      ]);
      
      // Afwisselende kleuren
      if (i % 2 === 1) {
        row.eachCell((cell) => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8f9fa' } }; });
      }
      
      // Bedrag kleur
      const bedragCell = row.getCell(5);
      bedragCell.font = { color: { argb: t.bedrag < 0 ? 'FFdc2626' : 'FF16a34a' } };
      bedragCell.numFmt = '€#,##0.00';
    });
    
    // Totaal rijen
    worksheet.addRow([]);
    const income = transactions.filter((t: any) => t.bedrag > 0).reduce((sum: number, t: any) => sum + t.bedrag, 0);
    const expense = transactions.filter((t: any) => t.bedrag < 0).reduce((sum: number, t: any) => sum + t.bedrag, 0);
    
    const incomeRow = worksheet.addRow(['', '', '', 'Totaal Inkomsten:', income]);
    incomeRow.getCell(5).font = { color: { argb: 'FF16a34a' }, bold: true };
    
    const expenseRow = worksheet.addRow(['', '', '', 'Totaal Uitgaven:', expense]);
    expenseRow.getCell(5).font = { color: { argb: 'FFdc2626' }, bold: true };
    
    const balanceRow = worksheet.addRow(['', '', '', 'Saldo:', income + expense]);
    balanceRow.getCell(5).font = { bold: true };
    
    // BTW overzicht sheet
    const btwSheet = workbook.addWorksheet('BTW Overzicht');
    btwSheet.addRow(['Categorie', 'Aantal', 'Subtotaal ex BTW', 'BTW Bedrag', 'Totaal incl BTW', 'BTW %']);
    const btwHeader = btwSheet.getRow(1);
    btwHeader.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1a3a5c' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    });
    
    // Groepeer transacties per BTW tarief
    const btwGroups: { [key: number]: { count: number; total: number } } = {};
    transactions.forEach((t: any) => {
      const rate = t.btw?.rate || 21;
      if (!btwGroups[rate]) btwGroups[rate] = { count: 0, total: 0 };
      btwGroups[rate].count++;
      btwGroups[rate].total += Math.abs(t.bedrag);
    });
    
    // Voeg BTW data toe
    Object.entries(btwGroups).forEach(([rate, data]) => {
      const btwRate = parseInt(rate);
      const subtotal = data.total / (1 + btwRate / 100);
      const btwAmount = data.total - subtotal;
      const categoryName = btwRate === 0 ? 'Overig (0%)' : btwRate === 9 ? 'Lage BTW (9%)' : 'Standaard BTW (21%)';
      
      const row = btwSheet.addRow([
        categoryName,
        data.count,
        subtotal,
        btwAmount,
        data.total,
        `${btwRate}%`
      ]);
      
      // Formatteer bedragen
      [3, 4, 5].forEach(col => {
        row.getCell(col).numFmt = '€#,##0.00';
      });
    });
    
    // Kolom breedtes voor BTW sheet
    btwSheet.getColumn(1).width = 25;
    btwSheet.getColumn(2).width = 12;
    btwSheet.getColumn(3).width = 18;
    btwSheet.getColumn(4).width = 15;
    btwSheet.getColumn(5).width = 18;
    btwSheet.getColumn(6).width = 10;
    
    // Footer
    worksheet.addRow([]);
    worksheet.addRow(['Gegenereerd door BSCPro.nl']);
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
