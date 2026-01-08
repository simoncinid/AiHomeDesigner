import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Home Designer - Transform Your Rooms with AI',
  description: 'AI-powered interior design tool. Transform your room photos into stunning designs, generate room ideas, and create cinematic videos.',
  openGraph: {
    title: 'AI Home Designer',
    description: 'Transform your rooms with AI-powered interior design',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Home with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Redesign any room in seconds. Upload a photo, choose a style, and watch AI create stunning interior designs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/app/photo-makeover"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Room</h3>
            <p className="text-gray-600">
              Take or upload a photo of any room in your home.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Style</h3>
            <p className="text-gray-600">
              Pick from 11+ design styles: Modern, Scandinavian, Japandi, and more.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get AI Designs</h3>
            <p className="text-gray-600">
              Receive 4 stunning design variations in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-gray-600 mb-8">Get 1 free image generation per day. No credit card required.</p>
          <Link
            href="/app/photo-makeover"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
          >
            Start Designing Now
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'AI Home Designer',
            applicationCategory: 'DesignApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: 'AI-powered interior design tool. Transform your room photos into stunning designs.',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com',
          }),
        }}
      />
    </div>
  )
}
