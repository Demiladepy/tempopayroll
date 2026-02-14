# Tempo Payroll Rails

Professional payroll system connecting Mercury business accounts to Tempo blockchain for instant global stablecoin payments using Privy passkey wallets.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** TailwindCSS + shadcn/ui
- **Auth/Wallets:** Privy SDK
- **Blockchain:** Tempo Testnet (Chain ID: 42431)
- **Web3:** viem + wagmi
- **Database:** Supabase (PostgreSQL)
- **State:** Zustand
- **Deploy:** Vercel

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in:

   - `NEXT_PUBLIC_PRIVY_APP_ID` – from [Privy Dashboard](https://dashboard.privy.io)
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` – from Supabase
   - `NEXT_PUBLIC_TEMPO_RPC` – e.g. `https://rpc.moderato.tempo.xyz`
   - `NEXT_PUBLIC_USDC_ADDRESS` – TIP-20 USDC contract on Tempo testnet

3. **Database**

   Run the SQL from the implementation plan (businesses, employees, payroll_transactions, payroll_batches) in your Supabase SQL editor.

4. **Run dev server**

   ```bash
   npm run dev
   ```

## Before you submit

- [ ] **Build passes:** `npm run build`
- [ ] **Env set:** `.env.local` has all required vars (do not commit; use `.env.example` as reference)
- [ ] **DB ready:** Supabase tables created via `supabase/schema.sql`
- [ ] **Smoke test:** Run `npm run dev`, open dashboard → connect wallet → add one employee → see payroll section and history
- [ ] **Deploy:** Push to GitHub, connect to Vercel, add env vars, deploy (see Deploy to Vercel below)

See `SUBMISSION.md` for a detailed submission checklist.

## What’s left (launch checklist)

| Item | Status |
|------|--------|
| **Privy** | Done |
| **Supabase** | Done |
| **DB tables** | Done (businesses, employees, payroll_transactions, payroll_batches) |
| **Tempo RPC + USDC address** | Done |
| **Optional** | Test locally: `npm run dev` → connect wallet, add employees, run payroll (needs USDC in wallet) |
| **Deploy** | Push to GitHub → connect to Vercel → add env vars (see below) |

## Demo Flow

1. Open landing → **Get Started** → connect wallet (dashboard).
2. Add employees (name, email, wallet address, salary, country).
3. **Run Payroll** (ensure business wallet has USDC on Tempo testnet).
4. Open **Employee Login** → sign in with passkey → view balance and payment history.

## Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tempo Payroll Rails"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Create project on Vercel**
   - Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
   - Import your GitHub repo
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** . (leave default)
   - Do **not** deploy yet.

3. **Add environment variables** (Vercel → Project → Settings → Environment Variables). Add each for **Production**, **Preview**, and **Development**:

   | Name | Value (use same as in `.env.local`) |
   |------|-------------------------------------|
   | `NEXT_PUBLIC_PRIVY_APP_ID` | Your Privy app ID |
   | `PRIVY_APP_SECRET` | Your Privy app secret |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `NEXT_PUBLIC_TEMPO_RPC` | `https://rpc.moderato.tempo.xyz` |
   | `NEXT_PUBLIC_USDC_ADDRESS` | `0xe7A5f0BBeA629fa2cDCb56677e843A224FC6C3Ca` |
   | `DATABASE_URL` | Your Postgres connection string (for Prisma) |
   | `DIRECT_URL` | Same or direct Postgres URL (for Prisma) |

4. **Deploy**
   - Click **Deploy** (or push a new commit after saving env vars).
   - Build runs `prisma generate && next build`; the app will be live at `https://your-project.vercel.app`.
