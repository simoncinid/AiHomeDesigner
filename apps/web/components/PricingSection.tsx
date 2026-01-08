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
    <div className="space-y-12">
      {/* Photo Packs */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Photo Credits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {data.photo_packs.map((pack) => (
            <div
              key={pack.id}
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{pack.name}</h3>
              <p className="text-3xl font-bold mb-4">${pack.price}</p>
              <p className="text-gray-600 mb-4">${(pack.price / pack.credits).toFixed(2)} per credit</p>
              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack === pack.id}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loadingPack === pack.id ? 'Loading...' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Packs */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Video Credits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {data.video_packs.map((pack) => (
            <div
              key={pack.id}
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{pack.name}</h3>
              <p className="text-3xl font-bold mb-4">${pack.price}</p>
              <p className="text-gray-600 mb-4">${(pack.price / pack.credits).toFixed(2)} per credit</p>
              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack === pack.id}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
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
