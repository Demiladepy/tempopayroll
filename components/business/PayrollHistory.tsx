'use client'

import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/format'
import { ExternalLink, History } from 'lucide-react'

const EXPLORER_TX_URL = 'https://explorer.testnet.tempo.org/tx'

interface Batch {
  id: string
  total_amount: number
  employee_count: number
  batch_tx_hash: string | null
  status: string
  created_at: string
}

interface PayrollHistoryProps {
  batches: Batch[]
  loading: boolean
}

export function PayrollHistory({ batches, loading }: PayrollHistoryProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <History className="h-5 w-5 text-primary" />
          Payroll history
        </h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    )
  }

  if (batches.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <History className="h-5 w-5 text-primary" />
          Payroll history
        </h2>
        <p className="text-sm text-muted-foreground">No payroll runs yet.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <History className="h-5 w-5 text-primary" />
        Payroll history
      </h2>
      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-medium">
                ${Number(batch.total_amount).toLocaleString()} USDC
              </p>
              <p className="text-sm text-muted-foreground">
                {batch.employee_count} employee{batch.employee_count !== 1 ? 's' : ''} · {formatDate(batch.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  batch.status === 'confirmed'
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {batch.status}
              </span>
              {batch.batch_tx_hash && (
                <a
                  href={`${EXPLORER_TX_URL}/${batch.batch_tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
