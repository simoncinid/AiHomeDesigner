import { Metadata } from 'next'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'App - AI Home Designer',
  robots: 'noindex',
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark-950">
      <Header showAppNav={true} />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
