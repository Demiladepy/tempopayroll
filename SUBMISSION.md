# Submission checklist – Tempo Payroll Rails

Use this before submitting or deploying.

## Code & build

- [ ] `npm install` (no errors)
- [ ] `npm run build` (succeeds)
- [ ] `npm run lint` (no errors)
- [ ] No uncommitted secrets (`.env.local` in `.gitignore`, never committed)

## Environment

- [ ] `.env.local` exists and has:
  - `NEXT_PUBLIC_PRIVY_APP_ID`
  - `PRIVY_APP_SECRET`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_TEMPO_RPC` (optional; defaults in code)
  - `NEXT_PUBLIC_USDC_ADDRESS`
  - `DATABASE_URL` and `DIRECT_URL` (for Prisma; optional if not using Prisma CLI)

## Database

- [ ] Supabase project created
- [ ] `supabase/schema.sql` run in Supabase SQL Editor (tables: businesses, employees, payroll_transactions, payroll_batches)

## Local test

- [ ] `npm run dev` → open http://localhost:3000
- [ ] Landing page loads
- [ ] **Get Started** → connect wallet (Privy) → dashboard loads
- [ ] **Business profile** shows; can edit name/email
- [ ] **Add Employee** works (validation: try invalid email or address)
- [ ] **Edit** (pencil) on an employee works
- [ ] **Payroll** section shows wallet USDC balance and total; insufficient balance shows warning
- [ ] **Payroll history** section present (empty until first run)
- [ ] **Employee Login** → passkey login → employee wallet view (if wallet is in employees table)

## Deploy (Vercel)

- [ ] Repo pushed to GitHub
- [ ] Vercel project created and linked to repo
- [ ] All env vars from “Environment” above added in Vercel (Production, Preview, Development)
- [ ] Deploy triggered; build succeeds
- [ ] Live URL works (landing, dashboard after connect, employee page)

## Notes

- **Mercury** is mock only; balance is static.
- **RLS** is commented out in `supabase/schema.sql`; enable and add policies when using Supabase Auth or API-only writes with server-side verification.
- **API routes** in use: `/api/employees` (GET, POST, PATCH, DELETE), `/api/payroll` (POST for recording runs).
