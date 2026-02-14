'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePayroll } from '@/hooks/usePayroll'
import { useWallets } from '@privy-io/react-auth'
import { useBalance } from 'wagmi'
import { USDC_ADDRESS } from '@/lib/tempo/config'
import { formatUnits } from 'viem'
import type { Employee } from '@/types/employee'
import { Send, CheckCircle, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PayrollButtonProps {
  businessId: string
  employees: Employee[]
  disabled?: boolean
  onSuccess?: () => void
}

export function PayrollButton({
  businessId,
  employees,
  disabled,
  onSuccess,
}: PayrollButtonProps) {
  const { runPayroll, loading } = usePayroll()
  const { wallets } = useWallets()
  const walletAddress = wallets[0]?.address
  const { data: usdcBalance } = useBalance({
    address: walletAddress as `0x${string}` | undefined,
    token: USDC_ADDRESS,
    chainId: 42431,
  })
  const { toast } = useToast()
  const [success, setSuccess] = useState(false)

  async function handlePayroll() {
    try {
      const txHashes = await runPayroll(businessId, employees)
      setSuccess(true)
      onSuccess?.()

      toast({
        title: 'Payroll Executed!',
        description: `Successfully paid ${employees.length} employees. ${txHashes.length} transactions confirmed.`,
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Payroll failed'
      toast({
        title: 'Payroll Failed',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const totalAmount = employees.reduce(
    (sum, emp) => sum + Number(emp.salary_amount),
    0
  )

  const balanceWei = usdcBalance?.value ?? 0n
  const balanceUsdc = usdcBalance ? Number(formatUnits(balanceWei, 6)) : 0
  const insufficientBalance = totalAmount > 0 && balanceUsdc < totalAmount

  return (
    <div className="space-y-2">
      {walletAddress && (
        <p className="text-sm text-muted-foreground text-center">
          Wallet balance: ${balanceUsdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
        </p>
      )}
      {insufficientBalance && (
        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            Insufficient USDC. You need ${totalAmount.toLocaleString()} but have ${balanceUsdc.toLocaleString(undefined, { minimumFractionDigits: 2 })}.
          </span>
        </div>
      )}
      <Button
        size="lg"
        onClick={handlePayroll}
        disabled={disabled || loading || employees.length === 0 || insufficientBalance}
        className="w-full"
      >
        {loading ? (
          <>Processing...</>
        ) : success ? (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            Payroll Complete!
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Run Payroll
          </>
        )}
      </Button>
      <p className="text-sm text-muted-foreground text-center">
        {employees.length} employees · ${totalAmount.toLocaleString()} USDC
        total
      </p>
    </div>
  )
}
