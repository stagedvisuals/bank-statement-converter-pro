import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, rekeningnummer, bank, rekeninghouder } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    const iban = rekeningnummer || 'NL00BANK0000000000'
    const today = new Date().toISOString().slice(0, 10)
    const msgId = `BSCPRO-${Date.now()}`

    // Sorteer transacties op datum
    const sorted = [...transactions].sort((a: any, b: any) => 
      new Date(a.datum).getTime() - new Date(b.datum).getTime()
    )

    // Bereken saldo
    const totaal = sorted.reduce((sum: number, t: any) => sum + (t.bedrag || 0), 0)

    let entries = ''
    sorted.forEach((t: any) => {
      const isCredit = (t.bedrag || 0) >= 0
      const amount = Math.abs(t.bedrag || 0).toFixed(2)
      const cdInd = isCredit ? 'CRDT' : 'DBIT'
      
      entries += `
      <Ntry>
        <Amt Ccy="EUR">${amount}</Amt>
        <CdtDbtInd>${cdInd}</CdtDbtInd>
        <Sts>BOOK</Sts>
        <BookgDt>
          <Dt>${t.datum || today}</Dt>
        </BookgDt>
        <ValDt>
          <Dt>${t.datum || today}</Dt>
        </ValDt>
        <BkTxCd>
          <Prtry>
            <Cd>${t.categorie || 'UNKN'}</Cd>
          </Prtry>
        </BkTxCd>
        <NtryDtls>
          <TxDtls>
            <RmtInf>
              <Ustrd>${(t.omschrijving || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Ustrd>
            </RmtInf>
          </TxDtls>
        </NtryDtls>
      </Ntry>`
    })

    const camt = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <BkToCstmrStmt>
    <GrpHdr>
      <MsgId>${msgId}</MsgId>
      <CreDtTm>${today}T00:00:00</CreDtTm>
      <MsgRcpt>
        <Nm>${rekeninghouder || 'Rekeninghouder'}</Nm>
      </MsgRcpt>
    </GrpHdr>
    <Stmt>
      <Id>${msgId}</Id>
      <CreDtTm>${today}T00:00:00</CreDtTm>
      <FrToDt>
        <FrDt>${sorted[0]?.datum || today}</FrDt>
        <ToDt>${sorted[sorted.length - 1]?.datum || today}</ToDt>
      </FrToDt>
      <Acct>
        <Id>
          <IBAN>${iban}</IBAN>
        </Id>
        <Ownr>
          <Nm>${rekeninghouder || 'Rekeninghouder'}</Nm>
        </Ownr>
      </Acct>
      <Bal>
        <Tp>
          <CdOrPrtry>
            <Cd>OPBD</Cd>
          </CdOrPrtry>
        </Tp>
        <Amt Ccy="EUR">0.00</Amt>
        <CdtDbtInd>CRDT</CdtDbtInd>
        <Dt>
          <Dt>${sorted[0]?.datum || today}</Dt>
        </Dt>
      </Bal>${entries}
      <Bal>
        <Tp>
          <CdOrPrtry>
            <Cd>CLBD</Cd>
          </CdOrPrtry>
        </Tp>
        <Amt Ccy="EUR">${Math.abs(totaal).toFixed(2)}</Amt>
        <CdtDbtInd>${totaal >= 0 ? 'CRDT' : 'DBIT'}</CdtDbtInd>
        <Dt>
          <Dt>${sorted[sorted.length - 1]?.datum || today}</Dt>
        </Dt>
      </Bal>
    </Stmt>
  </BkToCstmrStmt>
</Document>`

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.xml"')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(200).send(camt)
    
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
