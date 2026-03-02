import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, bank, rekeningnummer, rekeninghouder } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    const today = new Date().toISOString().slice(0, 10)
    const msgId = `BSCPRO-${Date.now()}`
    
    let camt = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">
  <BkToCstmrStmt>
    <GrpHdr>
      <MsgId>${msgId}</MsgId>
      <CreDtTm>${today}T00:00:00</CreDtTm>
      <MsgPgntn>1/1</MsgPgntn>
    </GrpHdr>
    <Stmt>
      <Id>${msgId}</Id>
      <CreDtTm>${today}T00:00:00</CreDtTm>
      <Acct>
        <Id>
          <IBAN>${rekeningnummer || 'NL00BANK0000000000'}</IBAN>
        </Id>
        <Ownr>
          <Nm>${rekeninghouder || 'Rekeninghouder'}</Nm>
        </Ownr>
      </Acct>
      <Bal>
        <Tp><CdOrPrtry><Cd>OPBD</Cd></CdOrPrtry></Tp>
        <Amt Ccy="EUR">0.00</Amt>
        <CdtDbtInd>CRDT</CdtDbtInd>
        <Dt><Dt>${today}</Dt></Dt>
      </Bal>
`

    transactions.forEach((t: any) => {
      const isCredit = parseFloat(t.bedrag) > 0
      const amount = Math.abs(parseFloat(t.bedrag) || 0).toFixed(2)
      
      camt += `      <Ntry>
        <Amt Ccy="EUR">${amount}</Amt>
        <CdtDbtInd>${isCredit ? 'CRDT' : 'DBIT'}</CdtDbtInd>
        <Sts>BOOK</Sts>
        <BookgDt><Dt>${t.datum || today}</Dt></BookgDt>
        <ValDt><Dt>${t.datum || today}</Dt></ValDt>
        <NtryDtls>
          <TxDtls>
            <RmtInf>
              <Ustrd>${t.omschrijving || ''}</Ustrd>
            </RmtInf>
          </TxDtls>
        </NtryDtls>
      </Ntry>
`
    })

    camt += `    </Stmt>
  </BkToCstmrStmt>
</Document>`

    const buffer = Buffer.from(camt, 'utf-8')

    // Response met correcte headers voor mobiel
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.xml"')
    res.setHeader('Content-Length', buffer.length.toString())
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.status(200).send(buffer)
    
  } catch (error: any) {
    console.error('CAMT export error:', error)
    return res.status(500).json({ error: error.message })
  }
}
