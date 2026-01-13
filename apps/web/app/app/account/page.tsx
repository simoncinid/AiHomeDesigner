'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getAuthToken, clearAuthToken } from '@/lib/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

interface UserData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  credits_photo: number
  credits_video: number
}

export default function AccountPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  // Controlla il token dopo il mount
  useEffect(() => {
    setMounted(true)
    const token = getAuthToken()
    setHasToken(!!token)
    
    // Se non c'è token, redirect a login
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const { data: userData, isLoading, isError, error, refetch } = useQuery<UserData>({
    queryKey: ['user-me'],
    queryFn: async () => {
      // Double-check che il token sia presente
      const token = getAuthToken()
      if (!token) {
        throw new Error('No token')
      }
      return apiClient.getMe()
    },
    enabled: mounted && hasToken,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 30 * 1000, // 30 secondi
  })

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccess(true)
      // Refetch i dati utente dopo un acquisto
      refetch()
      setTimeout(() => setSuccess(false), 5000)
    }
  }, [searchParams, refetch])

  // Se c'è un errore di autenticazione, gestiscilo
  useEffect(() => {
    if (isError && hasToken) {
      const apiError = error as { status?: number }
      if (apiError?.status === 401) {
        console.log('[Account] Auth error 401, clearing token and redirecting')
        clearAuthToken()
        setHasToken(false)
        queryClient.removeQueries({ queryKey: ['user-me'] })
        router.replace('/login')
      }
    }
  }, [isError, error, hasToken, queryClient, router])

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  // Prima del mount, mostra loading
  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-8">My Account</h1>
          <div className="card p-8">
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Se non c'è token, mostra messaggio (il redirect avverrà)
  if (!hasToken) {
    return (
      <div className="min-h-[calc(100vh-5rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-8">Account</h1>
          <div className="card p-8">
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-slate-500">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-8">My Account</h1>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-8 animate-fade-in">
            <p className="text-emerald-600 font-medium">Credits purchased successfully! They have been added to your account.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Credits Card */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Credits</h2>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading your account data...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-slate-600 text-center">Unable to load account data. Please try again.</p>
                <button
                  onClick={handleRetry}
                  className="btn-primary text-sm"
                >
                  Retry
                </button>
              </div>
            ) : userData ? (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-xl bg-brand-50 border border-brand-100 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-600 font-medium">Photo Credits</p>
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-semibold text-slate-900 mb-1">
                    {userData.credits_photo}
                  </p>
                  <p className="text-sm text-slate-500">Available credits</p>
                </div>
                
                <div className="rounded-xl bg-teal-50 border border-teal-100 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-600 font-medium">Video Credits</p>
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-semibold text-slate-900 mb-1">
                    {userData.credits_video}
                  </p>
                  <p className="text-sm text-slate-500">Available credits</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Purchase Credits Card */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Purchase Credits</h2>
            <p className="text-slate-500 mb-6">Buy credits to generate more images and videos.</p>
            <Link href="/pricing" className="btn-primary inline-flex">
              View Pricing
            </Link>
          </div>

          {/* Creations Card */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Creations</h2>
            <p className="text-slate-500">Your generated designs will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
