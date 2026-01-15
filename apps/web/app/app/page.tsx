'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  CreditCard,
  ArrowRight,
  Clock,
  Zap,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'
import { useJobsStore, type Job } from '@/lib/stores/jobs'

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

export default function AppDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const { photoCredits, videoCredits, freeQuotaRemaining, refresh } = useCreditsStore()
  const { history, fetchHistory } = useJobsStore()

  useEffect(() => {
    refresh()
    if (isAuthenticated) {
      fetchHistory()
    }
  }, [refresh, isAuthenticated, fetchHistory])

  const displayHistory = history.filter(job => job.status === 'completed').slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="heading-3 text-foreground">
            {isAuthenticated && user ? (
              <>Welcome back, {user.firstName || user.email.split('@')[0]}!</>
            ) : (
              <>Welcome, Guest!</>
            )}
          </h1>
          <p className="text-foreground-muted mt-1">
            {isAuthenticated 
              ? 'Ready to transform more spaces?' 
              : 'Sign in to save your designs and history'}
          </p>
        </div>
        {!isAuthenticated && (
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </motion.div>

      {/* Credits cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeInUp}>
          <Card variant="gradient" className="border-primary-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Photo Credits</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{photoCredits}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card variant="gradient" className="border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Video Credits</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{videoCredits}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card variant="gradient" className="border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Free Today</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{freeQuotaRemaining}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Buy credits CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card 
          variant="glass" 
          padding="lg" 
          className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-500 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Need more credits?</h3>
                <p className="text-sm text-foreground-muted">Buy photo and video credits at great prices</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/pricing">
                Buy credits
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Recent history */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-4 text-foreground">Recent designs</h2>
          {isAuthenticated && displayHistory.length > 0 && (
            <Link 
              href="/app/account"
              className="text-sm text-primary-500 hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {displayHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayHistory.map((job, index) => {
              // Usa l'immagine output per entrambi i bottoni
              const imageUrl = job.outputUrls?.[0] || null
              // Per edit, preferisci input se disponibile, altrimenti output
              const editImageUrl = (Array.isArray(job.inputUrls) && job.inputUrls[0]) 
                || (job.inputUrls && typeof job.inputUrls === 'object' && !Array.isArray(job.inputUrls) && (job.inputUrls as any)?.images?.[0])
                || imageUrl
              
              return (
                <motion.div key={job.id} variants={fadeInUp}>
                  <Card variant="interactive" padding="none" className="overflow-hidden group">
                    <div className="aspect-video relative bg-surface-secondary">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt="Design"
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge 
                          variant={job.kind === 'i2v' ? 'primary' : 'default'}
                          size="sm"
                        >
                          {job.kind === 'edit' ? 'Makeover' : job.kind === 't2i' ? 'Generated' : 'Video'}
                        </Badge>
                      </div>
                      {/* Overlay con bottoni in basso */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editImageUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 backdrop-blur-sm bg-white/20 border-white/50 text-white hover:bg-white/30"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={`/app/makeover?imageUrl=${encodeURIComponent(editImageUrl)}`}>
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                        )}
                        {imageUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 backdrop-blur-sm bg-white/20 border-white/50 text-white hover:bg-white/30"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={`/app/photo-to-video?imageUrl=${encodeURIComponent(imageUrl)}`}>
                              <Video className="h-4 w-4" />
                              Generate Video
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                              {job.roomType?.replace('_', ' ') || 'Room design'}
                          </p>
                          <p className="text-xs text-foreground-muted capitalize">
                            {job.stylePreset} style
                          </p>
                        </div>
                        <Link 
                          href={`/app/job/${job.id}`}
                          className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground transition-colors"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(job.createdAt)}
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-foreground-muted" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No designs yet</h3>
            <p className="text-foreground-muted mb-6">
              Create your first design to see it here
            </p>
            <Button asChild>
              <Link href="/app/makeover">
                <Sparkles className="h-4 w-4" />
                Create your first design
              </Link>
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
