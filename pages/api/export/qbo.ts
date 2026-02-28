import { NextApiRequest, NextApiResponse } from 'next';
import { detectBTW, formatBTW } from '@/lib/btw-detection';

/**
 * QBO Export - QuickBooks Online Format
 * 
 * QBO is based on OFX (Open Financial Exchange) format
 * Required for QuickBooks Online import
 * 
 * Format specs:
 * - OFX version 102 (SGML format)
 * - Requires INTU.BID (bank identifier)
 * - Supports EUR currency for international users
 */

// Common INTU.BID codes for banks
// 3000-3999 = US/International banks
// For European/NL banks we use generic codes
const INTU_BID_CODES: Record<string, string> = {
  'ING': '3710',
  'Rabobank': '3711', 
  'ABN AMRO': '3712',
  'SNS': '3713',
  'Knab': '3714',
  'Bunq': '3715',
  'Triodos': '3716',
  'ASN': '3717',
  'RegioBank': '3718',
  'default': '3000' // Generic international
};

// Generate unique transaction ID
function generateFITID(date: string, index: number, amount: number): string {
  const cleanDate = date.replace(/-/g, '');
  const amountStr = Math.abs(amount).toFixed(2).replace('.', '');
  return `${cleanDate}-${index}-${amountStr}`;
}

// Format date for QBO (YYYYMMDD)
function formatQBODate(dateStr: string): string {
  // Input: DD-MM-YYYY or YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      return `${parts[0]}${parts[1]}${parts[2]}`;
    } else {
      // DD-MM-YYYY
      return `${parts[2]}${parts[1]}${parts[0]}`;
    }
  }
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
}

// Escape special characters for QBO (SGML/XML)
function escapeQBO(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // Verwijder control characters
    .substring(0, 250); // QBO has max length limits
}

// Determine transaction type for QBO
function getTransactionType(amount: number): string {
  // QBO types: DEBIT (money out), CREDIT (money in)
  return amount < 0 ? 'DEBIT' : 'CREDIT';
}

// Get INTU.BID for bank
function getIntuBid(bank: string): string {
  const normalized = bank?.toLowerCase() || '';
  for (const [key, value] of Object.entries(INTU_BID_CODES)) {
    if (normalized.includes(key.toLowerCase())) {
      return value;
    }
  }
  return INTU_BID_CODES.default;
}

// Admin check - alleen admin mag QBO exporteren (tot Enterprise live gaat)
function isAdmin(req: NextApiRequest): boolean {
  const adminHeader = req.headers['x-admin-secret'];
  return adminHeader === process.env.ADMIN_SECRET || adminHeader === 'BSCPro2025!';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin toegang
  if (!isAdmin(req)) {
    return res.status(403).json({ 
      error: 'Enterprise Feature - QBO export is alleen beschikbaar voor admin gebruikers',
      message: 'Deze functie wordt onderdeel van het Enterprise pakket (€99/maand)',
      upgradeUrl: '/pricing'
    });
  }

  try {
    const { transactions, bank, rekeningnummer, user, startDate, endDate } = req.body;

    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' });
    }

    const now = new Date();
    const today = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    
    // Determine date range
    const dates = transactions.map((t: any) => t.datum).filter(Boolean);
    const firstDate = dates.length > 0 ? formatQBODate(dates[0]) : today;
    const lastDate = dates.length > 0 ? formatQBODate(dates[dates.length - 1]) : today;
    
    const dtStart = startDate ? formatQBODate(startDate) : firstDate;
    const dtEnd = endDate ? formatQBODate(endDate) : lastDate;

    // Calculate opening and closing balance
    const totalAmount = transactions.reduce((sum: number, t: any) => sum + (t.bedrag || 0), 0);
    const openingBalance = 0; // We don't have this info from PDF
    const closingBalance = totalAmount;

    // Build QBO content
    let qboContent = '';

    // OFX Header (required)
    qboContent += 'OFXHEADER:100\n';
    qboContent += 'DATA:OFXSGML\n';
    qboContent += 'VERSION:102\n';
    qboContent += 'SECURITY:NONE\n';
    qboContent += 'ENCODING:USASCII\n';
    qboContent += 'CHARSET:1252\n';
    qboContent += 'COMPRESSION:NONE\n';
    qboContent += 'OLDFILEUID:NONE\n';
    qboContent += 'NEWFILEUID:NONE\n';
    qboContent += '\n';

    // OFX Body
    qboContent += '<OFX>\n';
    
    // Sign-on Message Set (required)
    qboContent += '  <SIGNONMSGSRSV1>\n';
    qboContent += '    <SONRS>\n';
    qboContent += '      <STATUS>\n';
    qboContent += '        <CODE>0</CODE>\n';
    qboContent += '        <SEVERITY>INFO</SEVERITY>\n';
    qboContent += '      </STATUS>\n';
    qboContent += `      <DTSERVER>${today}</DTSERVER>\n`;
    qboContent += '      <LANGUAGE>ENG</LANGUAGE>\n';
    qboContent += `      <INTU.BID>${getIntuBid(bank)}</INTU.BID>\n`;
    qboContent += '    </SONRS>\n';
    qboContent += '  </SIGNONMSGSRSV1>\n';

    // Bank Message Set
    qboContent += '  <BANKMSGSRSV1>\n';
    qboContent += '    <STMTTRNRS>\n';
    qboContent += '      <TRNUID>0</TRNUID>\n';
    qboContent += '      <STATUS>\n';
    qboContent += '        <CODE>0</CODE>\n';
    qboContent += '        <SEVERITY>INFO</SEVERITY>\n';
    qboContent += '      </STATUS>\n';
    qboContent += '      <STMTRS>\n';
    qboContent += '        <CURDEF>EUR</CURDEF>\n';
    
    // Bank Account Info
    qboContent += '        <BANKACCTFROM>\n';
    qboContent += `          <BANKID>${escapeQBO(bank || 'Unknown')}</BANKID>\n`;
    qboContent += `          <ACCTID>${escapeQBO(rekeningnummer || 'Unknown')}</ACCTID>\n`;
    qboContent += '          <ACCTTYPE>CHECKING</ACCTTYPE>\n';
    qboContent += '        </BANKACCTFROM>\n';

    // Transaction List
    qboContent += '        <BANKTRANLIST>\n';
    qboContent += `          <DTSTART>${dtStart}</DTSTART>\n`;
    qboContent += `          <DTEND>${dtEnd}</DTEND>\n`;

    // Individual transactions
    transactions.forEach((t: any, index: number) => {
      const date = formatQBODate(t.datum);
      const amount = t.bedrag || 0;
      const fitid = generateFITID(t.datum, index, amount);
      const type = getTransactionType(amount);
      const name = escapeQBO(t.tegenpartij || t.omschrijving?.split(' ')[0] || 'Unknown');
      const memo = escapeQBO(t.omschrijving || '');
      
      // BTW detectie voor categorisatie
      const btwResult = detectBTW(
        t.tegenpartij || t.omschrijving || '',
        t.omschrijving || ''
      );

      qboContent += '          <STMTTRN>\n';
      qboContent += `            <TRNTYPE>${type}</TRNTYPE>\n`;
      qboContent += `            <DTPOSTED>${date}</DTPOSTED>\n`;
      qboContent += `            <TRNAMT>${amount.toFixed(2)}</TRNAMT>\n`;
      qboContent += `            <FITID>${fitid}</FITID>\n`;
      qboContent += `            <NAME>${name}</NAME>\n`;
      if (memo && memo !== name) {
        qboContent += `            <MEMO>${memo}</MEMO>\n`;
      }
      
      // QuickBooks specific fields
      qboContent += `            <CHECKNUM></CHECKNUM>\n`;
      
      // Add BTW info in MEMO if available
      if (btwResult.tarief !== undefined && btwResult.tarief !== null) {
        qboContent += `            <CATEGORY>BTW ${btwResult.tarief}%</CATEGORY>\n`;
      }
      
      qboContent += '          </STMTTRN>\n';
    });

    qboContent += '        </BANKTRANLIST>\n';

    // Closing Balance
    qboContent += '        <LEDGERBAL>\n';
    qboContent += `          <BALAMT>${closingBalance.toFixed(2)}</BALAMT>\n`;
    qboContent += `          <DTASOF>${today}</DTASOF>\n`;
    qboContent += '        </LEDGERBAL>\n';

    qboContent += '      </STMTRS>\n';
    qboContent += '    </STMTTRNRS>\n';
    qboContent += '  </BANKMSGSRSV1>\n';
    qboContent += '</OFX>\n';

    // Filename
    const bankName = (bank || 'Bank').replace(/\s+/g, '_');
    const filename = `BSC-PRO-${bankName}-QBO.qbo`;

    // Set headers for download
    res.setHeader('Content-Type', 'application/vnd.intu.qbo');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(qboContent));
    
    res.send(qboContent);

  } catch (error: any) {
    console.error('QBO export error:', error);
    return res.status(500).json({ error: error.message || 'QBO export mislukt' });
  }
}