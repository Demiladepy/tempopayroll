import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Employee } from '@/types/employee'

export function useEmployees(businessId: string) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = useCallback(async () => {
    if (!businessId) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'active')

    if (!error && data) {
      setEmployees(data)
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  async function addEmployee(employee: Omit<Employee, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single()

    if (!error && data) {
      setEmployees((prev) => [...prev, data])
      return data
    }
    throw error
  }

  async function removeEmployee(id: string) {
    const { error } = await supabase
      .from('employees')
      .update({ status: 'inactive' })
      .eq('id', id)

    if (!error) {
      setEmployees((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return { employees, loading, addEmployee, removeEmployee, refetch: fetchEmployees }
}
