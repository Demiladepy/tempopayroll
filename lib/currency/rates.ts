// Demo rates USDC -> local currency (replace with API in production)
export type LocalCurrency = 'BRL' | 'INR' | 'NGN'

const DEMO_RATES: Record<LocalCurrency, number> = {
  BRL: 5.2,
  INR: 83,
  NGN: 1600,
}

export function getRateToLocal(currency: LocalCurrency): number {
  return DEMO_RATES[currency] ?? 1
}

export function convertUsdcToLocal(usdcAmount: number, currency: LocalCurrency): number {
  const rate = getRateToLocal(currency)
  return Math.round(usdcAmount * rate * 100) / 100
}
