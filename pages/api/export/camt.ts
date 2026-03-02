import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transactions, rekeningnummer, rekeninghouder, bank } = req.body
    
    if (!transactions?.length) {
      return res.status(400).json({ error: 'Geen transacties' })
    }

    const iban = rekeningnummer || 'NL00BANK0000000000'
    const now = new Date().toISOString()
    const msgId = 'BSCPro-' + Date.now()

    const sorted = [...transactions].sort((a: any, b: any) => 
      new Date(a.datum).getTime() - new Date(b.datum).getTime()
    )

    const formatAmount = (amount: number) => Math.abs(amount).toFixed(2)
    const formatDate = (datum: string) => datum || new Date().toISOString().split('T')[0]

    const totaalInkomsten = sorted
      .filter((t: any) => t.bedrag > 0)
      .reduce((sum: number, t: any) => sum + t.bedrag, 0)

    const totaalUitgaven = Math.abs(sorted
      .filter((t: any) => t.bedrag < 0)
      .reduce((sum: number, t: any) => sum + t.bedrag, 0))

    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02"',
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
      '  <BkToCstmrStmt>',
      '    <GrpHdr>',
      `      <MsgId>${msgId}</MsgId>`,
      `      <CreDtTm>${now}</CreDtTm>`,
      `      <MsgRcpt><Nm>${rekeninghouder || 'Rekeninghouder'}</Nm></MsgRcpt>`,
      '    </GrpHdr>',
      '    <Stmt>',
      `      <Id>${msgId}</Id>`,
      `      <CreDtTm>${now}</CreDtTm>`,
      '      <Acct>',
      `        <Id><IBAN>${iban}</IBAN></Id>`,
      `        <Nm>${rekeninghouder || ''}</Nm>`,
      `        <Svcr><FinInstnId><Nm>${bank || 'Bank'}</Nm></FinInstnId></Svcr>`,
      '      </Acct>',
      '      <TxsSummry>',
      '        <TtlCdtNtries>',
      `          <NbOfNtries>${sorted.filter((t: any) => t.bedrag > 0).length}</NbOfNtries>`,
      `          <Sum>${totaalInkomsten.toFixed(2)}</Sum>`,
      '        </TtlCdtNtries>',
      '        <TtlDbtNtries>',
      `          <NbOfNtries>${sorted.filter((t: any) => t.bedrag < 0).length}</NbOfNtries>`,
      `          <Sum>${totaalUitgaven.toFixed(2)}</Sum>`,
      '        </TtlDbtNtries>',
      '      </TxsSummry>',
    ]

    sorted.forEach((t: any) => {
      const dc = t.bedrag >= 0 ? 'CRDT' : 'DBIT'
      const amount = formatAmount(t.bedrag)
      const date = formatDate(t.datum)
      const omschrijving = (t.omschrijving || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .substring(0, 140)

      xmlLines.push('      <Ntry>')
      xmlLines.push(`        <Amt Ccy="EUR">${amount}</Amt>`)
      xmlLines.push(`        <CdtDbtInd>${dc}</CdtDbtInd>`)
      xmlLines.push('        <Sts>BOOK</Sts>')
      xmlLines.push(`        <BookgDt><Dt>${date}</Dt></BookgDt>`)
      xmlLines.push(`        <ValDt><Dt>${date}</Dt></ValDt>`)
      xmlLines.push('        <NtryDtls>')
      xmlLines.push('          <TxDtls>')
      xmlLines.push('            <RmtInf>')
      xmlLines.push(`              <Ustrd>${omschrijving}</Ustrd>`)
      xmlLines.push('            </RmtInf>')
      xmlLines.push('          </TxDtls>')
      xmlLines.push('        </NtryDtls>')
      xmlLines.push('      </Ntry>')
    })

    xmlLines.push('    </Stmt>')
    xmlLines.push('  </BkToCstmrStmt>')
    xmlLines.push('</Document>')

    const xml = xmlLines.join('\n')

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="transacties.xml"')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.status(200).send(xml)
    
  } catch (error: any) {
    console.error('CAMT export error:', error)
    return res.status(500).json({ error: error.message })
  }
}
