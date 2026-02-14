export interface PayrollStream {
  id: string
  employee_id: string
  business_id: string
  annual_salary: number
  stream_rate_per_second: number
  start_date: string
  status: string
  total_withdrawn: number
  last_withdrawal_at: string | null
  created_at: string
}
