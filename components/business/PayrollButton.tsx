'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePayroll } from '@/hooks/usePayroll'
import type { Employee } from '@/types/employee'
import { Send, CheckCircle } from 'lucide-react'
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

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        onClick={handlePayroll}
        disabled={disabled || loading || employees.length === 0}
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
