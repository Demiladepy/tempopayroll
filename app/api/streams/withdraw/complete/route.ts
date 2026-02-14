import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { request_id, tx_hash, business_id } = body

  if (!request_id || !business_id) {
    return NextResponse.json(
      { error: 'request_id and business_id required' },
      { status: 400 }
    )
  }

  const { data: req, error: reqErr } = await supabase
    .from('withdrawal_requests')
    .select('id, stream_id, amount')
    .eq('id', request_id)
    .eq('status', 'pending')
    .single()

  if (reqErr || !req) {
    return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 })
  }

  const { data: stream } = await supabase
    .from('payroll_streams')
    .select('id, business_id, employee_id, total_withdrawn')
    .eq('id', req.stream_id)
    .single()

  if (!stream || stream.business_id !== business_id) {
    return NextResponse.json({ error: 'Stream not found' }, { status: 404 })
  }

  const amount = Number(req.amount)
  const newTotal = Number(stream.total_withdrawn) + amount

  const { error: updateReqErr } = await supabase
    .from('withdrawal_requests')
    .update({ status: 'paid' })
    .eq('id', request_id)

  if (updateReqErr) {
    return NextResponse.json({ error: updateReqErr.message }, { status: 500 })
  }

  const { error: updateStreamErr } = await supabase
    .from('payroll_streams')
    .update({
      total_withdrawn: newTotal,
      last_withdrawal_at: new Date().toISOString(),
    })
    .eq('id', req.stream_id)

  if (updateStreamErr) {
    return NextResponse.json({ error: updateStreamErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
