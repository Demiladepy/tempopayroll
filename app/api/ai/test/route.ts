import { NextResponse } from 'next/server'

/**
 * Test if ANTHROPIC_API_KEY is set and accepts requests (e.g. not rate-limited, valid key).
 */
export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY not configured' })
  }

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
        max_tokens: 32,
        messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      const message =
        response.status === 429
          ? 'Rate limit exceeded'
          : response.status === 401
            ? 'Invalid API key'
            : `API error: ${response.status}`
      return NextResponse.json({ ok: false, error: message })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error'
    return NextResponse.json({ ok: false, error: message })
  }
}
