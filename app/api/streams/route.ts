import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

const SECONDS_PER_YEAR = 365.25 * 24 * 3600

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id')
  const employeeId = request.nextUrl.searchParams.get('employee_id')

  if (!businessId && !employeeId) {
    return NextResponse.json(
      { error: 'business_id or employee_id required' },
      { status: 400 }
    )
  }

  let query = supabase.from('payroll_streams').select('*')

  if (businessId) query = query.eq('business_id', businessId)
  if (employeeId) query = query.eq('employee_id', employeeId)

  const { data, error } = await query.eq('status', 'active').order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { business_id, employee_id, annual_salary, start_date } = body

  if (!business_id || !employee_id || annual_salary == null) {
    return NextResponse.json(
      { error: 'business_id, employee_id, and annual_salary required' },
      { status: 400 }
    )
  }

  const start = start_date ? new Date(start_date) : new Date()
  const salary = Number(annual_salary)
  const stream_rate_per_second = salary / SECONDS_PER_YEAR

  const { data, error } = await supabase
    .from('payroll_streams')
    .insert({
      business_id,
      employee_id,
      annual_salary: salary,
      stream_rate_per_second,
      start_date: start.toISOString(),
      status: 'active',
      total_withdrawn: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
