import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Globe, LogIn } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-8 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
          Global Payroll on <span className="text-primary">Tempo</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground leading-relaxed">
          Pay your global team instantly with stablecoins. No banks, no delays,
          no hassle.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="min-w-[180px]">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/employee">
            <Button size="lg" variant="outline" className="min-w-[180px]">
              <LogIn className="mr-2 h-5 w-5" />
              Employee Login
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-8 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div className="group rounded-2xl border border-border/80 bg-card p-8 text-center shadow-card transition-shadow hover:shadow-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Instant Settlement</h3>
            <p className="text-muted-foreground leading-relaxed">
              Payments settle in seconds on Tempo blockchain. No 3-day wire
              waits.
            </p>
          </div>
          <div className="group rounded-2xl border border-border/80 bg-card p-8 text-center shadow-card transition-shadow hover:shadow-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Passkey Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              Employees use Face ID or Touch ID. No seed phrases, no wallet
              complexity.
            </p>
          </div>
          <div className="group rounded-2xl border border-border/80 bg-card p-8 text-center shadow-card transition-shadow hover:shadow-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Globe className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Global Access</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pay contractors anywhere. Stablecoins work across borders
              instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
