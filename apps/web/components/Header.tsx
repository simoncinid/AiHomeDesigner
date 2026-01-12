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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: freeQuota } = useQuery<FreeQuota>({
    queryKey: ['free-quota'],
    queryFn: () => apiClient.freeQuota().then(res => res.data),
    refetchInterval: 30000,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const photoCredits = freeQuota?.remaining ?? 1

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Blur background */}
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50" />
      
      <nav className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-glow-lg group-hover:scale-105">
              <span className="text-white font-bold text-lg">AI</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-400 to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight hidden sm:block">
              AI Home Designer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {showAppNav ? (
              <>
                <Link href="/app/photo-makeover" className="btn-ghost">
                  Photo Makeover
                </Link>
                <Link href="/app/room-generator" className="btn-ghost">
                  Room Generator
                </Link>
                <Link href="/app/photo-to-video" className="btn-ghost">
                  Photo to Video
                </Link>
              </>
            ) : (
              <>
                <Link href="/app/photo-makeover" className="btn-ghost">
                  Photo Makeover
                </Link>
                <Link href="/app/room-generator" className="btn-ghost">
                  Room Generator
                </Link>
                <Link href="/pricing" className="btn-ghost">
                  Pricing
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Free Credits Display */}
            {mounted && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-800/60 border border-dark-700/50">
                <span className="text-dark-400 text-sm font-medium">Free credits:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-brand-400 font-semibold">{photoCredits}</span>
                  <svg className="w-4 h-4 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Login Button */}
            <Link href="/login" className="btn-primary text-sm">
              <span>Sign In</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800/50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800/50 animate-fade-in-down">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {showAppNav ? (
                <>
                  <Link href="/app/photo-makeover" className="block px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-800/50 hover:text-white transition-colors">
                    Photo Makeover
                  </Link>
                  <Link href="/app/room-generator" className="block px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-800/50 hover:text-white transition-colors">
                    Room Generator
                  </Link>
                  <Link href="/app/photo-to-video" className="block px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-800/50 hover:text-white transition-colors">
                    Photo to Video
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/app/photo-makeover" className="block px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-800/50 hover:text-white transition-colors">
                    Photo Makeover
                  </Link>
                  <Link href="/app/room-generator" className="block px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-800/50 hover:text-white transition-colors">
                    Room Generator
                  </Link>
                  <Link href="/pricing" className="block px-4 py-3 rounded-xl text-dark-200 hover:bg-dark-800/50 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </>
              )}
              
              {mounted && (
                <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-dark-800/40 border border-dark-700/50">
                  <span className="text-dark-400 text-sm">Free credits:</span>
                  <span className="text-brand-400 font-semibold">{photoCredits}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
