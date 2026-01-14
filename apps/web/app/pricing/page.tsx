'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Star, Image as ImageIcon, Video, Zap, CreditCard } from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FAQAccordion } from '@/components/ui/Accordion'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { apiClient, type PricingPack } from '@/lib/api'
import { cn } from '@/lib/utils'

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
  const [photoPacks, setPhotoPacks] = useState<PricingPack[]>([])
  const [videoPacks, setVideoPacks] = useState<PricingPack[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await apiClient.getPricing()
        setPhotoPacks(data.photoPacks)
        setVideoPacks(data.videoPacks)
      } catch (e) {
        // Use defaults
        setPhotoPacks([
          { id: 'photo-10', name: 'Starter', credits: 10, price: 9.99, priceId: 'price_photo_10' },
          { id: 'photo-30', name: 'Popular', credits: 30, price: 24.99, priceId: 'price_photo_30', popular: true },
          { id: 'photo-100', name: 'Pro', credits: 100, price: 69.99, priceId: 'price_photo_100' },
        ])
        setVideoPacks([
          { id: 'video-5', name: 'Starter', credits: 5, price: 14.99, priceId: 'price_video_5' },
          { id: 'video-15', name: 'Popular', credits: 15, price: 39.99, priceId: 'price_video_15', popular: true },
          { id: 'video-50', name: 'Pro', credits: 50, price: 99.99, priceId: 'price_video_50' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchPricing()
  }, [])

  const handlePurchase = async (packId: string) => {
    if (!isAuthenticated) {
      toast({ type: 'info', title: 'Sign in required', message: 'Please sign in to purchase credits' })
      window.location.href = '/login?redirect=/pricing'
      return
    }

    setPurchasing(packId)
    try {
      const response = await apiClient.createCheckout(packId)
      window.location.href = response.url
    } catch (error: any) {
      toast({ type: 'error', title: 'Error', message: error.detail || 'Failed to start checkout' })
    } finally {
      setPurchasing(null)
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
              Pay only for what you use
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              No subscriptions required. Buy credit packs and use them whenever you need.
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

          {/* Photo packs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Photo Credits</h2>
                <p className="text-foreground-muted">For room makeovers and generated designs</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {photoPacks.map((pack, index) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card 
                    padding="lg" 
                    className={cn(
                      'relative h-full',
                      pack.popular && 'border-primary-500 shadow-glow'
                    )}
                  >
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="primary">
                          <Star className="h-3 w-3 mr-1" />
                          Best value
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-foreground">{pack.name}</h3>
                      <p className="text-sm text-foreground-muted">{pack.credits} photo credits</p>
                    </div>

                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-foreground">${pack.price}</span>
                      <p className="text-sm text-foreground-muted mt-1">
                        ${(pack.price / pack.credits).toFixed(2)} per credit
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {[
                        `${pack.credits} photo generations`,
                        'All styles included',
                        'HD downloads',
                        'Never expires',
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <Check className="h-4 w-4 text-success shrink-0" />
                          <span className="text-foreground-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={pack.popular ? 'primary' : 'secondary'}
                      fullWidth
                      onClick={() => handlePurchase(pack.id)}
                      isLoading={purchasing === pack.id}
                    >
                      Buy {pack.credits} credits
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Video packs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Video className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Video Credits</h2>
                <p className="text-foreground-muted">For cinematic video animations</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {videoPacks.map((pack, index) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card 
                    padding="lg" 
                    className={cn(
                      'relative h-full',
                      pack.popular && 'border-purple-500 shadow-glow'
                    )}
                  >
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="primary" className="bg-purple-500">
                          <Star className="h-3 w-3 mr-1" />
                          Best value
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-foreground">{pack.name}</h3>
                      <p className="text-sm text-foreground-muted">{pack.credits} video credits</p>
                    </div>

                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-foreground">${pack.price}</span>
                      <p className="text-sm text-foreground-muted mt-1">
                        ${(pack.price / pack.credits).toFixed(2)} per video
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {[
                        `${pack.credits} video generations`,
                        'All motion presets',
                        '720p export',
                        'Never expires',
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <Check className="h-4 w-4 text-success shrink-0" />
                          <span className="text-foreground-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={pack.popular ? 'primary' : 'secondary'}
                      fullWidth
                      onClick={() => handlePurchase(pack.id)}
                      isLoading={purchasing === pack.id}
                    >
                      Buy {pack.credits} credits
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
