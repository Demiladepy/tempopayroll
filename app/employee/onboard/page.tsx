'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PasskeyLogin } from '@/components/employee/PasskeyLogin'
import { Wallet, UserPlus } from 'lucide-react'

export default function EmployeeOnboardPage() {
  const { user } = usePrivy()

  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="mb-2 text-xl font-bold">You&apos;re all set</h1>
          <p className="mb-4 text-muted-foreground">
            Your wallet is connected. Ask your employer to add this wallet
            address to payroll.
          </p>
          <p className="break-all rounded-lg bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
            {user.wallet?.address}
          </p>
          <Button asChild size="lg" className="mt-6 w-full gap-2">
            <a href="/employee">
              <Wallet className="h-5 w-5" />
              Go to My Wallet
            </a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserPlus className="h-7 w-7" />
        </div>
        <h1 className="mb-2 text-xl font-bold">Employee Onboarding</h1>
        <p className="mb-6 text-muted-foreground">
          Sign in with your passkey to get your wallet address. Share this with
          your employer to receive payroll.
        </p>
        <PasskeyLogin label="Sign in with Passkey" className="w-full" />
      </Card>
    </div>
  )
}
