import { useState, useEffect, useCallback } from 'react'
import type { Employee } from '@/types/employee'

export function useEmployees(businessId: string) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = useCallback(async () => {
    if (!businessId) {
      setLoading(false)
      return
    }
    const res = await fetch(`/api/employees?business_id=${encodeURIComponent(businessId)}`)
    if (!res.ok) {
      setLoading(false)
      return
    }
    const data = await res.json()
    setEmployees(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  async function addEmployee(employee: Omit<Employee, 'id' | 'created_at'>) {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to add employee')
    }
    const data = await res.json()
    setEmployees((prev) => [...prev, data])
    return data
  }

  async function updateEmployee(
    id: string,
    updates: Partial<Pick<Employee, 'name' | 'email' | 'wallet_address' | 'salary_amount' | 'salary_currency' | 'country'>>
  ) {
    const payload: Record<string, unknown> = { id, ...updates }
    if (payload.wallet_address !== undefined) {
      payload.wallet_address = String(payload.wallet_address).trim().toLowerCase()
    }
    const res = await fetch('/api/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to update employee')
    }
    const data = await res.json()
    setEmployees((prev) => prev.map((e) => (e.id === id ? data : e)))
    return data
  }

  async function removeEmployee(id: string) {
    const res = await fetch(`/api/employees?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to remove employee')
    }
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  return { employees, loading, addEmployee, updateEmployee, removeEmployee, refetch: fetchEmployees }
}
