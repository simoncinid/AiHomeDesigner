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
  const [scrolled, setScrolled] = useState(false)

  const { data: freeQuota } = useQuery<FreeQuota>({
    queryKey: ['free-quota'],
    queryFn: () => apiClient.freeQuota().then(res => res.data),
    refetchInterval: 30000,
  })

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const photoCredits = freeQuota?.remaining ?? 1

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background with subtle blur */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-soft' 
          : 'bg-transparent'
      }`} />
      
      <nav className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft transition-all duration-300 group-hover:shadow-hover group-hover:scale-105">
              <span className="text-white font-semibold text-lg">AI</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold text-slate-900 tracking-tight">
                AI Home Designer
              </span>
              <span className="hidden lg:inline text-xs text-slate-400 ml-2 font-medium">for Designers</span>
            </div>
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
          <div className="flex items-center gap-3">
            {/* Free Credits Display */}
            {mounted && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <span className="text-slate-500 text-sm">Free:</span>
                <span className="text-brand-600 font-semibold text-sm">{photoCredits}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Sign In Button */}
            <Link href="/login" className="btn-primary text-sm py-2.5">
              Sign In
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-soft-lg animate-fade-in-down">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {showAppNav ? (
                <>
                  <Link href="/app/photo-makeover" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                    Photo Makeover
                  </Link>
                  <Link href="/app/room-generator" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                    Room Generator
                  </Link>
                  <Link href="/app/photo-to-video" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                    Photo to Video
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/app/photo-makeover" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                    Photo Makeover
                  </Link>
                  <Link href="/app/room-generator" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                    Room Generator
                  </Link>
                  <Link href="/pricing" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                    Pricing
                  </Link>
                </>
              )}
              
              {mounted && (
                <div className="flex items-center gap-2 px-4 py-3 mt-2 rounded-xl bg-slate-50">
                  <span className="text-slate-500 text-sm">Free credits:</span>
                  <span className="text-brand-600 font-semibold">{photoCredits}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
