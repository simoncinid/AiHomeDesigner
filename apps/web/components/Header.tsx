'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

interface HeaderProps {
  showAppNav?: boolean
}

interface FreeQuota {
  remaining: number
  total: number
}

export function Header({ showAppNav = false }: HeaderProps) {
  const [mounted, setMounted] = useState(false)

  const { data: freeQuota } = useQuery<FreeQuota>({
    queryKey: ['free-quota'],
    queryFn: () => apiClient.freeQuota().then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const photoCredits = freeQuota?.remaining ?? 1
  const videoCredits = 0 // Freemium video credits are always 0

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
              AI Home Designer
            </span>
          </Link>

          {/* Navigation - Allineata a destra */}
          <nav className="flex items-center space-x-6">
            {showAppNav ? (
              <>
                <Link
                  href="/app/photo-makeover"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Photo Makeover
                </Link>
                <Link
                  href="/app/room-generator"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Room Generator
                </Link>
                <Link
                  href="/app/photo-to-video"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Photo to Video
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/app/photo-makeover"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Photo Makeover
                </Link>
                <Link
                  href="/app/room-generator"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Room Generator
                </Link>
                <Link
                  href="/pricing"
                  className="text-navy-700 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Pricing
                </Link>
              </>
            )}

            {/* Free Credits Display */}
            {mounted && (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-navy-600 font-medium">Free:</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 font-semibold">{photoCredits}</span>
                      <span className="text-navy-500 text-xs">📸</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 font-semibold">{videoCredits}</span>
                      <span className="text-navy-500 text-xs">🎬</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login Button */}
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
