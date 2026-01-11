'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export function PricingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => apiClient.pricing().then(res => res.data),
  })

  const [loadingPack, setLoadingPack] = useState<string | null>(null)

  const handlePurchase = async (packId: string) => {
    setLoadingPack(packId)
    try {
      const response = await apiClient.createCheckout(packId)
      const { url } = response.data
      
      const stripe = await stripePromise
      if (stripe && url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoadingPack(null)
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading pricing...</div>
  }

  if (!data) {
    return <div className="text-center text-red-600">Failed to load pricing</div>
  }

  return (
    <div className="space-y-16">
      {/* Photo Packs */}
      <div>
        <h2 className="text-3xl font-bold text-navy-900 mb-10 text-center">Photo Credits</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.photo_packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
            >
              <h3 className="text-2xl font-bold text-navy-900 mb-3">{pack.name}</h3>
              <p className="text-4xl font-bold text-blue-600 mb-2">${pack.price}</p>
              <p className="text-navy-600 mb-6">${(pack.price / pack.credits).toFixed(2)} per credit</p>
              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack === pack.id}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPack === pack.id ? 'Loading...' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Packs */}
      <div>
        <h2 className="text-3xl font-bold text-navy-900 mb-10 text-center">Video Credits</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.video_packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
            >
              <h3 className="text-2xl font-bold text-navy-900 mb-3">{pack.name}</h3>
              <p className="text-4xl font-bold text-blue-600 mb-2">${pack.price}</p>
              <p className="text-navy-600 mb-6">${(pack.price / pack.credits).toFixed(2)} per credit</p>
              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack === pack.id}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPack === pack.id ? 'Loading...' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
