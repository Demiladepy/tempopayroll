import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

function getAvailableToWithdraw(stream: {
  start_date: string
  stream_rate_per_second: number
  total_withdrawn: number
}): number {
  const start = new Date(stream.start_date).getTime()
  const secondsElapsed = (Date.now() - start) / 1000
  const earned = secondsElapsed * Number(stream.stream_rate_per_second)
  const available = Math.max(0, earned - Number(stream.total_withdrawn))
  return Math.round(available * 100) / 100
}

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id')
  if (!businessId) {
    return NextResponse.json({ error: 'business_id required' }, { status: 400 })
  }

  const { data: requests, error: reqError } = await supabase
    .from('withdrawal_requests')
    .select('id, stream_id, amount, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (reqError) {
    return NextResponse.json({ error: reqError.message }, { status: 500 })
  }

  if (!requests?.length) {
    return NextResponse.json([])
  }

  const streamIds = Array.from(new Set(requests.map((r) => r.stream_id)))
  const { data: streams, error: streamError } = await supabase
    .from('payroll_streams')
    .select('id, employee_id, business_id')
    .in('id', streamIds)
    .eq('business_id', businessId)

  if (streamError || !streams?.length) {
    return NextResponse.json([])
  }

  const streamMap = new Map(streams.map((s) => [s.id, s]))
  const employeeIds = Array.from(new Set(streams.map((s) => s.employee_id)))
  const { data: employees } = await supabase
    .from('employees')
    .select('id, name, wallet_address')
    .in('id', employeeIds)

  const employeeMap = new Map(employees?.map((e) => [e.id, e]) ?? [])

  const list = requests
    .map((r) => {
      const stream = streamMap.get(r.stream_id)
      if (!stream) return null
      const employee = employeeMap.get(stream.employee_id)
      if (!employee) return null
      return {
        id: r.id,
        stream_id: r.stream_id,
        amount: Number(r.amount),
        status: r.status,
        created_at: r.created_at,
        employee_id: stream.employee_id,
        employee_name: employee.name,
        wallet_address: employee.wallet_address,
      }
    })
    .filter(Boolean)

  return NextResponse.json(list)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { stream_id, amount } = body

  if (!stream_id || amount == null) {
    return NextResponse.json(
      { error: 'stream_id and amount required' },
      { status: 400 }
    )
  }

  const amt = Number(amount)
  if (amt <= 0) {
    return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 })
  }

  const { data: stream, error: streamErr } = await supabase
    .from('payroll_streams')
    .select('*')
    .eq('id', stream_id)
    .eq('status', 'active')
    .single()

  if (streamErr || !stream) {
    return NextResponse.json({ error: 'Stream not found' }, { status: 404 })
  }

  const available = getAvailableToWithdraw(stream)
  if (amt > available) {
    return NextResponse.json(
      { error: `Amount exceeds available (${available} USDC)` },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert({ stream_id, amount: amt, status: 'pending' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
