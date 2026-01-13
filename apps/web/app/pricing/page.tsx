import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Pricing - AI Home Designer',
  description: 'Simple pricing: $0.19 per photo credit, $2.99 per video credit. No subscriptions, no hidden fees.',
  openGraph: {
    title: 'Pricing - AI Home Designer',
    description: 'Affordable AI interior design. $0.19/photo, $2.99/video. Pay only for what you use.',
  },
}

const faqs = [
  {
    question: 'How many credits do I need?',
    answer: 'Each photo generation costs 1 credit and produces 4 design variations. Video generation costs 1 video credit. You get 1 free photo generation per day to try it out!',
  },
  {
    question: 'Do credits expire?',
    answer: 'No, your credits never expire. Purchase once and use them whenever you want.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer full refunds for unused credits within 30 days of purchase. Contact our support team.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and Apple Pay through our secure Stripe payment system.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative bg-white">
        <div className="absolute inset-0 bg-hero-light" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Pay only for what you use. No subscriptions, no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Photo Credit */}
            <div className="card p-8 text-center relative overflow-hidden border-brand-200 shadow-hover ring-1 ring-brand-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Photo Credit</h2>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-slate-900">$0.19</span>
                <span className="text-slate-500 text-lg">/credit</span>
              </div>
              <p className="text-slate-500 mb-8">Per photo generation</p>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  4 design variations per generation
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  High resolution output (2048×2048)
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Credits never expire
                </li>
              </ul>
              
              <Link href="/app/account#credits" className="btn-primary w-full py-3.5 text-base">
                Buy Photo Credits
              </Link>
            </div>

            {/* Video Credit */}
            <div className="card p-8 text-center relative overflow-hidden border-teal-200 shadow-hover ring-1 ring-teal-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Video Credit</h2>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-slate-900">$2.99</span>
                <span className="text-slate-500 text-lg">/credit</span>
              </div>
              <p className="text-slate-500 mb-8">Per video generation</p>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cinematic video walkthrough
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 20 seconds HD/Full HD
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Credits never expire
                </li>
              </ul>
              
              <Link href="/app/account#credits" className="w-full py-3.5 text-base rounded-xl font-medium bg-teal-500 text-white hover:bg-teal-600 transition-all inline-block">
                Buy Video Credits
              </Link>
            </div>
          </div>
          
          {/* Summary */}
          <div className="mt-12 text-center">
            <p className="text-slate-500">
              Buy exactly what you need. No bundles, no packages — just simple per-credit pricing.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-lg">
              Everything you need to know about our pricing
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-500 mb-8">
            Try it free today with 1 complimentary generation
          </p>
          <Link href="/app/photo-makeover" className="btn-primary text-base px-8 py-4">
            Start Designing Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">AI</span>
            </div>
            <span className="text-slate-400 text-sm">
              © {new Date().getFullYear()} AI Home Designer
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
