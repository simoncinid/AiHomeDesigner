'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export function PricingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => apiClient.pricing(),
  })

  const [loadingPack, setLoadingPack] = useState<string | null>(null)

  const handlePurchase = async (packId: string) => {
    setLoadingPack(packId)
    try {
      const { url } = await apiClient.createCheckout(packId)
      
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load pricing. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-20">
      {/* Photo Packs */}
      <div>
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Photo Credits</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.photo_packs.map((pack, index) => (
            <div
              key={pack.id}
              className={`card p-8 relative overflow-hidden ${
                index === 1 ? 'border-brand-200 shadow-hover ring-1 ring-brand-100' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-brand-500 text-white text-xs font-semibold rounded-bl-lg">
                  Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{pack.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-semibold text-slate-900">${pack.price}</span>
              </div>
              <p className="text-slate-500 mb-6 text-sm">
                ${(pack.price / pack.credits).toFixed(2)} per credit · {pack.credits} credits
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {pack.credits} photo generations
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  4 variations per generation
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Credits never expire
                </li>
              </ul>
              
              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack === pack.id}
                className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  index === 1
                    ? 'btn-primary'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
                }`}
              >
                {loadingPack === pack.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Purchase'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Packs */}
      <div>
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Video Credits</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.video_packs.map((pack, index) => (
            <div
              key={pack.id}
              className={`card p-8 relative overflow-hidden ${
                index === 1 ? 'border-teal-200 shadow-hover ring-1 ring-teal-100' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-bl-lg">
                  Best Value
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{pack.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-semibold text-slate-900">${pack.price}</span>
              </div>
              <p className="text-slate-500 mb-6 text-sm">
                ${(pack.price / pack.credits).toFixed(2)} per video · {pack.credits} credits
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {pack.credits} video generations
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 20s cinematic videos
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  HD/Full HD resolution
                </li>
              </ul>
              
              <button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack === pack.id}
                className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  index === 1
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
                }`}
              >
                {loadingPack === pack.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Purchase'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
