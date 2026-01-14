'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-xl font-semibold text-foreground">
                AI Home Designer
              </span>
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
