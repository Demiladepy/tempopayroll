'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Employee, TargetCurrency } from '@/types/employee'
import {
  isValidAddress,
  isValidEmail,
  isValidSalary,
} from '@/lib/utils/validation'

interface EditEmployeeModalProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (
    id: string,
    updates: Partial<Pick<Employee, 'name' | 'email' | 'wallet_address' | 'salary_amount' | 'salary_currency' | 'country' | 'auto_convert' | 'target_currency'>>
  ) => Promise<void>
}

export function EditEmployeeModal({
  employee,
  open,
  onOpenChange,
  onSave,
}: EditEmployeeModalProps) {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet_address: '',
    salary_amount: '',
    country: '',
    auto_convert: false,
    target_currency: 'USDC' as TargetCurrency,
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        wallet_address: employee.wallet_address,
        salary_amount: String(employee.salary_amount),
        country: employee.country ?? '',
        auto_convert: Boolean(employee.auto_convert),
        target_currency: (employee.target_currency as TargetCurrency) || 'USDC',
      })
      setFieldErrors({})
    }
  }, [employee, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!employee) return
    setFieldErrors({})

    const wallet = formData.wallet_address.trim().toLowerCase()
    const salary = parseFloat(formData.salary_amount)
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!isValidEmail(formData.email)) errors.email = 'Invalid email address'
    if (!wallet) errors.wallet_address = 'Wallet address is required'
    else if (!isValidAddress(wallet)) errors.wallet_address = 'Invalid Ethereum address (0x + 40 hex chars)'
    if (formData.salary_amount === '' || isNaN(salary)) errors.salary_amount = 'Salary is required'
    else if (!isValidSalary(salary)) errors.salary_amount = 'Salary must be a positive number'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      await onSave(employee.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        wallet_address: wallet,
        salary_amount: salary,
        salary_currency: 'USDC',
        country: formData.country || null,
        auto_convert: formData.auto_convert,
        target_currency: formData.target_currency,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update employee:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }))
              }}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-destructive">{fieldErrors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
              }}
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-destructive">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-wallet">Wallet Address</Label>
            <Input
              id="edit-wallet"
              value={formData.wallet_address}
              onChange={(e) => {
                setFormData({ ...formData, wallet_address: e.target.value })
                if (fieldErrors.wallet_address) setFieldErrors((prev) => ({ ...prev, wallet_address: '' }))
              }}
              placeholder="0x..."
              required
            />
            {fieldErrors.wallet_address && (
              <p className="mt-1 text-sm text-destructive">{fieldErrors.wallet_address}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-salary">Salary (USDC)</Label>
              <Input
                id="edit-salary"
                type="number"
                step="0.01"
                value={formData.salary_amount}
                onChange={(e) => {
                  setFormData({ ...formData, salary_amount: e.target.value })
                  if (fieldErrors.salary_amount) setFieldErrors((prev) => ({ ...prev, salary_amount: '' }))
                }}
                required
              />
              {fieldErrors.salary_amount && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.salary_amount}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-auto_convert"
                checked={formData.auto_convert}
                onChange={(e) =>
                  setFormData({ ...formData, auto_convert: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="edit-auto_convert" className="font-normal cursor-pointer">
                Auto-convert to local currency on receipt
              </Label>
            </div>
            {formData.auto_convert && (
              <div>
                <Label htmlFor="edit-target_currency">Target currency</Label>
                <select
                  id="edit-target_currency"
                  value={formData.target_currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_currency: e.target.value as TargetCurrency,
                    })
                  }
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="USDC">USDC</option>
                  <option value="BRL">BRL</option>
                  <option value="INR">INR</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
