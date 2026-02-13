import { NextResponse } from 'next/server'
import { getMercuryBalance, mockMercuryAccount } from '@/lib/mercury/mock'

export async function GET() {
  const balance = await getMercuryBalance()
  return NextResponse.json({
    ...mockMercuryAccount,
    balance,
  })
}
