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
  const { business_id, name, email, wallet_address, salary_amount, salary_currency, country, auto_convert, target_currency } =
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
      auto_convert: Boolean(auto_convert),
      target_currency: target_currency ?? 'USDC',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, name, email, wallet_address, salary_amount, salary_currency, country, auto_convert, target_currency } = body

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (email !== undefined) updates.email = email
  if (wallet_address !== undefined) updates.wallet_address = String(wallet_address).trim().toLowerCase()
  if (salary_amount !== undefined) updates.salary_amount = Number(salary_amount)
  if (salary_currency !== undefined) updates.salary_currency = salary_currency
  if (country !== undefined) updates.country = country || null
  if (auto_convert !== undefined) updates.auto_convert = Boolean(auto_convert)
  if (target_currency !== undefined) updates.target_currency = target_currency

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('employees')
    .update({ status: 'inactive' })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
