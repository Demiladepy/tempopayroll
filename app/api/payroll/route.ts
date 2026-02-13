import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// Record payroll batch and transactions (e.g. after client-side execution)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { business_id, transactions, total_amount, batch_tx_hash } = body

  if (!business_id || !Array.isArray(transactions)) {
    return NextResponse.json(
      { error: 'business_id and transactions required' },
      { status: 400 }
    )
  }

  for (const tx of transactions) {
    const { error: txError } = await supabase
      .from('payroll_transactions')
      .insert({
        business_id,
        employee_id: tx.employee_id ?? null,
        amount: tx.amount,
        currency: tx.currency ?? 'USDC',
        tx_hash: tx.tx_hash ?? null,
        status: tx.status ?? 'confirmed',
      })

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 })
    }
  }

  const { error: batchError } = await supabase.from('payroll_batches').insert({
    business_id,
    total_amount: total_amount ?? transactions.reduce((s: number, t: { amount: number }) => s + t.amount, 0),
    employee_count: transactions.length,
    batch_tx_hash: batch_tx_hash ?? null,
    status: 'confirmed',
  })

  if (batchError) {
    return NextResponse.json({ error: batchError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
