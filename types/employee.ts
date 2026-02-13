export interface Employee {
  id: string
  business_id: string
  name: string
  email: string
  wallet_address: string
  salary_amount: number
  salary_currency: string
  country: string | null
  status: string
  created_at: string
}

export type EmployeeInsert = Omit<Employee, 'id' | 'created_at'>
