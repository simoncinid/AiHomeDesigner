'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        orientation === 'horizontal'
          ? 'flex items-center justify-between'
          : 'flex flex-col space-y-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              orientation === 'horizontal' && !isLast && 'flex-1'
            )}
          >
            {/* Step indicator */}
            <div className="flex items-center">
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? 'rgb(var(--accent))'
                      : isCurrent
                      ? 'rgb(var(--accent))'
                      : 'rgb(var(--surface-secondary))',
                  }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors',
                    isCompleted || isCurrent
                      ? 'text-white'
                      : 'text-foreground-muted border-2 border-border'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                {isCurrent && (
                  <motion.div
                    layoutId="step-ring"
                    className="absolute -inset-1 rounded-full border-2 border-primary-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </div>

              {/* Step text */}
              {orientation === 'vertical' && (
                <div className="ml-4">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCurrent || isCompleted
                        ? 'text-foreground'
                        : 'text-foreground-muted'
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && orientation === 'horizontal' && (
              <div className="flex-1 mx-4">
                <div className="h-0.5 w-full bg-surface-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
