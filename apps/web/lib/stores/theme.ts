import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme, set)
      },

      toggleTheme: () => {
        const current = get().resolvedTheme
        const newTheme = current === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        applyTheme(newTheme, set)
      },

      initTheme: () => {
        const { theme } = get()
        applyTheme(theme, set)
        
        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleChange = () => {
            if (get().theme === 'system') {
              applyTheme('system', set)
            }
          }
          mediaQuery.addEventListener('change', handleChange)
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

function applyTheme(theme: Theme, set: (state: Partial<ThemeState>) => void) {
  if (typeof window === 'undefined') return

  let resolved: 'light' | 'dark'

  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } else {
    resolved = theme
  }

  set({ resolvedTheme: resolved })

  // Apply to document
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
