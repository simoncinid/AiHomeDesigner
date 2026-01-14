import { create } from 'zustand'

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
      // This will be called by the API layer
      // For mock mode, we'll use default values
      const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
      if (isMockMode) {
        set({
          photoCredits: 5,
          videoCredits: 2,
          freeQuotaRemaining: 1,
          freeQuotaTotal: 1,
        })
      }
    } finally {
      set({ isLoading: false })
    }
  },
}))
