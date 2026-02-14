'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getMercuryBalance } from '@/lib/mercury/mock'
import { formatCurrency } from '@/lib/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Banknote } from 'lucide-react'

export function MercuryBalance() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMercuryBalance()
      .then(setBalance)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="rounded-2xl border-border/60 bg-card/50 p-6 shadow-fintech">
        <div className="flex items-center gap-3">
          <LoadingSpinner className="h-5 w-5 text-primary" />
          <span className="text-muted-foreground">Loading balance...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border/60 bg-card/50 p-6 shadow-fintech">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Banknote className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">Mercury balance (mock)</p>
      </div>
      <p className="text-3xl font-bold tracking-tight">
        {balance !== null ? formatCurrency(balance, 'USD') : '—'}
      </p>
    </Card>
  )
}
