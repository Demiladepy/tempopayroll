'use client'

import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { authenticated, logout } = usePrivy()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Tempo Payroll
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/employee">
            <Button variant="ghost" size="sm">
              Employee
            </Button>
          </Link>
          {authenticated && (
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
