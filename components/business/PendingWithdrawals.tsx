'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePayroll } from '@/hooks/usePayroll'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ArrowDownCircle } from 'lucide-react'

interface WithdrawalRequest {
  id: string
  stream_id: string
  amount: number
  status: string
  created_at: string
  employee_id: string
  employee_name: string
  wallet_address: string
}

interface PendingWithdrawalsProps {
  businessId: string
  onComplete?: () => void
}

export function PendingWithdrawals({ businessId, onComplete }: PendingWithdrawalsProps) {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)
  const { runPayroll } = usePayroll()
  const { toast } = useToast()

  const fetchRequests = useCallback(async () => {
    const res = await fetch(`/api/streams/withdraw?business_id=${encodeURIComponent(businessId)}`)
    if (!res.ok) return
    const data = await res.json()
    setRequests(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  async function handlePay(req: WithdrawalRequest) {
    setPayingId(req.id)
    try {
      const txHashes = await runPayroll(businessId, [
        {
          id: req.employee_id,
          wallet_address: req.wallet_address,
          salary_amount: req.amount,
        },
      ])
      const txHash = txHashes?.[0] ?? null
      const completeRes = await fetch('/api/streams/withdraw/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: req.id,
          business_id: businessId,
          tx_hash: txHash,
        }),
      })
      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed to complete withdrawal')
      }
      toast({
        title: 'Withdrawal paid',
        description: `Paid ${req.employee_name} $${req.amount.toLocaleString()} USDC.`,
      })
      await fetchRequests()
      onComplete?.()
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Payment failed'
      toast({
        title: 'Payment failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setPayingId(null)
    }
  }

  if (loading) return null
  if (requests.length === 0) return null

  return (
    <Card className="p-4">
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <ArrowDownCircle className="h-4 w-4 text-primary" />
        Pending withdrawals
      </h3>
      <ul className="space-y-2">
        {requests.map((req) => (
          <li
            key={req.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{req.employee_name}</p>
              <p className="text-sm text-muted-foreground">
                ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC requested
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handlePay(req)}
              disabled={payingId !== null}
              className="gap-2"
            >
              {payingId === req.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Paying...
                </>
              ) : (
                'Pay now'
              )}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
