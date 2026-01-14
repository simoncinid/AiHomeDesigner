import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAccessToken: (accessToken) => set({ accessToken }),
      
      login: (user, token) => set({ 
        user, 
        accessToken: token, 
        isAuthenticated: true,
        isLoading: false,
      }),
      
      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        })
        // Clear from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
      },
      
      hydrateFromStorage: () => {
        // This is called on app mount to restore auth state
        set({ isLoading: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false
        }
      },
    }
  )
)
