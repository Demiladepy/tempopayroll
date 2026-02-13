import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id')
  if (!businessId) {
    return NextResponse.json(
      { error: 'business_id required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('business_id', businessId)
    .eq('status', 'active')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { business_id, name, email, wallet_address, salary_amount, salary_currency, country } =
    body

  if (
    !business_id ||
    !name ||
    !email ||
    !wallet_address ||
    salary_amount == null
  ) {
    return NextResponse.json(
      { error: 'business_id, name, email, wallet_address, salary_amount required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('employees')
    .insert({
      business_id,
      name,
      email,
      wallet_address: String(wallet_address).toLowerCase(),
      salary_amount: Number(salary_amount),
      salary_currency: salary_currency ?? 'USDC',
      country: country ?? null,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
