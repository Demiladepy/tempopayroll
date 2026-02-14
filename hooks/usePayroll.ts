import { useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { createWalletClient, custom, type Address } from 'viem'
import { tempoTestnet } from '@/lib/tempo/config'
import { executePayroll, type PayrollRecipient } from '@/lib/tempo/payroll'

interface EmployeeForPayroll {
  id: string
  wallet_address: string
  salary_amount: number
}

export function usePayroll() {
  const { wallets } = useWallets()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runPayroll(
    businessId: string,
    employees: EmployeeForPayroll[]
  ) {
    setLoading(true)
    setError(null)

    try {
      const wallet = wallets[0]
      if (!wallet) throw new Error('No wallet connected')

      await wallet.switchChain(tempoTestnet.id)

      const provider = await wallet.getEthereumProvider()
      const walletClient = createWalletClient({
        chain: tempoTestnet,
        // Privy's getEthereumProvider() returns an EIP-1193 provider
        transport: custom(provider as import('viem').EIP1193Provider),
      })

      const recipients: PayrollRecipient[] = employees.map((emp) => ({
        address: emp.wallet_address as Address,
        amount: emp.salary_amount,
      }))

      const txHashes = await executePayroll(
        walletClient as { writeContract: (args: unknown) => Promise<`0x${string}`> },
        recipients
      )

      const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0)
      const transactions = employees.map((emp, i) => ({
        employee_id: emp.id,
        amount: emp.salary_amount,
        currency: 'USDC',
        tx_hash: txHashes[i] ?? null,
        status: 'confirmed',
      }))

      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          transactions,
          total_amount: totalAmount,
          batch_tx_hash: txHashes[0] ?? null,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed to record payroll')
      }

      return txHashes
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payroll failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { runPayroll, loading, error }
}
