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
      <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-navy-900 mb-8">Account</h1>
          <div className="card">
            <p className="text-navy-800 mb-6 font-medium">Perfavore accedi per visualizzare il tuo account.</p>
            <Link href="/login" className="btn-primary inline-block">
              Accedi
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Il Mio Account</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-800 font-medium">Crediti acquistati con successo! Sono stati aggiunti al tuo account.</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">I Tuoi Crediti</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <p className="text-navy-600 mt-4">Caricamento...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-navy-700 font-semibold">Crediti Foto</p>
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    {userData?.credits_photo ?? 0}
                  </p>
                  <p className="text-sm text-navy-500">Crediti disponibili</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-navy-700 font-semibold">Crediti Video</p>
                    <span className="text-2xl">🎬</span>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    {userData?.credits_video ?? 0}
                  </p>
                  <p className="text-sm text-navy-500">Crediti disponibili</p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Acquista Crediti</h2>
            <p className="text-navy-700 mb-6">Acquista crediti per generare più immagini e video.</p>
            <Link href="/pricing" className="btn-primary inline-block">
              Visualizza Prezzi
            </Link>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Le Tue Creazioni</h2>
            <p className="text-navy-700">Le tue creazioni generate appariranno qui.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
