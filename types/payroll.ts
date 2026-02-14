export interface PayrollTransaction {
  id: string
  business_id: string
  employee_id: string | null
  amount: number
  currency: string
  display_currency?: string | null
  display_amount?: number | null
  tx_hash: string | null
  status: string
  created_at: string
}

export interface PayrollBatch {
  id: string
  business_id: string
  total_amount: number
  employee_count: number
  batch_tx_hash: string | null
  status: string
  created_at: string
}
