import { useState, useEffect, useCallback } from 'react'
import type { MercuryAccount } from '@/types/mercury'
import { connectMercury, getMercuryBalance } from '@/lib/mercury/mock'

export function useMercury() {
  const [account, setAccount] = useState<MercuryAccount | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshBalance = useCallback(async () => {
    const b = await getMercuryBalance()
    setBalance(b)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const acc = await connectMercury()
        if (!cancelled) setAccount(acc)
        const b = await getMercuryBalance()
        if (!cancelled) setBalance(b)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  return { account, balance, loading, refreshBalance }
}
