import Link from 'next/link'
import { Metadata } from 'next'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'AI Home Designer - Transform Your Space with AI',
  description: 'Professional AI-powered interior design. Transform room photos into stunning designs, generate room concepts, and create cinematic walkthrough videos.',
  openGraph: {
    title: 'AI Home Designer - Transform Your Space with AI',
    description: 'Professional AI-powered interior design for stunning room transformations',
    type: 'website',
  },
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Photo Makeover',
    description: 'Upload any room photo and get 4 AI-generated design variations in seconds.',
    href: '/app/photo-makeover',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Room Generator',
    description: 'Describe your dream room and let AI create photorealistic designs from scratch.',
    href: '/app/room-generator',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Photo to Video',
    description: 'Transform your designs into cinematic walkthrough videos with smooth camera motion.',
    href: '/app/photo-to-video',
  },
]

const styles = [
  'Modern', 'Scandinavian', 'Japandi', 'Minimal', 'Industrial', 
  'Mid-century', 'Boho', 'Coastal', 'Farmhouse', 'Luxury', 'Rustic'
]

const steps = [
  {
    number: '01',
    title: 'Upload Your Room',
    description: 'Take a photo of any room in your home. Our AI works with any angle, lighting, or room type.',
  },
  {
    number: '02',
    title: 'Choose Your Style',
    description: 'Select from 11+ design styles including Modern, Scandinavian, Japandi, Industrial, and more.',
  },
  {
    number: '03',
    title: 'Get AI Designs',
    description: 'Receive multiple stunning design variations in seconds. Download, share, or create videos.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[128px]" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/60 border border-dark-700/50 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-sm text-dark-300 font-medium">AI-Powered Interior Design</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
              Transform Your Space
              <br />
              <span className="text-gradient">With AI Design</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
              Upload a photo, choose a style, and watch AI create stunning interior designs in seconds. 
              Professional-quality results for any room.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
              <Link href="/app/photo-makeover" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                Start Designing
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                View Pricing
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-8 mt-12 text-dark-500 animate-fade-in animation-delay-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">1 Free generation daily</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">No account required</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Results in 30 seconds</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-dark-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading text-white mb-4">
              Powerful AI Tools
            </h2>
            <p className="section-subheading mx-auto">
              Everything you need to visualize and transform your living spaces
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="card-interactive p-8 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center mb-6 text-brand-400 group-hover:text-brand-300 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try now
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Section */}
      <section className="relative py-24 lg:py-32 border-t border-dark-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading text-white mb-4">
              11+ Design Styles
            </h2>
            <p className="section-subheading mx-auto">
              From Modern minimalism to cozy Farmhouse, find your perfect aesthetic
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {styles.map((style, index) => (
              <div
                key={style}
                className="px-5 py-2.5 rounded-full bg-dark-800/60 border border-dark-700/50 text-dark-200 font-medium hover:border-brand-500/50 hover:text-white hover:bg-dark-800 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {style}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 lg:py-32 border-t border-dark-800/50">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading text-white mb-4">
              How It Works
            </h2>
            <p className="section-subheading mx-auto">
              Three simple steps to transform any room
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-dark-700 to-transparent" />
                )}
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-800/80 border border-dark-700/50 mb-6">
                    <span className="text-2xl font-bold text-gradient">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-dark-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-dark-950 to-accent-cyan/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[160px]" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-dark-300 mb-10">
              Get started with 1 free generation per day. No credit card required.
            </p>
            <Link href="/app/photo-makeover" className="btn-primary text-lg px-10 py-5">
              Start Designing Now
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-dark-400 text-sm">
                © {new Date().getFullYear()} AI Home Designer. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/pricing" className="text-dark-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/app/photo-makeover" className="text-dark-400 hover:text-white transition-colors">
                Photo Makeover
              </Link>
              <Link href="/app/room-generator" className="text-dark-400 hover:text-white transition-colors">
                Room Generator
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Schema.org JSON-LD */}
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
