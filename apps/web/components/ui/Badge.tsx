'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface-secondary text-foreground border border-border',
        primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
        success: 'bg-success-light text-success-dark dark:bg-success/20 dark:text-success',
        warning: 'bg-warning-light text-warning-dark dark:bg-warning/20 dark:text-warning',
        danger: 'bg-danger-light text-danger-dark dark:bg-danger/20 dark:text-danger',
        outline: 'border-2 border-primary-500 text-primary-500',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {icon}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
