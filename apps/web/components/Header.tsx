'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

interface HeaderProps {
  showAppNav?: boolean
}

interface FreeQuota {
  remaining: number
  total: number
}

interface UserData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  credits_photo: number
  credits_video: number
}

export function Header({ showAppNav = false }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Controlla se c'è un token
  const hasToken = mounted && typeof window !== 'undefined' && !!localStorage.getItem('auth_token')

  const { data: userData, isLoading: userLoading } = useQuery<UserData>({
    queryKey: ['user-me'],
    queryFn: () => apiClient.getMe().then(res => res.data),
    enabled: hasToken, // Solo se c'è un token
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minuti
  })

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    queryClient.invalidateQueries({ queryKey: ['user-me'] })
    setUserMenuOpen(false)
    router.push('/')
  }

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
            {/* Credits Display - mostra crediti utente se loggato, altrimenti free */}
            {mounted && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                {userData ? (
                  <>
                    <span className="text-slate-500 text-sm">Credits:</span>
                    <span className="text-brand-600 font-semibold text-sm">{userData.credits_photo}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span className="text-slate-500 text-sm">Free:</span>
                    <span className="text-brand-600 font-semibold text-sm">{photoCredits}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </>
                )}
              </div>
            )}

            {/* User Menu o Sign In Button */}
            {mounted && userData ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-200 hover:bg-brand-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userData.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[150px] truncate">
                    {userData.email}
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in-down z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{userData.first_name} {userData.last_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userData.email}</p>
                    </div>
                    <Link
                      href="/app/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Account
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Buy Credits
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : mounted && !userLoading ? (
              <Link href="/login" className="btn-primary text-sm py-2.5">
                Sign In
              </Link>
            ) : null}

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
              
              {/* User info o Free credits */}
              {mounted && userData ? (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {userData.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{userData.first_name} {userData.last_name}</p>
                      <p className="text-xs text-slate-500">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-slate-500 text-sm">Credits:</span>
                    <span className="text-brand-600 font-semibold">{userData.credits_photo}</span>
                  </div>
                  <Link
                    href="/app/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : mounted && (
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
