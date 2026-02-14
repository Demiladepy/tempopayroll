import { useState, useEffect, useCallback } from 'react'
import type { PayrollStream } from '@/types/stream'

export function useStreams(businessId: string | null) {
  const [streams, setStreams] = useState<PayrollStream[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStreams = useCallback(async () => {
    if (!businessId) {
      setLoading(false)
      return
    }
    const res = await fetch(`/api/streams?business_id=${encodeURIComponent(businessId)}`)
    if (!res.ok) {
      setLoading(false)
      return
    }
    const data = await res.json()
    setStreams(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchStreams()
  }, [fetchStreams])

  async function createStream(params: {
    business_id: string
    employee_id: string
    annual_salary: number
    start_date?: string
  }) {
    const res = await fetch('/api/streams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to create stream')
    }
    const data = await res.json()
    setStreams((prev) => [data, ...prev])
    return data
  }

  return { streams, loading, createStream, refetch: fetchStreams }
}
