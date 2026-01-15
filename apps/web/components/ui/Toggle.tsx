'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { checked, onChange, label, description, disabled, size = 'md', className },
    ref
  ) => {
    const sizes = {
      sm: {
        track: 'w-8 h-5',
        thumb: 'w-3.5 h-3.5',
        translate: checked ? 'translateX(14px)' : 'translateX(2px)',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-4 h-4',
        translate: checked ? 'translateX(22px)' : 'translateX(2px)',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-5 h-5',
        translate: checked ? 'translateX(30px)' : 'translateX(2px)',
      },
    }

    const currentSize = sizes[size]

    return (
      <label
        className={cn(
          'flex items-start gap-3 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <button
          ref={ref}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'relative inline-flex shrink-0 rounded-full transition-colors duration-200',
            currentSize.track,
            checked ? 'bg-primary-500' : 'bg-surface-tertiary'
          )}
        >
          <motion.span
            initial={false}
            animate={{ 
              x: checked ? (size === 'sm' ? 14 : size === 'md' ? 22 : 30) : 2,
              y: '-50%'
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'absolute left-0 top-1/2 rounded-full bg-white shadow-sm',
              currentSize.thumb
            )}
          />
        </button>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <div className="text-sm font-medium text-foreground">{label}</div>
            )}
            {description && (
              <div className="text-sm text-foreground-muted">{description}</div>
            )}
          </div>
        )}
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle }
