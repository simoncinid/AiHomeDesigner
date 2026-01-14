import { create } from 'zustand'
import { apiClient } from '@/lib/api'

interface CreditsState {
  photoCredits: number
  videoCredits: number
  freeQuotaRemaining: number
  freeQuotaTotal: number
  isLoading: boolean
  
  // Actions
  setCredits: (photo: number, video: number) => void
  setFreeQuota: (remaining: number, total: number) => void
  decrementPhotoCredits: () => void
  decrementVideoCredits: () => void
  decrementFreeQuota: () => void
  refresh: () => Promise<void>
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
  photoCredits: 0,
  videoCredits: 0,
  freeQuotaRemaining: 1,
  freeQuotaTotal: 1,
  isLoading: false,

  setCredits: (photoCredits, videoCredits) => 
    set({ photoCredits, videoCredits }),
  
  setFreeQuota: (freeQuotaRemaining, freeQuotaTotal) => 
    set({ freeQuotaRemaining, freeQuotaTotal }),
  
  decrementPhotoCredits: () => 
    set((state) => ({ 
      photoCredits: Math.max(0, state.photoCredits - 1) 
    })),
  
  decrementVideoCredits: () => 
    set((state) => ({ 
      videoCredits: Math.max(0, state.videoCredits - 1) 
    })),
  
  decrementFreeQuota: () => 
    set((state) => ({ 
      freeQuotaRemaining: Math.max(0, state.freeQuotaRemaining - 1) 
    })),
  
  refresh: async () => {
    set({ isLoading: true })
    try {
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
      
      if (isMockMode) {
        // Mock mode - use default values
        set({
          photoCredits: 5,
          videoCredits: 2,
          freeQuotaRemaining: 1,
          freeQuotaTotal: 1,
        })
      } else {
        // Real mode - fetch from API
        try {
          // Fetch credits balance (requires auth)
          const creditsBalance = await apiClient.getCreditsBalance()
          set({
            photoCredits: creditsBalance.photoCredits || 0,
            videoCredits: creditsBalance.videoCredits || 0,
          })
        } catch (error) {
          // If not authenticated, credits stay at 0
          console.log('Not authenticated or failed to fetch credits:', error)
        }
        
        // Fetch free quota (works for everyone)
        try {
          const freeQuota = await apiClient.getFreeQuota()
          set({
            freeQuotaRemaining: freeQuota.remaining || 0,
            freeQuotaTotal: freeQuota.total || 1,
          })
        } catch (error) {
          console.error('Failed to fetch free quota:', error)
        }
      }
    } finally {
      set({ isLoading: false })
    }
  },
}))
