'use client'

import { useState } from 'react'
import type { Employee } from '@/types/employee'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Pencil } from 'lucide-react'
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
          <Card key={employee.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(employee.id)}
                  aria-label="Remove employee"
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
