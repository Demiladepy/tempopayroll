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
import type { EmployeeInsert } from '@/types/employee'

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
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await onAdd({
        business_id: businessId,
        name: formData.name,
        email: formData.email,
        wallet_address: formData.wallet_address.trim().toLowerCase(),
        salary_amount: parseFloat(formData.salary_amount),
        salary_currency: 'USDC',
        country: formData.country || null,
        status: 'active',
      })
      setOpen(false)
      setFormData({
        name: '',
        email: '',
        wallet_address: '',
        salary_amount: '',
        country: '',
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.wallet_address}
              onChange={(e) =>
                setFormData({ ...formData, wallet_address: e.target.value })
              }
              placeholder="0x..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary">Salary (USDC)</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                value={formData.salary_amount}
                onChange={(e) =>
                  setFormData({ ...formData, salary_amount: e.target.value })
                }
                required
              />
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Employee'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
