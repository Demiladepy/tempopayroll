import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="px-8 py-20 text-center">
        <h1 className="mb-6 text-6xl font-bold">
          Global Payroll on <span className="text-primary">Tempo</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Pay your global team instantly with stablecoins. No banks, no delays,
          no hassle.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/employee">
            <Button size="lg" variant="outline">
              Employee Login
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted/30 px-8 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div className="space-y-4 text-center">
            <Zap className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Instant Settlement</h3>
            <p className="text-muted-foreground">
              Payments settle in seconds on Tempo blockchain. No 3-day wire
              waits.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <Shield className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Passkey Security</h3>
            <p className="text-muted-foreground">
              Employees use Face ID or Touch ID. No seed phrases, no wallet
              complexity.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <Globe className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold">Global Access</h3>
            <p className="text-muted-foreground">
              Pay contractors anywhere. Stablecoins work across borders
              instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
