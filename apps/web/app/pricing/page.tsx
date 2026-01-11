import { Metadata } from 'next'
import Link from 'next/link'
import { PricingSection } from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'Pricing - AI Home Designer',
  description: 'Affordable AI interior design credits. Photo credits from $0.19, video credits from $2.99.',
  openGraph: {
    title: 'Pricing - AI Home Designer',
    description: 'Affordable AI interior design credits',
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-navy-700 text-xl max-w-2xl mx-auto">
            Pay only for what you use. No subscriptions, no hidden fees.
          </p>
        </div>

        <PricingSection />

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-3 text-lg">How many credits do I need?</h3>
              <p className="text-navy-700 leading-relaxed">
                Each photo generation costs 1 credit. Video generation costs 1 video credit. 
                You get 1 free photo per day, so try it out first!
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-3 text-lg">Do credits expire?</h3>
              <p className="text-navy-700 leading-relaxed">
                No, your credits never expire. Use them whenever you want.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-3 text-lg">Can I get a refund?</h3>
              <p className="text-navy-700 leading-relaxed">
                We offer refunds for unused credits within 30 days of purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
