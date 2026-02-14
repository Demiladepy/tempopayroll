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
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Zap, Plus } from 'lucide-react'
import type { Employee } from '@/types/employee'
import type { PayrollStream } from '@/types/stream'

interface StreamingPayrollProps {
  businessId: string
  employees: Employee[]
  streams: PayrollStream[]
  loading: boolean
  onCreateStream: (params: {
    business_id: string
    employee_id: string
    annual_salary: number
    start_date?: string
  }) => Promise<void>
}

export function StreamingPayroll({
  businessId,
  employees,
  streams,
  loading,
  onCreateStream,
}: StreamingPayrollProps) {
  const [open, setOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [employeeId, setEmployeeId] = useState('')
  const [annualSalary, setAnnualSalary] = useState('')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))

  const streamEmployeeIds = new Set(streams.map((s) => s.employee_id))
  const availableEmployees = employees.filter((e) => !streamEmployeeIds.has(e.id))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const salary = parseFloat(annualSalary)
    if (!employeeId || isNaN(salary) || salary <= 0) return
    setFormLoading(true)
    try {
      await onCreateStream({
        business_id: businessId,
        employee_id: employeeId,
        annual_salary: salary,
        start_date: startDate || undefined,
      })
      setOpen(false)
      setEmployeeId('')
      setAnnualSalary('')
      setStartDate(new Date().toISOString().slice(0, 10))
    } catch (err) {
      console.error(err)
    } finally {
      setFormLoading(false)
    }
  }

  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name ?? id

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <Zap className="h-5 w-5 text-primary" />
        Streaming Payroll
      </h2>
      {loading ? (
        <div className="flex items-center gap-2 py-6">
          <LoadingSpinner className="h-5 w-5" />
          <span className="text-muted-foreground">Loading streams...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {streams.length === 0 ? (
            <Card className="p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Enable salary streaming so employees earn pay per second and can withdraw anytime.
              </p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Enable streaming
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px]">
                  <DialogHeader>
                    <DialogTitle>Enable streaming for an employee</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="stream-employee">Employee</Label>
                      <select
                        id="stream-employee"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select...</option>
                        {availableEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                      {availableEmployees.length === 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          All employees already have streaming enabled.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="stream-annual">Annual salary (USDC)</Label>
                      <Input
                        id="stream-annual"
                        type="number"
                        step="0.01"
                        min="0"
                        value={annualSalary}
                        onChange={(e) => setAnnualSalary(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stream-start">Stream start date</Label>
                      <Input
                        id="stream-start"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={formLoading || availableEmployees.length === 0}>
                      {formLoading ? 'Creating...' : 'Enable streaming'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          ) : (
            <>
              {streams.map((stream) => (
                <Card key={stream.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{getEmployeeName(stream.employee_id)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${Number(stream.annual_salary).toLocaleString()}/yr · started{' '}
                        {new Date(stream.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      Active
                    </Badge>
                  </div>
                </Card>
              ))}
              {availableEmployees.length > 0 && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add streaming for another employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                      <DialogTitle>Enable streaming for an employee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="stream-employee-2">Employee</Label>
                        <select
                          id="stream-employee-2"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          required
                          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select...</option>
                          {availableEmployees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="stream-annual-2">Annual salary (USDC)</Label>
                        <Input
                          id="stream-annual-2"
                          type="number"
                          step="0.01"
                          min="0"
                          value={annualSalary}
                          onChange={(e) => setAnnualSalary(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="stream-start-2">Stream start date</Label>
                        <Input
                          id="stream-start-2"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={formLoading}>
                        {formLoading ? 'Creating...' : 'Enable streaming'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
