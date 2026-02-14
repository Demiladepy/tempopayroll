'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { WalletCard } from '@/components/employee/WalletCard'
import { PaymentHistory } from '@/components/employee/PaymentHistory'
import { StreamingBalance } from '@/components/employee/StreamingBalance'
import { PasskeyLogin } from '@/components/employee/PasskeyLogin'
import { Button } from '@/components/ui/button'
import { LogOut, Wallet } from 'lucide-react'

export default function EmployeePage() {
  const { user, logout } = usePrivy()
  const [employee, setEmployee] = useState<{
    id: string
    name: string
    salary_amount: number
    status: string
    [key: string]: unknown
  } | null>(null)
  const [payments, setPayments] = useState<
    Array<{
      id: string
      amount: number
      currency: string
      tx_hash: string | null
      status: string
      created_at: string
    }>
  >([])

  useEffect(() => {
    if (!user?.wallet?.address) return

    async function fetchEmployeeData() {
      const wallet = (user?.wallet?.address ?? '').toLowerCase()
      const { data: empData } = await supabase
        .from('employees')
        .select('*')
        .eq('wallet_address', wallet)
        .single()

      setEmployee(empData ?? null)

      if (empData) {
        const { data: paymentsData } = await supabase
          .from('payroll_transactions')
          .select('*')
          .eq('employee_id', empData.id)
          .order('created_at', { ascending: false })
          .limit(10)

        setPayments(paymentsData ?? [])
      }
    }

    fetchEmployeeData()
  }, [user?.wallet?.address])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Employee Wallet</h1>
        <p className="text-center text-muted-foreground max-w-sm">
          Login with your passkey to view your wallet and payment history.
        </p>
        <PasskeyLogin label="Login with Passkey" className="gap-2 min-w-[200px]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="h-6 w-6" />
            </span>
            My Wallet
          </h1>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <WalletCard
          employee={employee}
          walletAddress={user.wallet?.address ?? undefined}
        />
        {employee && <StreamingBalance employeeId={employee.id} />}
        <PaymentHistory payments={payments} />
      </div>
    </div>
  )
}
