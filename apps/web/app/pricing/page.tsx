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
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 text-lg">
            Pay only for what you use. No subscriptions, no hidden fees.
          </p>
        </div>

        <PricingSection />

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto text-left space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How many credits do I need?</h3>
              <p className="text-gray-600">
                Each photo generation costs 1 credit. Video generation costs 1 video credit. 
                You get 1 free photo per day, so try it out first!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do credits expire?</h3>
              <p className="text-gray-600">
                No, your credits never expire. Use them whenever you want.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I get a refund?</h3>
              <p className="text-gray-600">
                We offer refunds for unused credits within 30 days of purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
