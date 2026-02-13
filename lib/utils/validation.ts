const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export function isValidAddress(value: string): boolean {
  return ETHEREUM_ADDRESS_REGEX.test(value)
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidSalary(value: number): boolean {
  return Number.isFinite(value) && value > 0
}
