export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          email: string
          wallet_address: string | null
          mercury_account_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          wallet_address?: string | null
          mercury_account_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          wallet_address?: string | null
          mercury_account_id?: string | null
          created_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          business_id: string
          name: string
          email: string
          wallet_address: string
          salary_amount: number
          salary_currency: string
          country: string | null
          status: string
          auto_convert: boolean
          target_currency: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          email: string
          wallet_address: string
          salary_amount: number
          salary_currency?: string
          country?: string | null
          status?: string
          auto_convert?: boolean
          target_currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          email?: string
          wallet_address?: string
          salary_amount?: number
          salary_currency?: string
          country?: string | null
          status?: string
          auto_convert?: boolean
          target_currency?: string
          created_at?: string
        }
      }
      payroll_transactions: {
        Row: {
          id: string
          business_id: string
          employee_id: string | null
          amount: number
          currency: string
          display_currency: string | null
          display_amount: number | null
          tx_hash: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          employee_id?: string | null
          amount: number
          currency?: string
          display_currency?: string | null
          display_amount?: number | null
          tx_hash?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          employee_id?: string | null
          amount?: number
          currency?: string
          display_currency?: string | null
          display_amount?: number | null
          tx_hash?: string | null
          status?: string
          created_at?: string
        }
      }
      payroll_batches: {
        Row: {
          id: string
          business_id: string
          total_amount: number
          employee_count: number
          batch_tx_hash: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          total_amount: number
          employee_count: number
          batch_tx_hash?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          total_amount?: number
          employee_count?: number
          batch_tx_hash?: string | null
          status?: string
          created_at?: string
        }
      }
    }
  }
}
