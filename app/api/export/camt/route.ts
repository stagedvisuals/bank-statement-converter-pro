import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions, rekeningnummer, rekeninghouder } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02">',
      '<BkToCstmrStmt>',
      '<GrpHdr><MsgId>BSCPro-' + Date.now() + '</MsgId><CreDtTm>' + now + '</CreDtTm></GrpHdr>',
      '<Stmt>',
      '<Acct><Id><IBAN>' + (rekeningnummer || 'NL00BANK0000000000') + '</IBAN></Id></Acct>',
    ]

    transactions.forEach((t: any) => {
      const dc = t.bedrag >= 0 ? 'CRDT' : 'DBIT'
      const amount = Math.abs(t.bedrag || 0).toFixed(2)
      xmlLines.push('<Ntry>')
      xmlLines.push('<Amt Ccy="EUR">' + amount + '</Amt>')
      xmlLines.push('<CdtDbtInd>' + dc + '</CdtDbtInd>')
      xmlLines.push('<BookgDt><Dt>' + (t.datum || '') + '</Dt></BookgDt>')
      xmlLines.push('<NtryDtls><TxDtls><RmtInf><Ustrd>' + (t.omschrijving || '') + '</Ustrd></RmtInf></TxDtls></NtryDtls>')
      xmlLines.push('</Ntry>')
    })

    xmlLines.push('</Stmt></BkToCstmrStmt></Document>')

    const xml = xmlLines.join('\n')

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
