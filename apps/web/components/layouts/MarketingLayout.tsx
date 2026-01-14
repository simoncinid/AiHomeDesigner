'use client'

import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/navigation/Footer'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
