import type { MercuryAccount } from '@/types/mercury'

export const mockMercuryAccount: MercuryAccount = {
  id: 'merc_demo_123',
  name: 'Acme Corp Business Account',
  balance: 50000.0,
  currency: 'USD',
  lastUpdated: new Date(),
}

export async function connectMercury(): Promise<MercuryAccount> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return mockMercuryAccount
}

export async function getMercuryBalance(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockMercuryAccount.balance
}
