import Link from 'next/link'
import { Metadata } from 'next'

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
    <div>
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary-600">
            AI Home Designer
          </Link>
          <div className="flex gap-4">
            <Link href="/app/photo-makeover" className="text-gray-600 hover:text-primary-600">
              Photo Makeover
            </Link>
            <Link href="/app/room-generator" className="text-gray-600 hover:text-primary-600">
              Room Generator
            </Link>
            <Link href="/app/photo-to-video" className="text-gray-600 hover:text-primary-600">
              Photo to Video
            </Link>
            <Link href="/app/account" className="text-gray-600 hover:text-primary-600">
              Account
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
