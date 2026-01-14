import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
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
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} min-h-screen bg-slate-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
