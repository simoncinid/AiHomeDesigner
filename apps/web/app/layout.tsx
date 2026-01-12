import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Home Designer - Transform Your Space with AI',
  description: 'Professional AI-powered interior design for designers. Transform room photos into stunning designs, generate room concepts, and visualize your ideas instantly.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com'),
  openGraph: {
    title: 'AI Home Designer - Transform Your Space with AI',
    description: 'Professional AI-powered interior design for stunning room transformations',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Home Designer',
    description: 'Transform your rooms with AI-powered interior design',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
