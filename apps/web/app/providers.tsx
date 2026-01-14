'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastContainer } from '@/components/ui/Toast'
import { useThemeStore } from '@/lib/stores/theme'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { initTheme } = useThemeStore()
  
  useEffect(() => {
    initTheme()
  }, [initTheme])
  
  return <>{children}</>
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrateFromStorage, isAuthenticated } = useAuthStore()
  const { refresh } = useCreditsStore()
  
  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])
  
  useEffect(() => {
    if (isAuthenticated) {
      refresh()
    }
  }, [isAuthenticated, refresh])
  
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
