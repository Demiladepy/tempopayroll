-- Tempo Payroll: Supabase schema
-- Run this in Supabase SQL Editor

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT,
  mercury_account_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  salary_amount DECIMAL(10, 2) NOT NULL,
  salary_currency TEXT DEFAULT 'USDC',
  country TEXT,
  status TEXT DEFAULT 'active',
  auto_convert BOOLEAN DEFAULT false,
  target_currency TEXT DEFAULT 'USDC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, email)
);

-- Payroll transactions table
CREATE TABLE IF NOT EXISTS payroll_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USDC',
  display_currency TEXT,
  display_amount DECIMAL(10, 2),
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll batches table
CREATE TABLE IF NOT EXISTS payroll_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  employee_count INTEGER NOT NULL,
  batch_tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll streams table (salary streaming)
CREATE TABLE IF NOT EXISTS payroll_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  annual_salary DECIMAL(12, 2) NOT NULL,
  stream_rate_per_second DECIMAL(18, 8) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active',
  total_withdrawn DECIMAL(12, 2) DEFAULT 0,
  last_withdrawal_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Withdrawal requests (employee requests stream withdrawal; business pays and completes)
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES payroll_streams(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

 ALTER TABLE employees ADD COLUMN IF NOT EXISTS auto_convert BOOLEAN DEFAULT false;
 ALTER TABLE employees ADD COLUMN IF NOT EXISTS target_currency TEXT DEFAULT 'USDC';
 ALTER TABLE payroll_transactions ADD COLUMN IF NOT EXISTS display_currency TEXT;
 ALTER TABLE payroll_transactions ADD COLUMN IF NOT EXISTS display_amount DECIMAL(10, 2);

-- Enable RLS (optional; adjust policies per your auth model)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_batches ENABLE ROW LEVEL SECURITY;
