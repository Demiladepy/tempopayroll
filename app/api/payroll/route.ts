import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { convertUsdcToLocal, type LocalCurrency } from '@/lib/currency/rates'

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
    let display_currency: string | null = null
    let display_amount: number | null = null

    if (tx.employee_id) {
      const { data: employee } = await supabase
        .from('employees')
        .select('auto_convert, target_currency')
        .eq('id', tx.employee_id)
        .single()

      if (employee?.auto_convert && employee?.target_currency && employee.target_currency !== 'USDC') {
        const target = employee.target_currency as LocalCurrency
        display_currency = target
        display_amount = convertUsdcToLocal(Number(tx.amount), target)
      }
    }

    const { error: txError } = await supabase
      .from('payroll_transactions')
      .insert({
        business_id,
        employee_id: tx.employee_id ?? null,
        amount: tx.amount,
        currency: tx.currency ?? 'USDC',
        display_currency: display_currency ?? null,
        display_amount: display_amount ?? null,
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
