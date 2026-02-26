import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transactions, bank, rekeningnummer, user } = req.body;
    if (!transactions?.length) return res.status(400).json({ error: 'Geen transacties' });

    const now = new Date();
    const dateTime = now.toISOString();
    const date = dateTime.split('T')[0];
    const msgId = `BSCPRO${Date.now()}`;
    
    // Bereken openingssaldo
    const total = transactions.reduce((sum: number, t: any) => sum + t.bedrag, 0);
    const openingBalance = Math.max(0, total);
    
    let camt = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    camt += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">\n`;
    camt += `  <BkToCstmrStmt>\n`;
    camt += `    <GrpHdr>\n`;
    camt += `      <MsgId>${msgId}</MsgId>\n`;
    camt += `      <CreDtTm>${dateTime}</CreDtTm>\n`;
    camt += `    </GrpHdr>\n`;
    camt += `    <Stmt>\n`;
    camt += `      <Id>STMT${date.replace(/-/g, '')}</Id>\n`;
    camt += `      <CreDtTm>${dateTime}</CreDtTm>\n`;
    camt += `      <Acct>\n`;
    camt += `        <Id>\n`;
    camt += `          <IBAN>${rekeningnummer || 'NL00XXXX0000000000'}</IBAN>\n`;
    camt += `        </Id>\n`;
    camt += `        <Ccy>EUR</Ccy>\n`;
    camt += `        <Ownr>\n`;
    camt += `          <Nm>${user?.bedrijfsnaam || 'Bedrijf'}</Nm>\n`;
    camt += `        </Ownr>\n`;
    camt += `      </Acct>\n`;
    
    // Opening balance
    camt += `      <Bal>\n`;
    camt += `        <Tp><CdOrPrtry><Cd>OPBD</Cd></CdOrPrtry></Tp>\n`;
    camt += `        <Amt Ccy="EUR">${openingBalance.toFixed(2)}</Amt>\n`;
    camt += `        <CdtDbtInd>${openingBalance >= 0 ? 'CRDT' : 'DBIT'}</CdtDbtInd>\n`;
    camt += `        <Dt><Dt>${date}</Dt></Dt>\n`;
    camt += `      </Bal>\n`;
    
    // Transacties
    transactions.forEach((t: any) => {
      const datum = t.datum ? `${t.datum.substring(6, 10)}-${t.datum.substring(3, 5)}-${t.datum.substring(0, 2)}` : date;
      const isCredit = t.bedrag > 0;
      
      camt += `      <Ntry>\n`;
      camt += `        <Amt Ccy="EUR">${Math.abs(t.bedrag).toFixed(2)}</Amt>\n`;
      camt += `        <CdtDbtInd>${isCredit ? 'CRDT' : 'DBIT'}</CdtDbtInd>\n`;
      camt += `        <Sts>BOOK</Sts>\n`;
      camt += `        <BookgDt><Dt>${datum}</Dt></BookgDt>\n`;
      camt += `        <ValDt><Dt>${datum}</Dt></ValDt>\n`;
      camt += `        <NtryDtls>\n`;
      camt += `          <TxDtls>\n`;
      camt += `            <RmtInf>\n`;
      camt += `              <Ustrd>${t.omschrijving?.replace(/[<>]/g, '') || 'Transactie'}</Ustrd>\n`;
      camt += `            </RmtInf>\n`;
      camt += `          </TxDtls>\n`;
      camt += `        </NtryDtls>\n`;
      camt += `      </Ntry>\n`;
    });
    
    // Closing balance
    const closingBalance = total;
    camt += `      <Bal>\n`;
    camt += `        <Tp><CdOrPrtry><Cd>CLBD</Cd></CdOrPrtry></Tp>\n`;
    camt += `        <Amt Ccy="EUR">${Math.abs(closingBalance).toFixed(2)}</Amt>\n`;
    camt += `        <CdtDbtInd>${closingBalance >= 0 ? 'CRDT' : 'DBIT'}</CdtDbtInd>\n`;
    camt += `        <Dt><Dt>${date}</Dt></Dt>\n`;
    camt += `      </Bal>\n`;
    
    camt += `    </Stmt>\n`;
    camt += `  </BkToCstmrStmt>\n`;
    camt += `</Document>`;
    
    // Filename: [IBAN]_[datum].xml
    const sanitizedIban = (rekeningnummer || 'NL00XXXX0000000000').replace(/\s/g, '');
    const filename = `${sanitizedIban}_${date}.xml`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(camt);
  } catch (error: any) {
    console.error('CAMT export error:', error);
    return res.status(500).json({ error: error.message || 'Export mislukt' });
  }
}
