'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase/client'
import { useEmployees } from '@/hooks/useEmployees'
import { useBusiness } from '@/hooks/useBusiness'
import { usePayrollHistory } from '@/hooks/usePayrollHistory'
import { EmployeeList } from '@/components/business/EmployeeList'
import { PayrollHistory } from '@/components/business/PayrollHistory'
import { AddEmployeeModal } from '@/components/business/AddEmployeeModal'
import { BusinessProfile } from '@/components/business/BusinessProfile'
import { PayrollButton } from '@/components/business/PayrollButton'
import { MercuryBalance } from '@/components/business/MercuryBalance'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function DashboardPage() {
  const { ready, authenticated, user, login } = usePrivy()
  const { businessId, setBusinessId } = useAuthStore()
  const [initialized, setInitialized] = useState(false)
  const { business, updateBusiness } = useBusiness(businessId)
  const { batches: payrollBatches, loading: payrollHistoryLoading, refetch: refetchPayrollHistory } = usePayrollHistory(businessId)
  const { employees, loading, addEmployee, updateEmployee, removeEmployee, refetch } =
    useEmployees(businessId ?? '')

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
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Business Dashboard</h1>
        <p className="text-muted-foreground">
          Sign in with your wallet to manage payroll.
        </p>
        <Button onClick={login}>Connect Wallet</Button>
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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddEmployeeModal businessId={businessId} onAdd={addEmployee} />
      </div>

      <BusinessProfile business={business} onUpdate={updateBusiness} />
      <MercuryBalance />

      <section>
        <h2 className="mb-4 text-xl font-semibold">Employees</h2>
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

      <section>
        <PayrollButton
          businessId={businessId}
          employees={employees}
          onSuccess={() => {
            refetch()
            refetchPayrollHistory()
          }}
        />
      </section>

      <section>
        <PayrollHistory batches={payrollBatches} loading={payrollHistoryLoading} />
      </section>
    </div>
  )
}
