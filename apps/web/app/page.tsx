import Link from 'next/link'
import { Metadata } from 'next'
import { Header } from '@/components/Header'

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-50/50 to-white py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-navy-900 mb-6 leading-tight">
              Transform Your Home with AI
            </h1>
            <p className="text-xl sm:text-2xl text-navy-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload a photo, choose a style, and watch AI create stunning interior designs in seconds.
            </p>
            <Link
              href="/app/photo-makeover"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Design
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-sky-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-navy-700 max-w-2xl mx-auto">
              Three simple steps to your perfect room design
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Upload Your Room</h3>
              <p className="text-navy-700 leading-relaxed">
                Take or upload a photo of any room in your home. Our AI works with any room type.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Choose Your Style</h3>
              <p className="text-navy-700 leading-relaxed">
                Pick from 11+ design styles: Modern, Scandinavian, Japandi, Minimalist, and more.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Get AI Designs</h3>
              <p className="text-navy-700 leading-relaxed">
                Receive 4 stunning design variations in seconds. Download and share your favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-sky-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
            Get 1 free image generation per day. No credit card required.
          </p>
          <Link
            href="/app/photo-makeover"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-blue-50"
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
