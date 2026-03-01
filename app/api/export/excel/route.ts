import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { transactions } = await request.json()
    
    if (!transactions?.length) {
      return NextResponse.json({ error: 'Geen transacties' }, { status: 400 })
    }

    // Return JSON voor client-side XLSX generation
    return NextResponse.json({ 
      success: true,
      transactions,
      filename: 'transacties.xlsx'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
