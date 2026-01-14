'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
  animated?: boolean
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  showValue = false,
  variant = 'default',
  className,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const variants = {
    default: 'bg-primary-500',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full bg-surface-secondary rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', variants[variant])}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showValue && (
        <div className="mt-1 flex justify-between text-sm text-foreground-muted">
          <span>{Math.round(percentage)}%</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  )
}

// Indeterminate progress
interface IndeterminateProgressProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function IndeterminateProgress({
  size = 'md',
  className,
}: IndeterminateProgressProps) {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div
      className={cn(
        'w-full bg-surface-secondary rounded-full overflow-hidden',
        sizes[size],
        className
      )}
    >
      <motion.div
        className="h-full w-1/3 bg-primary-500 rounded-full"
        animate={{
          x: ['-100%', '400%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
