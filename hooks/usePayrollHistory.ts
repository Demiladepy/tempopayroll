import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface PayrollBatchRow {
  id: string
  business_id: string
  total_amount: number
  employee_count: number
  batch_tx_hash: string | null
  status: string
  created_at: string
}

export function usePayrollHistory(businessId: string | null) {
  const [batches, setBatches] = useState<PayrollBatchRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBatches = useCallback(async () => {
    if (!businessId) {
      setBatches([])
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('payroll_batches')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      setBatches(data as PayrollBatchRow[])
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  return { batches, loading, refetch: fetchBatches }
}
