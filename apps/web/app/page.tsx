'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Zap,
  Check,
  Star,
} from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { ImageCompareSlider } from '@/components/ui/ImageCompareSlider'
import { FAQAccordion } from '@/components/ui/Accordion'
import { STYLE_PRESETS, ROOM_TYPES, FAQ_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <BeforeAfterSection />
      <PricingPreviewSection />
      <FAQSection />
    </MarketingLayout>
  )
}

function HeroSection() {
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [selectedRoom, setSelectedRoom] = useState('living_room')

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient" />
      <div className="absolute inset-0 noise" />
      
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 blob-1" />
      <div className="absolute bottom-20 right-10 blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blob-3" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex mb-6"
          >
            <Badge variant="primary" size="lg" icon={<Sparkles className="h-4 w-4" />}>
              AI-Powered Interior Design
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="heading-1 text-foreground mb-6"
          >
            Transform your space{' '}
            <span className="text-gradient">in seconds</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="body-large max-w-2xl mx-auto mb-10"
          >
            Upload a photo or describe your dream room. Get stunning, realistic redesigns 
            powered by AI. Perfect for homeowners, designers, and real estate professionals.
          </motion.p>

          {/* Mini Generator Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <Card variant="glass" padding="lg" className="backdrop-blur-2xl">
              <Tabs defaultValue="makeover">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="makeover" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Makeover from photo
                  </TabsTrigger>
                  <TabsTrigger value="generate" className="flex-1">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate a room
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="makeover">
                  <div className="space-y-4">
                    {/* Style picker */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Choose style
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {STYLE_PRESETS.slice(0, 6).map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setSelectedStyle(style.value)}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                              selectedStyle === style.value
                                ? 'bg-primary-500 text-white shadow-glow'
                                : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                            )}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button size="lg" fullWidth asChild>
                      <Link href="/app/makeover">
                        <Sparkles className="h-5 w-5" />
                        Generate free image
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="generate">
                  <div className="space-y-4">
                    {/* Room type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Room type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ROOM_TYPES.slice(0, 4).map((room) => (
                          <button
                            key={room.value}
                            onClick={() => setSelectedRoom(room.value)}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                              selectedRoom === room.value
                                ? 'bg-primary-500 text-white shadow-glow'
                                : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                            )}
                          >
                            {room.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button size="lg" fullWidth asChild>
                      <Link href="/app/room-generator">
                        <ImageIcon className="h-5 w-5" />
                        Generate room concept
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Free note */}
              <p className="text-center text-sm text-foreground-muted mt-4">
                <Zap className="inline h-4 w-4 mr-1 text-warning" />
                1 free generation per day — no credit card required
              </p>
            </Card>
          </motion.div>

          {/* See examples link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
            >
              See examples
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  const stats = [
    { label: 'Designs generated', value: 'Growing daily' },
    { label: 'Design styles', value: '10+' },
    { label: 'Avg generation time', value: '< 30s' },
  ]

  return (
    <section className="py-12 border-y border-border bg-surface-secondary/50">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-foreground-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Photo Makeover',
      description: 'Transform existing room photos into stunning redesigns. Keep your layout and furniture or reimagine everything.',
      href: '/app/makeover',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      icon: ImageIcon,
      title: 'Room Generator',
      description: 'Create rooms from scratch using text descriptions. Perfect for visualizing dream spaces before they exist.',
      href: '/app/room-generator',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Video,
      title: 'Photo to Video',
      description: 'Bring your designs to life with cinematic camera movements. Create stunning video walkthroughs.',
      href: '/app/photo-to-video',
      gradient: 'from-cyan-500 to-cyan-600',
    },
  ]

  return (
    <section id="features" className="py-24 bg-surface">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="heading-2 text-foreground mb-4">
            Everything you need to visualize your perfect space
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto">
            Powerful AI tools designed for both professionals and homeowners
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <Card variant="interactive" padding="lg" className="h-full group">
                <div className={cn(
                  'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
                  feature.gradient
                )}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground-muted mb-6">
                  {feature.description}
                </p>
                <Link 
                  href={feature.href}
                  className="inline-flex items-center gap-2 text-primary-500 font-medium hover:gap-3 transition-all"
                >
                  Try it now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BeforeAfterSection() {
  const examples = [
    {
      before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      style: 'Modern',
      room: 'Living Room',
    },
    {
      before: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      after: 'https://images.unsplash.com/photo-1600210492486-275a8ee65a7c?w=800',
      style: 'Scandinavian',
      room: 'Kitchen',
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-24 bg-surface-secondary">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="heading-2 text-foreground mb-4">
            See the transformation
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto">
            Drag the slider to compare before and after
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Main slider */}
          <div className="mb-6">
            <ImageCompareSlider
              beforeImage={examples[activeIndex].before}
              afterImage={examples[activeIndex].after}
              className="aspect-video rounded-2xl shadow-elevated"
            />
          </div>

          {/* Style info */}
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="primary">
              {examples[activeIndex].room}
            </Badge>
            <Badge variant="default">
              {examples[activeIndex].style} Style
            </Badge>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-4">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative w-24 h-16 rounded-lg overflow-hidden transition-all',
                  activeIndex === index
                    ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-secondary'
                    : 'opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={example.after}
                  alt={`Example ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PricingPreviewSection() {
  const plans = [
    {
      name: 'Free',
      description: 'Try it out',
      price: 0,
      features: ['1 photo per day', 'All styles', 'Download HD images'],
      cta: 'Start free',
      href: '/app',
      popular: false,
    },
    {
      name: 'Photo Pack',
      description: 'For photo designs',
      price: 9.99,
      priceLabel: 'from',
      features: ['10+ photo credits', 'All styles', 'HD downloads', 'Priority support'],
      cta: 'Buy credits',
      href: '/pricing',
      popular: true,
    },
    {
      name: 'Video Pack',
      description: 'For video content',
      price: 14.99,
      priceLabel: 'from',
      features: ['5+ video credits', 'All motion presets', '720p export', 'Priority support'],
      cta: 'Buy credits',
      href: '/pricing',
      popular: false,
    },
  ]

  return (
    <section className="py-24 bg-surface">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="heading-2 text-foreground mb-4">
            Simple, transparent pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto">
            Pay only for what you use. No subscriptions required.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={fadeInUp}>
              <Card 
                variant={plan.popular ? 'gradient' : 'default'} 
                padding="lg"
                className={cn(
                  'h-full relative',
                  plan.popular && 'border-primary-500/50 shadow-glow'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">
                      <Star className="h-3 w-3 mr-1" />
                      Most popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-foreground-muted">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  {plan.priceLabel && (
                    <span className="text-sm text-foreground-muted">{plan.priceLabel} </span>
                  )}
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      <span className="text-foreground-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? 'primary' : 'secondary'} 
                  fullWidth
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/pricing"
            className="inline-flex items-center gap-2 text-primary-500 font-medium hover:gap-3 transition-all"
          >
            View all pricing options
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function FAQSection() {
  return (
    <section className="py-24 bg-surface-secondary">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="heading-2 text-foreground mb-4">
            Frequently asked questions
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto">
            Everything you need to know about AI Home Designer
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <FAQAccordion items={FAQ_ITEMS} />
        </motion.div>
      </div>
    </section>
  )
}
