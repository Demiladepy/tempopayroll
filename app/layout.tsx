import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/Providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tempo Payroll',
  description: 'Global payroll on Tempo blockchain',
}

// Avoid static prerender so Privy (requires NEXT_PUBLIC_PRIVY_APP_ID) is not run at build time
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
