'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

export default function AccountPage() {
  const searchParams = useSearchParams()
  const [success, setSuccess] = useState(false)

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: () => apiClient.getMe().then(res => res.data),
    enabled: isAuthenticated(),
    retry: false,
  })

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    }
  }, [searchParams])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Account</h1>
          <div className="card p-8">
            <p className="text-dark-300 mb-6">Please sign in to view your account.</p>
            <Link href="/login" className="btn-primary inline-flex">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">My Account</h1>

        {success && (
          <div className="bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl p-6 mb-8 animate-fade-in">
            <p className="text-accent-emerald font-medium">Credits purchased successfully! They have been added to your account.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Credits Card */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Your Credits</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-dark-300 font-medium">Photo Credits</p>
                    <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {userData?.credits_photo ?? 0}
                  </p>
                  <p className="text-sm text-dark-500">Available credits</p>
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-accent-cyan/10 to-accent-cyan/5 border border-accent-cyan/20 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-dark-300 font-medium">Video Credits</p>
                    <div className="w-10 h-10 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {userData?.credits_video ?? 0}
                  </p>
                  <p className="text-sm text-dark-500">Available credits</p>
                </div>
              </div>
            )}
          </div>

          {/* Purchase Credits Card */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Purchase Credits</h2>
            <p className="text-dark-400 mb-6">Buy credits to generate more images and videos.</p>
            <Link href="/pricing" className="btn-primary inline-flex">
              View Pricing
            </Link>
          </div>

          {/* Creations Card */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Creations</h2>
            <p className="text-dark-400">Your generated designs will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
