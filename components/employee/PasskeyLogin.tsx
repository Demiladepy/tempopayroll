'use client'

import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'
import { Fingerprint } from 'lucide-react'

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
    <Button onClick={login} className={className} size="lg">
      <Fingerprint className="mr-2 h-5 w-5" />
      {label}
    </Button>
  )
}
