'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PasskeyLogin } from '@/components/employee/PasskeyLogin'

export default function EmployeeOnboardPage() {
  const { user } = usePrivy()

  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <Card className="max-w-md p-6 text-center">
          <h1 className="mb-2 text-xl font-bold">You&apos;re all set</h1>
          <p className="mb-4 text-muted-foreground">
            Your wallet is connected. Ask your employer to add this wallet
            address to payroll.
          </p>
          <p className="break-all font-mono text-xs text-muted-foreground">
            {user.wallet?.address}
          </p>
          <Button asChild className="mt-4 w-full">
            <a href="/employee">Go to My Wallet</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <Card className="max-w-md p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Employee Onboarding</h1>
        <p className="mb-4 text-muted-foreground">
          Sign in with your passkey to get your wallet address. Share this with
          your employer to receive payroll.
        </p>
        <PasskeyLogin label="Sign in with Passkey" className="w-full" />
      </Card>
    </div>
  )
}
