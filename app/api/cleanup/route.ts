import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Cleanup service actief',
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  return NextResponse.json({
    status: 'ok',
    cleaned: 0,
    timestamp: new Date().toISOString()
  })
}
