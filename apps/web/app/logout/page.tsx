'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient } from '@/lib/api'

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuthStore()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await apiClient.logout()
      } catch (e) {
        // Ignore errors
      }
      logout()
      router.push('/')
    }

    performLogout()
  }, [logout, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground-muted">Signing out...</p>
      </div>
    </div>
  )
}
