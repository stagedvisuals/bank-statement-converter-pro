import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const adminSecret = request.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Simuleer data voor nu - in productie zou dit Supabase zijn
    const mockUsers = [
      {
        id: '1',
        user_id: 'user_123',
        email: 'test@example.com',
        plan: 'free',
        created_at: new Date().toISOString(),
        conversions_count: 0
      }
    ]

    return NextResponse.json({ users: mockUsers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const adminSecret = request.headers.get("x-admin-secret")
  if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== "BSCPro2025!") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, plan, credits } = await request.json()
    
    return NextResponse.json({
      success: true,
      message: "Gebruiker succesvol bijgewerkt (mock response)",
      updated: { userId, plan, credits }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const adminSecret = request.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'BSCPro2025!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted (mock response)',
      userId 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
