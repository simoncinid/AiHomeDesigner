'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Download, 
  Share2, 
  Video, 
  Plus, 
  Sparkles,
  RotateCcw,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ImageCompareSlider } from '@/components/ui/ImageCompareSlider'
import { IndeterminateProgress } from '@/components/ui/Progress'
import { Skeleton } from '@/components/ui/Skeleton'
import { apiClient } from '@/lib/api'

export default function JobPage() {
  const params = useParams()
  const jobId = params.id as string

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiClient.getJob(jobId),
    refetchInterval: (query) => {
      const jobData = query.state.data
      return jobData?.status === 'processing' ? 2000 : false
    },
  })

  if (isLoading || !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-foreground-muted">Loading...</p>
        </div>
      </div>
    )
  }

  // Processing state
  if (job.status === 'processing') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card padding="lg" className="text-center">
            <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
            </div>
            <h2 className="heading-3 text-foreground mb-2">Creating your design</h2>
            <p className="text-foreground-muted mb-6">
              AI is working on your design. This usually takes 30-60 seconds.
            </p>
            <IndeterminateProgress className="mb-4" />
            <p className="text-xs text-foreground-muted font-mono">
              Job ID: {jobId.slice(0, 8)}...
            </p>
            <div className="mt-6 p-3 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Don't close this page
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Failed state
  if (job.status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card padding="lg" className="text-center">
            <div className="h-20 w-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="heading-3 text-foreground mb-2">Generation Failed</h2>
            <p className="text-foreground-muted mb-6">
              {job.error || 'An unexpected error occurred. Please try again.'}
            </p>
            <Button asChild>
              <Link href="/app/makeover">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Link>
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Completed state
  if (job.status === 'completed' && job.outputUrls && job.outputUrls.length > 0) {
    const isEditJob = job.kind === 'edit' && job.inputUrls && job.inputUrls.length > 0

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge variant="success" size="lg" className="mb-3">
            <Check className="h-4 w-4" />
            Design completed!
          </Badge>
          <h1 className="heading-3 text-foreground mb-1">Your results are ready</h1>
          {isEditJob && (
            <p className="text-foreground-muted text-sm">
              Drag the slider to compare before and after
            </p>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isEditJob ? (
            <Card padding="none" className="overflow-hidden">
              <div className="aspect-square max-h-[60vh]">
                <ImageCompareSlider
                  beforeImage={job.inputUrls![0]}
                  afterImage={job.outputUrls[0]}
                  aspectRatio="auto"
                  className="h-full"
                />
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="secondary" asChild>
                    <a
                      href={job.outputUrls[0]}
                      download="design-ai-home-designer.png"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download Image
                    </a>
                  </Button>
                  <Button variant="secondary" asChild>
                    <a href={job.shareUrl} target="_blank" rel="noopener noreferrer">
                      <Share2 className="h-4 w-4" />
                      Share
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {job.outputUrls.map((url, idx) => (
                <Card key={idx} variant="interactive" padding="none" className="overflow-hidden group">
                  <div className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Design ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        className="backdrop-blur-sm bg-white/20 border-white/50 text-white hover:bg-white/30"
                        asChild
                      >
                        <a
                          href={url}
                          download={`design-${idx + 1}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {job.kind === 'edit' && (
                <Button asChild>
                  <Link href={`/app/photo-to-video?image=${encodeURIComponent(job.outputUrls[0])}`}>
                    <Video className="h-4 w-4" />
                    Create Video
                  </Link>
                </Button>
              )}
              <Button variant="secondary" asChild>
                <Link href="/app/makeover">
                  <Sparkles className="h-4 w-4" />
                  Generate More
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/app/room-generator">
                  <Plus className="h-4 w-4" />
                  Create from Scratch
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Default loading state
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Skeleton className="h-[400px] w-full max-w-2xl rounded-2xl" />
    </div>
  )
}
