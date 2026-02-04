'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Image as ImageIcon, 
  Download, 
  Share2, 
  Video,
  Loader2,
  RotateCcw,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { IndeterminateProgress } from '@/components/ui/Progress'
import { toast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'
import { useJobsStore } from '@/lib/stores/jobs'
import { apiClient } from '@/lib/api'
import { ROOM_TYPES, STYLE_PRESETS, BUDGET_LEVELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const LANGUAGE_OPTIONS = [
  { value: 'it', label: 'Italiano' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Español' },
  { value: 'pt-br', label: 'Português (Brasil)' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ja', label: 'Japanese' },
]

export default function RoomGeneratorPage() {
  // State
  const [roomType, setRoomType] = useState('living_room')
  const [stylePreset, setStylePreset] = useState('modern')
  const [budgetLevel, setBudgetLevel] = useState('mid')
  const [prompt, setPrompt] = useState('')
  const [selectedOutput, setSelectedOutput] = useState(0)

  // Lead capture & gating download
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadLanguage, setLeadLanguage] = useState('it')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [lastGenerationWasFree, setLastGenerationWasFree] = useState(false)
  const [isDownloadUnlocked, setIsDownloadUnlocked] = useState(false)
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false)

  // Stores
  const { isAuthenticated } = useAuthStore()
  const { photoCredits, freeQuotaRemaining, decrementFreeQuota, decrementPhotoCredits } = useCreditsStore()
  const { 
    currentJobStatus, 
    currentOutputs, 
    currentError, 
    startJob, 
    setOutputs, 
    setError, 
    reset,
    setPolling,
  } = useJobsStore()

  const canGenerate = freeQuotaRemaining > 0 || photoCredits > 0
  const isGenerating = currentJobStatus === 'processing' || currentJobStatus === 'uploading'
  const isFree = freeQuotaRemaining > 0
  const shouldShowWatermark = lastGenerationWasFree && !isDownloadUnlocked
  const isDownloadBlocked = lastGenerationWasFree && !isDownloadUnlocked

  // Carica stato di sblocco da localStorage (una sola volta per browser)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('aihd_free_lead_submitted')
    if (stored === '1') {
      setHasSubmittedLead(true)
      setIsDownloadUnlocked(true)
    }
  }, [])

  const handleLeadSubmit = async (e: any) => {
    e.preventDefault()
    if (!leadName.trim() || !leadEmail.trim()) {
      toast({
        type: 'error',
        title: 'Missing information',
        message: 'Please enter your name and email to unlock the download.',
      })
      return
    }

    setLeadSubmitting(true)
    try {
      await apiClient.submitFreeLead({
        name: leadName.trim(),
        email: leadEmail.trim(),
        language: leadLanguage,
      })

      setHasSubmittedLead(true)
      setIsDownloadUnlocked(true)
      setShowLeadModal(false)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('aihd_free_lead_submitted', '1')
      }

      toast({
        type: 'success',
        title: 'Download unlocked',
        message: 'You can now download your design without watermark.',
      })
    } catch (error: any) {
      const detail = error?.detail || 'Failed to save your information'
      toast({
        type: 'error',
        title: 'Error',
        message: detail,
      })
    } finally {
      setLeadSubmitting(false)
    }
  }

  const handleGenerate = async () => {
    if (isGenerating) return

    try {
      startJob('temp', 't2i')
      
      const job = await apiClient.createT2IJob({
        roomType,
        stylePreset,
        userPrompt: prompt || undefined,
      })
      
      startJob(job.id, 't2i')
      setPolling(true)
      
      let attempts = 0
      const maxAttempts = 60

      const poll = async () => {
        try {
          const result = await apiClient.getJob(job.id)
          
          if (result.status === 'completed' && result.outputUrls) {
            setOutputs(result.outputUrls)
            setPolling(false)
            
            if (isFree) {
              decrementFreeQuota()
            } else {
              decrementPhotoCredits()
            }

            // Gating download per free generation
            setLastGenerationWasFree(isFree)
            if (isFree && !hasSubmittedLead) {
              setIsDownloadUnlocked(false)
              setShowLeadModal(true)
            } else {
              setIsDownloadUnlocked(true)
            }
            
            toast({ type: 'success', title: 'Room generated!', message: 'Your design is ready' })
          } else if (result.status === 'failed') {
            setError(result.error || 'Generation failed')
            setPolling(false)
            toast({ type: 'error', title: 'Generation failed', message: result.error })
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(poll, 2000)
          } else {
            setError('Generation timed out')
            setPolling(false)
          }
        } catch (e) {
          setError('Failed to check status')
          setPolling(false)
        }
      }

      poll()
    } catch (error: any) {
      setError(error.detail || 'Failed to start generation')
      toast({ type: 'error', title: 'Error', message: error.detail || 'Failed to start generation' })
    }
  }

  return (
    <div className="h-full">
      <div className="grid lg:grid-cols-2 gap-6 h-full">
        {/* Left panel - Inputs */}
        <div className="space-y-6 overflow-y-auto pb-6">
          {/* Header */}
          <div>
            <h1 className="heading-3 text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              Room Generator
            </h1>
            <p className="text-foreground-muted mt-2">
              Create stunning room designs from text descriptions
            </p>
          </div>

          {/* Room type */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              1. Room type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROOM_TYPES.map((room) => (
                <button
                  key={room.value}
                  onClick={() => setRoomType(room.value)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-center',
                    roomType === room.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-border hover:border-border-hover'
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{room.label}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Style presets */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              2. Choose style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLE_PRESETS.slice(0, 6).map((style) => (
                <button
                  key={style.value}
                  onClick={() => setStylePreset(style.value)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-left',
                    stylePreset === style.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-border hover:border-border-hover'
                  )}
                >
                  <div 
                    className="h-3 w-3 rounded-full mb-2"
                    style={{ backgroundColor: style.color }}
                  />
                  <p className="text-sm font-medium text-foreground">{style.label}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Budget level */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              3. Budget vibe
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setBudgetLevel(level.value)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-center',
                    budgetLevel === level.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-border hover:border-border-hover'
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{level.label}</p>
                  <p className="text-xs text-foreground-muted">{level.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Prompt input */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              4. Describe your vision (optional)
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Large windows with city view, built-in fireplace, open floor plan..."
            />
          </Card>

          {/* Generate button */}
          <div className="sticky bottom-0 bg-surface-secondary pt-4 pb-2">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              isLoading={isGenerating}
              fullWidth
              size="lg"
            >
              {isGenerating ? (
                'Generating...'
              ) : (
                <>
                  <ImageIcon className="h-5 w-5" />
                  Generate room
                </>
              )}
            </Button>
            <p className="text-center text-sm text-foreground-muted mt-2">
              {isFree ? (
                <span className="text-success">Free today!</span>
              ) : (
                <span>Uses 1 photo credit</span>
              )}
            </p>
          </div>
        </div>

        {/* Right panel - Results */}
        <Card padding="lg" className="min-w-0 h-fit">
          <label className="text-sm font-medium text-foreground mb-3 block">Results</label>

          {/* Container with fixed aspect ratio */}
          <div className="w-full aspect-video relative rounded-xl overflow-hidden bg-surface-secondary mb-3">
            {/* Loading state */}
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-full max-w-sm px-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground text-center mb-1">
                    Creating your room...
                  </h3>
                  <p className="text-xs text-foreground-muted text-center mb-4">
                    This usually takes 15-30 seconds
                  </p>
                  <IndeterminateProgress />
                </div>
              </div>
            )}

            {/* Error state */}
            {currentError && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center px-4">
                  <div className="h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">😕</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Something went wrong
                  </h3>
                  <p className="text-xs text-foreground-muted mb-4">{currentError}</p>
                  <Button variant="secondary" size="sm" onClick={reset}>
                    <RotateCcw className="h-3 w-3" />
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {/* Success state */}
            {currentOutputs.length > 0 && !isGenerating && (
              <div className="absolute inset-0">
                {currentOutputs[selectedOutput] && (
                  <>
                    <Image
                      src={currentOutputs[selectedOutput]}
                      alt="Generated room"
                      fill
                      className="object-cover"
                    />
                    {shouldShowWatermark && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="px-6 py-3 rounded-full bg-black/40 border border-white/20">
                          <span className="text-xs font-semibold tracking-wide uppercase text-white/90">
                            AI Home Designer – Free Preview
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Empty state */}
            {!isGenerating && !currentError && currentOutputs.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="h-16 w-16 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
                  <ImageIcon className="h-8 w-8 text-foreground-muted" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Your design will appear here
                </h3>
                <p className="text-xs text-foreground-muted max-w-xs">
                  Select room type and style, then click generate to create your dream room
                </p>
              </div>
            )}
          </div>

          {/* Actions - only show when there are outputs */}
          {currentOutputs.length > 0 && !isGenerating && (
            <div className="space-y-3">
              {/* Output thumbnails */}
              {currentOutputs.length > 1 && (
                <div className="flex gap-2">
                  {currentOutputs.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOutput(index)}
                      className={cn(
                        'relative h-12 w-16 rounded-lg overflow-hidden transition-all',
                        selectedOutput === index
                          ? 'ring-2 ring-primary-500'
                          : 'opacity-60 hover:opacity-100'
                      )}
                    >
                      <Image src={url} alt={`Output ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {isDownloadBlocked ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => setShowLeadModal(true)}
                  >
                    <Download className="h-3 w-3" />
                    Unlock download
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" fullWidth asChild>
                    <a
                      href={currentOutputs[selectedOutput]}
                      download={`room-design-${selectedOutput + 1}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                  </Button>
                )}
                <Button variant="secondary" size="sm" fullWidth>
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
                <Button variant="secondary" size="sm" fullWidth asChild>
                  <a href="/app/photo-to-video">
                    <Video className="h-3 w-3" />
                    Make video
                  </a>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Lead capture modal for free generations */}
      <Modal
        isOpen={showLeadModal}
        onClose={() => {
          if (!leadSubmitting) setShowLeadModal(false)
        }}
        title="Unlock your free download"
        description="Tell us a bit about you to download your design without watermark."
        size="md"
      >
        <form
          className="space-y-4"
          onSubmit={handleLeadSubmit}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Language</label>
            <Select
              value={leadLanguage}
              onChange={(e) => setLeadLanguage(e.target.value)}
              options={LANGUAGE_OPTIONS}
            />
          </div>
          <p className="text-xs text-foreground-muted">
            We don&apos;t send verification codes. By continuing you agree to be contacted
            occasionally about AI Home Designer.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowLeadModal(false)}
              disabled={leadSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={leadSubmitting}
            >
              Unlock download
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
