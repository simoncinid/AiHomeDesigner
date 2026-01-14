'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Download, 
  Share2, 
  Sparkles,
  Play,
  ExternalLink,
} from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ImageCompareSlider } from '@/components/ui/ImageCompareSlider'
import { Skeleton } from '@/components/ui/Skeleton'
import { apiClient, type Job } from '@/lib/api'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/constants'

interface SharePageProps {
  params: { shareId: string }
}

export default function SharePage({ params }: SharePageProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await apiClient.getJobByShareId(params.shareId)
        setJob(data)
      } catch (e: any) {
        setError('Design not found')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [params.shareId])

  if (loading) {
    return (
      <MarketingLayout>
        <section className="pt-32 pb-24 bg-surface">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-[400px] w-full rounded-2xl mb-6" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </section>
      </MarketingLayout>
    )
  }

  if (error || !job) {
    return (
      <MarketingLayout>
        <section className="pt-32 pb-24 bg-surface">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="h-20 w-20 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h1 className="heading-2 text-foreground mb-4">Design not found</h1>
              <p className="text-foreground-muted mb-8">
                This design may have been removed or the link is invalid.
              </p>
              <Button asChild>
                <Link href="/app">
                  <Sparkles className="h-4 w-4" />
                  Create your own
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </MarketingLayout>
    )
  }

  const roomType = ROOM_TYPES.find(r => r.value === job.roomType)
  const style = STYLE_PRESETS.find(s => s.value === job.stylePreset)
  const isVideo = job.kind === 'i2v'
  const hasBeforeAfter = job.inputUrls?.[0] && job.outputUrls?.[0] && !isVideo

  return (
    <MarketingLayout>
      <section className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                {roomType && (
                  <Badge variant="default" size="lg">
                    {roomType.label}
                  </Badge>
                )}
                {style && (
                  <Badge variant="primary" size="lg">
                    {style.label} Style
                  </Badge>
                )}
                {isVideo && (
                  <Badge variant="primary" size="lg">
                    <Play className="h-3 w-3" />
                    Video
                  </Badge>
                )}
              </div>
              <h1 className="heading-2 text-foreground mb-2">
                {isVideo ? 'Video Walkthrough' : 'Room Transformation'}
              </h1>
              <p className="text-foreground-muted">
                Created with AI Home Designer
              </p>
            </motion.div>

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              {isVideo && job.outputUrls?.[0] ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                  <video
                    src={job.outputUrls[0]}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : hasBeforeAfter ? (
                <ImageCompareSlider
                  beforeImage={job.inputUrls![0]}
                  afterImage={job.outputUrls![0]}
                  className="aspect-video"
                />
              ) : job.outputUrls?.[0] ? (
                <div className="aspect-video relative rounded-2xl overflow-hidden bg-surface-secondary">
                  <Image
                    src={job.outputUrls[0]}
                    alt="Generated design"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              {job.outputUrls?.[0] && (
                <Button variant="secondary" asChild>
                  <a href={job.outputUrls[0]} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              )}
              <Button variant="secondary">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                variant="gradient" 
                padding="lg" 
                className="text-center bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20"
              >
                <h2 className="heading-3 text-foreground mb-2">
                  Like what you see?
                </h2>
                <p className="text-foreground-muted mb-6 max-w-lg mx-auto">
                  Create your own stunning room transformations with AI Home Designer. 
                  Get 1 free design every day.
                </p>
                <Button size="lg" asChild>
                  <Link href="/app">
                    <Sparkles className="h-5 w-5" />
                    Try it free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
