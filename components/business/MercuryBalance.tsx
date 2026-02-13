'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getMercuryBalance } from '@/lib/mercury/mock'
import { formatCurrency } from '@/lib/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

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
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <LoadingSpinner className="h-5 w-5" />
          <span className="text-muted-foreground">Loading balance...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <p className="text-sm text-muted-foreground">Mercury balance (mock)</p>
      <p className="text-3xl font-bold">
        {balance !== null ? formatCurrency(balance, 'USD') : '—'}
      </p>
    </Card>
  )
}
