import { Header } from '@/components/shared/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  )
}
