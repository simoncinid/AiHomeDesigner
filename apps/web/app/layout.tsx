import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Home Designer - Transform Your Rooms with AI',
  description: 'AI-powered interior design tool. Transform your room photos into stunning designs, generate room ideas, and create cinematic videos.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com'),
  openGraph: {
    title: 'AI Home Designer',
    description: 'Transform your rooms with AI-powered interior design',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
