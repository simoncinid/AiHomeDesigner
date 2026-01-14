'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'text'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-secondary',
        {
          'rounded-lg': variant === 'default',
          'rounded-full': variant === 'circular',
          'rounded h-4': variant === 'text',
        },
        className
      )}
    />
  )
}

// Pre-built skeleton components for common patterns
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 space-y-4 rounded-2xl border border-border', className)}>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton variant="circular" className={cn('h-10 w-10', className)} />
}

export function SkeletonImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-surface-secondary',
        className
      )}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  )
}
