'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Building2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { isValidEmail } from '@/lib/utils/validation'
import type { Business } from '@/hooks/useBusiness'

interface BusinessProfileProps {
  business: Business | null
  onUpdate: (updates: { name?: string; email?: string }) => Promise<void>
}

export function BusinessProfile({ business, onUpdate }: BusinessProfileProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })

  function openModal() {
    if (business) {
      setFormData({ name: business.name, email: business.email })
      setError(null)
    }
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }
    if (!isValidEmail(formData.email)) {
      setError('Invalid email address')
      return
    }
    setLoading(true)
    try {
      await onUpdate({ name: formData.name.trim(), email: formData.email.trim() })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (!business) return null

  return (
    <>
      <Card className="rounded-2xl border-border/60 bg-card/50 p-6 shadow-fintech">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </span>
              Business profile
            </h2>
            <p className="mt-3 text-2xl font-bold">{business.name}</p>
            <p className="text-sm text-muted-foreground">{business.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={openModal}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit business profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="business-email">Email</Label>
              <Input
                id="business-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
