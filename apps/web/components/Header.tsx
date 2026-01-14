'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { getAuthToken, clearAuthToken } from '@/lib/auth'

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
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = getAuthToken()
    setHasToken(!!token)
  }, [pathname])

  const isLoginPage = pathname === '/login'
  const shouldQueryUser = mounted && hasToken && !isLoginPage

  const { data: userData, isLoading: userLoading, isError: userError } = useQuery<UserData>({
    queryKey: ['user-me'],
    queryFn: async () => {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No token')
      }
      return apiClient.getMe()
    },
    enabled: shouldQueryUser,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (userError && hasToken) {
      console.log('[Header] Auth error, clearing token')
      clearAuthToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: ['user-me'] })
    }
  }, [userError, hasToken, queryClient])

  const shouldQueryFreeQuota = mounted && !hasToken && !isLoginPage
  
  const { data: freeQuota } = useQuery<FreeQuota>({
    queryKey: ['free-quota'],
    queryFn: () => apiClient.freeQuota(),
    enabled: shouldQueryFreeQuota,
    refetchInterval: 60000,
    retry: false,
    staleTime: 30000,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = useCallback(() => {
    clearAuthToken()
    setHasToken(false)
    queryClient.removeQueries({ queryKey: ['user-me'] })
    setUserMenuOpen(false)
    router.push('/')
  }, [queryClient, router])

  const photoCredits = freeQuota?.remaining ?? 1

  const renderUserButton = () => {
    if (!mounted) return null

    if (hasToken && userLoading && !userData) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-sky-500 rounded-full animate-spin" />
        </div>
      )
    }

    if (userData) {
      return (
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userData.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900 max-w-[120px] truncate">
              {userData.email}
            </span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in-down z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{userData.first_name} {userData.last_name}</p>
                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
              </div>
              <Link
                href="/app/account"
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Account
              </Link>
              <Link
                href="/app/account#credits"
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
      )
    }

    return (
      <Link 
        href="/login" 
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
      >
        Sign In
      </Link>
    )
  }

  const navLinks = showAppNav ? [
    { href: '/app/photo-makeover', label: 'Photo Makeover' },
    { href: '/app/room-generator', label: 'Room Generator' },
    { href: '/app/photo-to-video', label: 'Photo to Video' },
  ] : [
    { href: '/app/photo-makeover', label: 'Photo Makeover' },
    { href: '/app/room-generator', label: 'Room Generator' },
    { href: '/pricing', label: 'Pricing' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                AI Home Designer
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 font-medium">
                for Designers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Credits Display */}
            {mounted && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm">
                {userData ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{userData.credits_photo}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{userData.credits_video}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-gray-500">Free:</span>
                    <span className="font-semibold text-gray-900">{photoCredits}</span>
                  </>
                )}
              </div>
            )}

            {renderUserButton()}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in-down">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {mounted && userData && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {userData.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{userData.first_name} {userData.last_name}</p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{userData.credits_photo}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{userData.credits_video}</span>
                  </div>
                </div>
                <Link
                  href="/app/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 font-medium"
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium"
                >
                  Logout
                </button>
              </div>
            )}

            {mounted && !userData && !hasToken && (
              <div className="flex items-center gap-2 px-4 py-3 mt-4 rounded-lg bg-gray-50">
                <span className="text-gray-500 text-sm">Free credits:</span>
                <span className="font-semibold text-gray-900">{photoCredits}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
