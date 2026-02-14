'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import type { EmployeeInsert, TargetCurrency } from '@/types/employee'
import {
  isValidAddress,
  isValidEmail,
  isValidSalary,
} from '@/lib/utils/validation'

interface AddEmployeeModalProps {
  businessId: string
  onAdd: (employee: EmployeeInsert) => Promise<void>
}

export function AddEmployeeModal({ businessId, onAdd }: AddEmployeeModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet_address: '',
    salary_amount: '',
    country: '',
    auto_convert: false,
    target_currency: 'USDC' as TargetCurrency,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
      await onAdd({
        business_id: businessId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        wallet_address: wallet,
        salary_amount: salary,
        salary_currency: 'USDC',
        country: formData.country || null,
        status: 'active',
        auto_convert: formData.auto_convert,
        target_currency: formData.target_currency,
      })
      setOpen(false)
      setFormData({
        name: '',
        email: '',
        wallet_address: '',
        salary_amount: '',
        country: '',
        auto_convert: false,
        target_currency: 'USDC',
      })
    } catch (error) {
      console.error('Failed to add employee:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (fieldErrors.name) setFieldErrors((e) => ({ ...e, name: '' }))
              }}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-destructive">{fieldErrors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: '' }))
              }}
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-destructive">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.wallet_address}
              onChange={(e) => {
                setFormData({ ...formData, wallet_address: e.target.value })
                if (fieldErrors.wallet_address) setFieldErrors((e) => ({ ...e, wallet_address: '' }))
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
              <Label htmlFor="salary">Salary (USDC)</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                value={formData.salary_amount}
                onChange={(e) => {
                  setFormData({ ...formData, salary_amount: e.target.value })
                  if (fieldErrors.salary_amount) setFieldErrors((e) => ({ ...e, salary_amount: '' }))
                }}
                required
              />
              {fieldErrors.salary_amount && (
                <p className="mt-1 text-sm text-destructive">{fieldErrors.salary_amount}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto_convert"
                checked={formData.auto_convert}
                onChange={(e) =>
                  setFormData({ ...formData, auto_convert: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="auto_convert" className="font-normal cursor-pointer">
                Auto-convert to local currency on receipt
              </Label>
            </div>
            {formData.auto_convert && (
              <div>
                <Label htmlFor="target_currency">Target currency</Label>
                <select
                  id="target_currency"
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
            {loading ? 'Adding...' : 'Add Employee'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
