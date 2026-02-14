'use client'

import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils/format'
import { Receipt } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  currency: string
  tx_hash: string | null
  status: string
  created_at: string
}

interface PaymentHistoryProps {
  payments: Payment[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Receipt className="h-5 w-5 text-primary" />
          Payment History
        </h2>
        <p className="text-sm text-muted-foreground">No payments yet.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Receipt className="h-5 w-5 text-primary" />
        Payment History
      </h2>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-medium">
                ${Number(payment.amount).toLocaleString()} {payment.currency}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(payment.created_at)}
              </p>
            </div>
            <div className="text-right">
              <span
                className={
                  payment.status === 'confirmed'
                    ? 'text-green-600'
                    : 'text-muted-foreground'
                }
              >
                {payment.status}
              </span>
              {payment.tx_hash && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {payment.tx_hash.slice(0, 10)}...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
