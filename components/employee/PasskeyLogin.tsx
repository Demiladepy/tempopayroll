'use client'

import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'

interface PasskeyLoginProps {
  label?: string
  className?: string
}

export function PasskeyLogin({
  label = 'Login with Passkey',
  className,
}: PasskeyLoginProps) {
  const { login } = usePrivy()

  return (
    <Button onClick={login} className={className}>
      {label}
    </Button>
  )
}
