'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/theme'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const { resolvedTheme } = useThemeStore()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-1 -top-20 -left-20" />
        <div className="blob-2 -bottom-40 -right-20" />
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
      >
        <Home className="h-5 w-5" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="bg-surface rounded-2xl border border-border shadow-elevated p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={resolvedTheme === 'dark' ? '/images/logoyellow.png' : '/images/logored.png'}
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </Link>
          </div>

          {/* Title and description */}
          {(title || description) && (
            <div className="text-center mb-8">
              {title && (
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              )}
              {description && (
                <p className="mt-2 text-foreground-muted">{description}</p>
              )}
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </motion.div>
    </div>
  )
}
