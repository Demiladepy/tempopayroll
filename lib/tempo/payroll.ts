import { parseUnits, type Address } from 'viem'
import { USDC_ADDRESS } from './config'
import { ERC20_ABI } from './contracts'

export interface PayrollRecipient {
  address: Address
  amount: number
}

export type WalletClientLike = {
  writeContract: (args: {
    address: `0x${string}`
    abi: typeof ERC20_ABI
    functionName: 'transfer'
    args: [Address, bigint]
    chain: { id: number }
  }) => Promise<`0x${string}`>
}

export async function executePayroll(
  walletClient: WalletClientLike,
  recipients: PayrollRecipient[]
): Promise<string[]> {
  const txHashes: string[] = []

  for (const recipient of recipients) {
    const amountInWei = parseUnits(recipient.amount.toString(), 6)

    const tx = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [recipient.address, amountInWei],
      chain: { id: 42431 },
    })

    txHashes.push(tx)
  }

  return txHashes
}

export async function executeBatchPayroll(
  walletClient: WalletClientLike,
  recipients: PayrollRecipient[]
): Promise<string> {
  const txHashes = await executePayroll(walletClient, recipients)
  return txHashes[0] ?? ''
}
