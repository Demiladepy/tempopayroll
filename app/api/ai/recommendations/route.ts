import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { getRateToLocal } from '@/lib/currency/rates'
import { getLocalRecommendations, type PayrollContext } from '@/lib/ai/localFallback'

function buildContext(businessId: string) {
  return async () => {
    const { data: employees } = await supabase
      .from('employees')
      .select('id, name, salary_amount, target_currency')
      .eq('business_id', businessId)
      .eq('status', 'active')

    const { data: batches } = await supabase
      .from('payroll_batches')
      .select('total_amount, created_at')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(5)

    const totalPayroll = (employees ?? []).reduce((s, e) => s + Number(e.salary_amount), 0)
    const lastPayroll = batches?.[0]?.created_at ?? null
    const brlRate = getRateToLocal('BRL')

    const context: PayrollContext = {
      total_payroll_usdc: totalPayroll,
      employee_count: employees?.length ?? 0,
      employee_currencies: Array.from(new Set((employees ?? []).map((e) => e.target_currency || 'USDC'))),
      last_payroll_date: lastPayroll,
      recent_batches: (batches ?? []).map((b) => ({ total: b.total_amount, date: b.created_at })),
      demo_brl_rate: brlRate,
    }
    return context
  }
}

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('business_id')
  const question = request.nextUrl.searchParams.get('question') ?? undefined
  if (!businessId) {
    return NextResponse.json({ error: 'business_id required' }, { status: 400 })
  }

  const getContext = buildContext(businessId)
  const context = await getContext()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    const recommendations = getLocalRecommendations(context)
    return NextResponse.json({
      recommendations,
      source: 'local',
      error: 'ANTHROPIC_API_KEY not configured. Showing local insights.',
    })
  }

  const systemPrompt = question
    ? `You are a payroll assistant. Answer the user's question concisely in 1-3 short sentences, using the payroll context provided. Be actionable.`
    : `You are a payroll assistant. Reply with 2-4 short, actionable recommendations only. Each recommendation must be a single line. Focus on: (1) optimal payment timing (gas/fx), (2) budget alerts, (3) reminders (e.g. employee not withdrawn recently). Do not include preamble or numbering in your reply; just the recommendation lines.`
  const userPrompt = question
    ? `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}`
    : `Analyze this payroll data and suggest optimal timing and actions:\n${JSON.stringify(context, null, 2)}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', response.status, err)
      const recommendations = getLocalRecommendations(context)
      return NextResponse.json({
        recommendations,
        source: 'local',
        error: response.status === 429 ? 'Rate limit reached. Showing local insights.' : 'AI temporarily unavailable. Showing local insights.',
      })
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>
    }
    const text = data.content?.find((c) => c.type === 'text')?.text ?? ''
    const recommendations = text
      .split('\n')
      .map((s) => s.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean)

    return NextResponse.json({ recommendations, source: 'claude' })
  } catch (e) {
    console.error('AI recommendations error:', e)
    const recommendations = getLocalRecommendations(context)
    return NextResponse.json({
      recommendations,
      source: 'local',
      error: 'Network or server error. Showing local insights.',
    })
  }
}
