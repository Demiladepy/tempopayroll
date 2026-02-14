'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, Loader2 } from 'lucide-react'
import type { PayrollStream } from '@/types/stream'

interface StreamingBalanceProps {
  employeeId: string
}

function getEarnedAndAvailable(stream: PayrollStream) {
  const start = new Date(stream.start_date).getTime()
  const secondsElapsed = (Date.now() - start) / 1000
  const earned = secondsElapsed * stream.stream_rate_per_second
  const totalWithdrawn = Number(stream.total_withdrawn)
  const available = Math.max(0, earned - totalWithdrawn)
  return {
    earned: Math.round(earned * 100) / 100,
    available: Math.round(available * 100) / 100,
  }
}

export function StreamingBalance({ employeeId }: StreamingBalanceProps) {
  const [stream, setStream] = useState<PayrollStream | null>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)
  const [requested, setRequested] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchStream() {
      const res = await fetch(`/api/streams?employee_id=${encodeURIComponent(employeeId)}`)
      if (!res.ok || cancelled) return
      const data = await res.json()
      const list = Array.isArray(data) ? data : []
      if (!cancelled) {
        setStream(list[0] ?? null)
      }
      setLoading(false)
    }
    fetchStream()
    return () => {
      cancelled = true
    }
  }, [employeeId])

  const [earned, setEarned] = useState(0)
  const [available, setAvailable] = useState(0)

  useEffect(() => {
    if (!stream) return
    const update = () => {
      const { earned: e, available: a } = getEarnedAndAvailable(stream)
      setEarned(e)
      setAvailable(a)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [stream])

  async function handleWithdraw() {
    if (!stream || available <= 0) return
    setWithdrawing(true)
    try {
      const res = await fetch('/api/streams/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream_id: stream.id, amount: available }),
      })
      if (res.ok) {
        setRequested(true)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.error ?? 'Request failed')
      }
    } catch (e) {
      console.error(e)
      alert('Request failed')
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading || !stream) return null

  return (
    <Card className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Zap className="h-5 w-5 text-primary" />
        Salary stream
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Earned so far</span>
          <span className="font-medium">${earned.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Available to withdraw</span>
          <span className="font-medium">${available.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC</span>
        </div>
        {requested ? (
          <p className="text-sm text-muted-foreground">
            Withdrawal requested. Your employer will process the payment.
          </p>
        ) : (
          <Button
            onClick={handleWithdraw}
            disabled={available <= 0 || withdrawing}
            className="w-full gap-2"
          >
            {withdrawing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              'Request withdrawal'
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
