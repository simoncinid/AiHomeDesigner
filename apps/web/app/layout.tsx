import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'AI Home Designer - Transform Your Space with AI',
    template: '%s | AI Home Designer',
  },
  description: 'Professional AI-powered interior design. Transform room photos into stunning designs, generate room concepts, and visualize your ideas instantly.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com'),
  keywords: ['AI interior design', 'room design', 'home makeover', 'AI room generator', 'interior visualization'],
  authors: [{ name: 'AI Home Designer' }],
  creator: 'AI Home Designer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-homedesigner.com',
    siteName: 'AI Home Designer',
    title: 'AI Home Designer - Transform Your Space with AI',
    description: 'Professional AI-powered interior design for stunning room transformations',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Home Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Home Designer',
    description: 'Transform your rooms with AI-powered interior design',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logored.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logored.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme-storage');
                const parsed = theme ? JSON.parse(theme) : null;
                const savedTheme = parsed?.state?.theme;
                if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
