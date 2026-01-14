'use client'

import { forwardRef, cloneElement, isValidElement } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-surface-secondary text-foreground border border-border hover:bg-surface-tertiary hover:border-border-hover hover:-translate-y-0.5 active:translate-y-0',
        ghost:
          'text-foreground-muted hover:text-foreground hover:bg-surface-secondary',
        danger:
          'bg-danger text-white hover:bg-danger-dark active:bg-red-800 shadow-sm hover:shadow-md',
        outline:
          'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 hover:-translate-y-0.5 active:translate-y-0',
        link:
          'text-primary-500 hover:text-primary-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-base rounded-xl',
        lg: 'h-13 px-8 text-lg rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'as'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(buttonVariants({ variant, size, fullWidth, className }))
    
    if (asChild && isValidElement(children)) {
      // Remove button-specific props when using asChild
      const { type, ...restProps } = props
      const childElement = children as React.ReactElement<any>
      
      return cloneElement(childElement, {
        className: cn(buttonClasses, childElement.props?.className),
        disabled: disabled || isLoading,
        ...restProps,
        ...(childElement.props || {}),
      } as any)
    }

    const buttonContent = (
      <>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </>
    )

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
