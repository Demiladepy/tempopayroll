'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase/client'
import { useEmployees } from '@/hooks/useEmployees'
import { useBusiness } from '@/hooks/useBusiness'
import { usePayrollHistory } from '@/hooks/usePayrollHistory'
import { useStreams } from '@/hooks/useStreams'
import { EmployeeList } from '@/components/business/EmployeeList'
import { PayrollHistory } from '@/components/business/PayrollHistory'
import { StreamingPayroll } from '@/components/business/StreamingPayroll'
import { PendingWithdrawals } from '@/components/business/PendingWithdrawals'
import { AIAssistantCard } from '@/components/business/AIAssistantCard'
import { AddEmployeeModal } from '@/components/business/AddEmployeeModal'
import { BusinessProfile } from '@/components/business/BusinessProfile'
import { PayrollButton } from '@/components/business/PayrollButton'
import { MercuryBalance } from '@/components/business/MercuryBalance'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Wallet, Users, Send } from 'lucide-react'

export default function DashboardPage() {
  const { ready, authenticated, user, login } = usePrivy()
  const { businessId, setBusinessId } = useAuthStore()
  const [initialized, setInitialized] = useState(false)
  const { business, updateBusiness } = useBusiness(businessId)
  const { batches: payrollBatches, loading: payrollHistoryLoading, refetch: refetchPayrollHistory } = usePayrollHistory(businessId)
  const { employees, loading, addEmployee, updateEmployee, removeEmployee, refetch } =
    useEmployees(businessId ?? '')
  const { streams, loading: streamsLoading, createStream, refetch: refetchStreams } = useStreams(businessId)

  useEffect(() => {
    if (!authenticated || !user?.wallet?.address) return
    const u = user

    async function ensureBusiness() {
      const address = u.wallet?.address as string
      const { data: existing } = await supabase
        .from('businesses')
        .select('id')
        .eq('wallet_address', address.toLowerCase())
        .single()

      if (existing) {
        setBusinessId(existing.id)
        setInitialized(true)
        return
      }

      const { data: inserted, error } = await supabase
        .from('businesses')
        .insert({
          name: 'My Business',
          email: u.email?.address ?? `${address.slice(0, 8)}@tempo.local`,
          wallet_address: address.toLowerCase(),
          mercury_account_id: 'merc_demo_123',
        })
        .select('id')
        .single()

      if (!error && inserted) {
        setBusinessId(inserted.id)
      }
      setInitialized(true)
    }

    ensureBusiness()
  }, [authenticated, user, setBusinessId])

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Business Dashboard</h1>
        <p className="text-center text-muted-foreground max-w-sm">
          Sign in with your wallet to manage payroll.
        </p>
        <Button onClick={login} size="lg" className="gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </Button>
      </div>
    )
  }

  if (!initialized || !businessId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-4xl space-y-8 px-1 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage payroll and your team</p>
          </div>
          <AddEmployeeModal businessId={businessId} onAdd={addEmployee} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <BusinessProfile business={business} onUpdate={updateBusiness} />
          <MercuryBalance />
        </div>

        <AIAssistantCard businessId={businessId} />

      <section className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-fintech">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Users className="h-5 w-5 text-primary" />
          Employees
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 py-8">
            <LoadingSpinner className="h-5 w-5" />
            <span className="text-muted-foreground">Loading employees...</span>
          </div>
        ) : (
          <EmployeeList
            employees={employees}
            onUpdate={updateEmployee}
            onRemove={removeEmployee}
          />
        )}
      </section>

      <StreamingPayroll
        businessId={businessId}
        employees={employees}
        streams={streams}
        loading={streamsLoading}
        onCreateStream={createStream}
      />

      <PendingWithdrawals businessId={businessId} onComplete={refetchStreams} />

      <section className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-fintech">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Send className="h-5 w-5 text-primary" />
          Run Payroll
        </h2>
        <PayrollButton
          businessId={businessId}
          employees={employees}
          onSuccess={() => {
            refetch()
            refetchPayrollHistory()
          }}
        />
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/50 p-6 shadow-fintech">
        <PayrollHistory batches={payrollBatches} loading={payrollHistoryLoading} />
      </section>
      </div>
    </div>
  )
}
