'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Sparkles,
  Video,
  User,
  LogOut,
  X,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'
import { useThemeStore } from '@/lib/stores/theme'
import { Badge } from '@/components/ui/Badge'

const sidebarLinks = [
  {
    href: '/app',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/app/makeover',
    label: 'Photo Makeover',
    icon: Sparkles,
    badge: 'Popular',
  },
  {
    href: '/app/room-generator',
    label: 'Room Generator',
    icon: Image,
  },
  {
    href: '/app/photo-to-video',
    label: 'Photo to Video',
    icon: Video,
  },
]

const accountLinks = [
  {
    href: '/app/account',
    label: 'Account',
    icon: User,
  },
]

interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { photoCredits, videoCredits, freeQuotaRemaining } = useCreditsStore()
  const { resolvedTheme } = useThemeStore()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-surface px-6 py-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={resolvedTheme === 'dark' ? '/images/logoyellow.png' : '/images/logored.png'}
              alt="Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          </Link>

          {/* Credits card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Credits</span>
              <Link href="/pricing">
                <Badge variant="primary" size="sm">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Buy
                </Badge>
              </Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-muted">Photo</span>
                <span className="font-medium text-foreground">{photoCredits}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-muted">Video</span>
                <span className="font-medium text-foreground">{videoCredits}</span>
              </div>
              {freeQuotaRemaining > 0 && (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-primary-500/20">
                  <span className="text-foreground-muted">Free today</span>
                  <span className="font-medium text-primary-500">
                    {freeQuotaRemaining}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider px-3 py-2">
              Create
            </span>
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                  isActive(link.href, link.exact)
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-secondary'
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
                {link.badge && (
                  <Badge variant="primary" size="sm" className="ml-auto">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}

            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider px-3 py-2 mt-4">
              Account
            </span>
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-secondary'
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User info */}
          {isAuthenticated && user && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-surface-secondary flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="pt-4 border-t border-border">
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
              >
                <User className="h-5 w-5" />
                Sign in to save history
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
          >
            <div className="flex h-full flex-col gap-y-5 overflow-y-auto border-r border-border bg-surface px-6 py-8">
              {/* Header with close button */}
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={resolvedTheme === 'dark' ? '/images/logoyellow.png' : '/images/logored.png'}
                    alt="Logo"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Credits */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Credits</span>
                  <Link href="/pricing" onClick={onClose}>
                    <Badge variant="primary" size="sm">
                      Buy
                    </Badge>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-foreground-muted">Photo: </span>
                    <span className="font-medium text-foreground">{photoCredits}</span>
                  </div>
                  <div>
                    <span className="text-foreground-muted">Video: </span>
                    <span className="font-medium text-foreground">{videoCredits}</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 flex flex-col gap-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive(link.href, link.exact)
                        ? 'text-primary-500 bg-primary-500/10'
                        : 'text-foreground-muted hover:text-foreground hover:bg-surface-secondary'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* User info */}
              {isAuthenticated && user && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-9 w-9 rounded-full bg-surface-secondary flex items-center justify-center">
                      <span className="text-sm font-medium text-foreground">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      onClose()
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
