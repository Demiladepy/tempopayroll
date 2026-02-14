import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface Business {
  id: string
  name: string
  email: string
  wallet_address: string | null
  mercury_account_id: string | null
  created_at: string
}

export function useBusiness(businessId: string | null) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBusiness = useCallback(async () => {
    if (!businessId) {
      setBusiness(null)
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (!error && data) {
      setBusiness(data as Business)
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchBusiness()
  }, [fetchBusiness])

  async function updateBusiness(updates: Partial<Pick<Business, 'name' | 'email'>>) {
    if (!businessId) throw new Error('No business selected')
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .single()

    if (!error && data) {
      setBusiness(data as Business)
      return data
    }
    throw error
  }

  return { business, loading, updateBusiness, refetch: fetchBusiness }
}
