'use client'

import { useState } from 'react'
import type { Employee } from '@/types/employee'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Pencil, User } from 'lucide-react'
import { EditEmployeeModal } from './EditEmployeeModal'

interface EmployeeListProps {
  employees: Employee[]
  onUpdate: (
    id: string,
    updates: Partial<Pick<Employee, 'name' | 'email' | 'wallet_address' | 'salary_amount' | 'salary_currency' | 'country'>>
  ) => Promise<void>
  onRemove: (id: string) => void
}

export function EmployeeList({ employees, onUpdate, onRemove }: EmployeeListProps) {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  function openEdit(employee: Employee) {
    setEditingEmployee(employee)
    setEditOpen(true)
  }

  return (
    <>
      <div className="space-y-3">
        {employees.map((employee) => (
          <Card key={employee.id} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{employee.name}</h3>
                  {employee.country && (
                    <Badge variant="outline">{employee.country}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {employee.wallet_address.slice(0, 6)}...
                    {employee.wallet_address.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ${Number(employee.salary_amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {employee.salary_currency}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(employee)}
                  aria-label="Edit employee"
                  className="h-9 w-9"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(employee.id)}
                  aria-label="Remove employee"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <EditEmployeeModal
        employee={editingEmployee}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onUpdate}
      />
    </>
  )
}
