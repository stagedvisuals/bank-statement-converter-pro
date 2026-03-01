import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions, bank, rekeningnummer } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    // CAMT.053 XML formaat (vereenvoudigd)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">
  <BkToCstmrStmt>
    <GrpHdr>
      <MsgId>BSCPRO-${Date.now()}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
    </GrpHdr>
    <Stmt>
      <Id>STATEMENT-001</Id>
      <ElctrncSeqNb>1</ElctrncSeqNb>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <Acct>
        <Id>
          <IBAN>${rekeningnummer || 'NL00XXXX0000000000'}</IBAN>
        </Id>
      </Acct>
      ${transactions.map((t: any) => `
      <Ntry>
        <Amt Ccy="EUR">${Math.abs(t.bedrag).toFixed(2)}</Amt>
        <CdtDbtInd>${t.bedrag >= 0 ? 'CRDT' : 'DBIT'}</CdtDbtInd>
        <Sts>BOOK</Sts>
        <BookgDt>
          <Dt>${t.datum}</Dt>
        </BookgDt>
        <ValDt>
          <Dt>${t.datum}</Dt>
        </ValDt>
        <BkTxCd>
          <Prtry>
            <Cd>${t.categorie || 'OTHR'}</Cd>
          </Prtry>
        </BkTxCd>
        <NtryDtls>
          <TxDtls>
            <RmtInf>
              <Ustrd>${t.omschrijving}</Ustrd>
            </RmtInf>
          </TxDtls>
        </NtryDtls>
      </Ntry>`).join('')}
    </Stmt>
  </BkToCstmrStmt>
</Document>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': 'attachment; filename="transacties.xml"'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
