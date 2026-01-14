'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Image as ImageIcon, Video, Zap, CreditCard, Minus, Plus, ShoppingCart } from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FAQAccordion } from '@/components/ui/Accordion'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient } from '@/lib/api'
import { cn } from '@/lib/utils'

const PHOTO_PRICE = 0.19 // $0.19 per credit
const VIDEO_PRICE = 2.99 // $2.99 per credit

const pricingFAQ = [
  {
    question: 'What are photo credits?',
    answer: 'Photo credits are used for generating room makeovers and room designs from text. Each generation uses 1 photo credit.',
  },
  {
    question: 'What are video credits?',
    answer: 'Video credits are used for creating cinematic video animations from your images. Each 5-second video uses 1 video credit.',
  },
  {
    question: 'Do credits expire?',
    answer: 'No! Your purchased credits never expire. Use them whenever you need them.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, we offer refunds within 7 days of purchase if you have not used any credits from that pack. Contact support@ai-homedesigner.com.',
  },
  {
    question: 'What about the free tier?',
    answer: 'Every user gets 1 free photo generation per day, no credit card required. This resets at midnight UTC.',
  },
]

export default function PricingPage() {
  const { isAuthenticated } = useAuthStore()
  const [photoCredits, setPhotoCredits] = useState(10)
  const [videoCredits, setVideoCredits] = useState(0)
  const [purchasing, setPurchasing] = useState(false)

  const photoTotal = photoCredits * PHOTO_PRICE
  const videoTotal = videoCredits * VIDEO_PRICE
  const total = photoTotal + videoTotal

  const handlePhotoChange = (delta: number) => {
    setPhotoCredits(Math.max(0, Math.min(1000, photoCredits + delta)))
  }

  const handleVideoChange = (delta: number) => {
    setVideoCredits(Math.max(0, Math.min(100, videoCredits + delta)))
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast({ type: 'info', title: 'Sign in required', message: 'Please sign in to purchase credits' })
      window.location.href = '/login?redirect=/pricing'
      return
    }

    if (total < 0.50) {
      toast({ type: 'error', title: 'Minimum purchase', message: 'Minimum purchase amount is $0.50' })
      return
    }

    if (photoCredits === 0 && videoCredits === 0) {
      toast({ type: 'error', title: 'Select credits', message: 'Please select at least one credit to purchase' })
      return
    }

    setPurchasing(true)
    try {
      const response = await apiClient.createDynamicCheckout(photoCredits, videoCredits)
      window.location.href = response.url
    } catch (error: any) {
      toast({ type: 'error', title: 'Error', message: error.detail || 'Failed to start checkout' })
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <MarketingLayout>
      <section className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="primary" size="lg" className="mb-4">
              <CreditCard className="h-4 w-4" />
              Simple Pricing
            </Badge>
            <h1 className="heading-1 text-foreground mb-4">
              Buy exactly what you need
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              No subscriptions required. Choose your credits and pay only for what you use.
              Credits never expire.
            </p>
          </motion.div>

          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <Card variant="gradient" padding="lg" className="border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-warning/20 flex items-center justify-center shrink-0">
                  <Zap className="h-8 w-8 text-warning" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    Free tier — 1 image per day
                  </h3>
                  <p className="text-foreground-muted">
                    Try AI Home Designer for free. Get 1 photo generation every day, no credit card required.
                  </p>
                </div>
                <Button variant="outline" className="shrink-0" asChild>
                  <Link href="/app">Try free</Link>
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Credits selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Card padding="lg" className="border-2 border-primary-500/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Build Your Credit Bundle</h2>
                <p className="text-foreground-muted">Select the number of credits you want to purchase</p>
              </div>

              <div className="space-y-8">
                {/* Photo Credits */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/5 to-primary-600/5 border border-primary-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <ImageIcon className="h-7 w-7 text-primary-500" />
              </div>
              <div>
                        <h3 className="text-xl font-semibold text-foreground">Photo Credits</h3>
                        <p className="text-foreground-muted">${PHOTO_PRICE.toFixed(2)} per credit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">${photoTotal.toFixed(2)}</p>
              </div>
            </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handlePhotoChange(-10)}
                      className="h-12 w-12 rounded-xl bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-center transition-colors"
                      disabled={photoCredits <= 0}
                    >
                      <Minus className="h-5 w-5 text-foreground" />
                    </button>
                    <input
                      type="number"
                      value={photoCredits}
                      onChange={(e) => setPhotoCredits(Math.max(0, Math.min(1000, parseInt(e.target.value) || 0)))}
                      className="w-32 h-14 text-center text-2xl font-bold bg-surface-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-foreground"
                    />
                    <button
                      onClick={() => handlePhotoChange(10)}
                      className="h-12 w-12 rounded-xl bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-center transition-colors"
                      disabled={photoCredits >= 1000}
                >
                      <Plus className="h-5 w-5 text-foreground" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {[10, 50, 100, 200].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setPhotoCredits(amount)}
                    className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                          photoCredits === amount
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                    )}
                  >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <ul className="mt-6 grid grid-cols-2 gap-2">
                    {['Room makeovers', 'AI generations', 'HD downloads', 'Never expires'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video Credits */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-purple-600/5 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Video className="h-7 w-7 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">Video Credits</h3>
                        <p className="text-foreground-muted">${VIDEO_PRICE.toFixed(2)} per credit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">${videoTotal.toFixed(2)}</p>
                    </div>
                    </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleVideoChange(-5)}
                      className="h-12 w-12 rounded-xl bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-center transition-colors"
                      disabled={videoCredits <= 0}
                    >
                      <Minus className="h-5 w-5 text-foreground" />
                    </button>
                    <input
                      type="number"
                      value={videoCredits}
                      onChange={(e) => setVideoCredits(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                      className="w-32 h-14 text-center text-2xl font-bold bg-surface-secondary rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-foreground"
                    />
                    <button
                      onClick={() => handleVideoChange(5)}
                      className="h-12 w-12 rounded-xl bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-center transition-colors"
                      disabled={videoCredits >= 100}
                    >
                      <Plus className="h-5 w-5 text-foreground" />
                    </button>
            </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {[5, 10, 20, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setVideoCredits(amount)}
                    className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                          videoCredits === amount
                            ? 'bg-purple-500 text-white'
                            : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                    )}
                  >
                        {amount}
                      </button>
                    ))}
                  </div>

                  <ul className="mt-6 grid grid-cols-2 gap-2">
                    {['Video animations', 'All motion presets', '720p export', 'Never expires'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checkout summary */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-foreground-muted mb-1">Your order</p>
                      <div className="flex items-center gap-4 text-sm text-foreground-muted">
                        {photoCredits > 0 && (
                          <span>{photoCredits} photo credit{photoCredits !== 1 ? 's' : ''}</span>
                        )}
                        {photoCredits > 0 && videoCredits > 0 && <span>+</span>}
                        {videoCredits > 0 && (
                          <span>{videoCredits} video credit{videoCredits !== 1 ? 's' : ''}</span>
                        )}
                        {photoCredits === 0 && videoCredits === 0 && (
                          <span>Select credits above</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground-muted mb-1">Total</p>
                      <p className="text-3xl font-bold text-foreground">${total.toFixed(2)}</p>
                    </div>
                  </div>

                    <Button
                    size="lg"
                      fullWidth
                    onClick={handlePurchase}
                    isLoading={purchasing}
                    disabled={total < 0.50 || (photoCredits === 0 && videoCredits === 0)}
                    >
                    <ShoppingCart className="h-5 w-5" />
                    {total >= 0.50 ? `Checkout — $${total.toFixed(2)}` : 'Minimum $0.50'}
                    </Button>

                  <p className="text-center text-xs text-foreground-muted mt-4">
                    Secure payment powered by Stripe. Credits are added instantly after payment.
                  </p>
                </div>
              </div>
                  </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-24"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion items={pricingFAQ} />
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  )
}
