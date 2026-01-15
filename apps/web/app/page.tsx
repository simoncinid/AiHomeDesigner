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
  Upload,
  Wand2,
  Download,
} from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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
      <HowItWorksSection />
      <PricingPreviewSection />
      <FAQSection />
    </MarketingLayout>
  )
}

function HeroSection() {
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
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
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
                className="body-large mb-8"
          >
                Upload a photo of your room and let AI redesign it in any style. 
                Perfect for homeowners, designers, and real estate professionals.
          </motion.p>

              {/* CTA buttons */}
          <motion.div
                initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button size="lg" asChild>
                      <Link href="/app/makeover">
                        <Sparkles className="h-5 w-5" />
                    Start Free Design
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/gallery">
                    View Gallery
                  </Link>
                </Button>
              </motion.div>

              {/* Free tier note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-foreground-muted flex items-center justify-center lg:justify-start gap-2"
              >
                <Zap className="h-4 w-4 text-warning" />
                1 free design per day — no credit card required
              </motion.p>
                  </div>

            {/* Right: Interactive preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Card variant="glass" padding="none" className="overflow-hidden backdrop-blur-xl">
                {/* Before/After preview */}
                <ImageCompareSlider
                  beforeImage="/images/before.jpg"
                  afterImage="/images/after.jpeg"
                  className="aspect-[4/3]"
                />
                
                {/* Style badges */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                  <Badge variant="default" className="backdrop-blur-sm bg-black/50 text-white border-white/20">
                    Before
                  </Badge>
                  <Badge variant="primary" className="backdrop-blur-sm">
                    Modern Style
                  </Badge>
                </div>
              </Card>

              {/* Floating stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -right-4 top-8 hidden xl:block"
              >
                <Card variant="glass" padding="sm" className="backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Generation time</p>
                      <p className="font-semibold text-foreground">&lt; 30 seconds</p>
                    </div>
                  </div>
            </Card>
          </motion.div>
          </motion.div>
          </div>
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
      before: '/images/before.jpg',
      after: '/images/after.jpeg',
      style: 'Modern',
      room: 'Living Room',
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

function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Photo',
      description: 'Take a photo of any room you want to redesign',
    },
    {
      icon: Wand2,
      title: 'Choose a Style',
      description: 'Select from 10+ interior design styles',
    },
    {
      icon: Download,
      title: 'Get Your Design',
      description: 'Download your AI-generated room in seconds',
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
            How it works
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto">
            Transform any room in 3 simple steps
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={fadeInUp} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface-secondary border-2 border-primary-500 flex items-center justify-center font-bold text-primary-500">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-foreground-muted">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <Link href="/app/makeover">
              <Sparkles className="h-5 w-5" />
              Try it free
              <ArrowRight className="h-5 w-5" />
          </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function PricingPreviewSection() {
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
            Simple, pay-as-you-go pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto">
            No subscriptions. Buy credits and use them whenever you want.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card variant="gradient" padding="lg" className="border-primary-500/20">
            <div className="grid md:grid-cols-3 gap-8 md:divide-x divide-border">
              {/* Free tier */}
              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-warning/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-7 w-7 text-warning" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
                <p className="text-3xl font-bold text-foreground mb-2">$0</p>
                <p className="text-foreground-muted text-sm mb-4">1 design per day</p>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-foreground-muted">All design styles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-foreground-muted">HD downloads</span>
                  </li>
                </ul>
              </div>

              {/* Photo credits */}
              <div className="text-center md:pl-8">
                <div className="h-14 w-14 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-7 w-7 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Photo Credits</h3>
                <p className="text-3xl font-bold text-foreground mb-2">$0.19</p>
                <p className="text-foreground-muted text-sm mb-4">per design</p>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-foreground-muted">Room makeovers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-foreground-muted">AI generations</span>
                  </li>
                </ul>
              </div>

              {/* Video credits */}
              <div className="text-center md:pl-8">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Video className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Video Credits</h3>
                <p className="text-3xl font-bold text-foreground mb-2">$2.99</p>
                <p className="text-foreground-muted text-sm mb-4">per video</p>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-foreground-muted">Video animations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-foreground-muted">720p export</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <Button size="lg" asChild>
                <Link href="/pricing">
                  Buy Credits
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <p className="text-xs text-foreground-muted mt-4">
                Credits never expire. Buy what you need, use when you want.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function FAQSection() {
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
