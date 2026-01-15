'use client'

import Link from 'next/link'
import { Menu, Moon, Sun, Home } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/theme'
import { Button } from '@/components/ui/Button'

interface AppTopbarProps {
  onMenuClick: () => void
}

export function AppTopbar({ onMenuClick }: AppTopbarProps) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Home icon */}
        <Link
          href="/"
          className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
          aria-label="Home"
        >
          <Home className="h-5 w-5" />
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  )
}
