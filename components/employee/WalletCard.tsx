'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBalance } from 'wagmi'
import { Wallet } from 'lucide-react'
import { USDC_ADDRESS } from '@/lib/tempo/config'
import { formatUnits } from 'viem'
import { convertUsdcToLocal, type LocalCurrency } from '@/lib/currency/rates'

interface WalletCardProps {
  employee: {
    name: string
    salary_amount: number
    status: string
    target_currency?: string | null
    [key: string]: unknown
  } | null
  walletAddress?: string
}

export function WalletCard({ employee, walletAddress }: WalletCardProps) {
  const { data: balance } = useBalance({
    address: walletAddress as `0x${string}` | undefined,
    token: USDC_ADDRESS,
    chainId: 42431,
  })

  const usdcBalance = balance ? parseFloat(formatUnits(balance.value, 6)) : 0
  const showLocalCurrency =
    employee?.target_currency &&
    employee.target_currency !== 'USDC' &&
    ['BRL', 'INR', 'NGN'].includes(employee.target_currency)
  const localAmount = showLocalCurrency
    ? convertUsdcToLocal(usdcBalance, employee.target_currency as LocalCurrency)
    : 0
  const currencySymbol = showLocalCurrency
    ? (employee.target_currency === 'BRL'
        ? 'R$'
        : employee.target_currency === 'INR'
          ? '₹'
          : employee.target_currency === 'NGN'
            ? '₦'
            : '')
    : '$'

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Wallet Balance
          </p>
          <p className="text-4xl font-bold tracking-tight">
            {currencySymbol}
            {showLocalCurrency
              ? localAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : usdcBalance.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {showLocalCurrency ? employee!.target_currency : 'USDC'}
            {showLocalCurrency && (
              <span className="ml-2 text-muted-foreground/80">
                (${usdcBalance.toFixed(2)} USDC)
              </span>
            )}
          </p>
        </div>

        {employee && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{employee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Monthly Salary
              </span>
              <span className="font-medium">
                ${Number(employee.salary_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline">{employee.status}</Badge>
            </div>
          </div>
        )}

        {walletAddress && (
          <div className="border-t pt-4">
            <p className="break-all font-mono text-xs text-muted-foreground">
              {walletAddress}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
