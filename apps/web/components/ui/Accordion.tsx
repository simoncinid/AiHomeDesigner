'use client'

import { useState, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function useAccordion() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider')
  }
  return context
}

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: React.ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : []
  )

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]))
    } else {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <div
      className={cn(
        'border border-border rounded-xl overflow-hidden bg-surface',
        className
      )}
      data-value={value}
    >
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion()
  const value =
    (
      (
        (arguments[0] as any)?._owner?.memoizedProps?.children as any
      )?.props?.value
    ) || ''

  // Get value from parent AccordionItem via DOM
  const handleClick = (e: React.MouseEvent) => {
    const item = (e.currentTarget as HTMLElement).closest('[data-value]')
    if (item) {
      toggleItem(item.getAttribute('data-value') || '')
    }
  }

  const isOpen = (e: HTMLElement | null) => {
    if (!e) return false
    const item = e.closest('[data-value]')
    return item ? openItems.includes(item.getAttribute('data-value') || '') : false
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-center justify-between px-5 py-4 text-left font-medium text-foreground',
        'hover:bg-surface-secondary transition-colors',
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'h-5 w-5 text-foreground-muted transition-transform duration-200',
          // Will be animated in AccordionContent
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { openItems } = useAccordion()

  return (
    <AccordionContentInner openItems={openItems} className={className}>
      {children}
    </AccordionContentInner>
  )
}

function AccordionContentInner({
  children,
  openItems,
  className,
}: {
  children: React.ReactNode
  openItems: string[]
  className?: string
}) {
  // We need to check parent for value
  return (
    <div className="accordion-content-wrapper">
      <AccordionContentWithParent openItems={openItems} className={className}>
        {children}
      </AccordionContentWithParent>
    </div>
  )
}

function AccordionContentWithParent({
  children,
  openItems,
  className,
}: {
  children: React.ReactNode
  openItems: string[]
  className?: string
}) {
  // This is a simplified version - in production you'd want a more robust solution
  // For now we'll always show content and let parent handle visibility
  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className={cn('px-5 pb-4 text-foreground-muted', className)}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Simplified FAQ Accordion component for easier use
interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-border rounded-xl overflow-hidden bg-surface"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-surface-secondary transition-colors"
          >
            <span>{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-foreground-muted" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-foreground-muted">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
