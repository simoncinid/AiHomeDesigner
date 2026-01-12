import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { PricingSection } from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'Pricing - AI Home Designer',
  description: 'Simple, transparent pricing for AI interior design. Photo credits from $0.19, video credits from $2.99. No subscriptions.',
  openGraph: {
    title: 'Pricing - AI Home Designer',
    description: 'Affordable AI interior design credits. Pay only for what you use.',
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
    <div className="min-h-screen bg-dark-950">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px]" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto">
            Pay only for what you use. No subscriptions, no hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PricingSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-dark-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-dark-400 text-lg">
              Everything you need to know about our pricing
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-dark-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-dark-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-dark-400 mb-8">
            Try it free today with 1 complimentary generation
          </p>
          <Link href="/app/photo-makeover" className="btn-primary text-lg px-8 py-4">
            Start Designing Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="text-dark-500 text-sm">
              © {new Date().getFullYear()} AI Home Designer
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
