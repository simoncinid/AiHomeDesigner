'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Video, 
  Download, 
  Share2, 
  Play,
  Loader2,
  RotateCcw,
  Clock,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Dropzone } from '@/components/ui/Dropzone'
import { IndeterminateProgress } from '@/components/ui/Progress'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'
import { useJobsStore } from '@/lib/stores/jobs'
import { apiClient } from '@/lib/api'
import { MOTION_PRESETS, ASPECT_RATIOS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function PhotoToVideoPage() {
  // State
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [motionPreset, setMotionPreset] = useState('orbit')
  const [duration, setDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [customPrompt, setCustomPrompt] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // Stores
  const { isAuthenticated } = useAuthStore()
  const { videoCredits, decrementVideoCredits } = useCreditsStore()
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

  // Handlers
  const handleImageSelect = useCallback((file: File) => {
    setImage(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [])

  const clearImage = useCallback(() => {
    setImage(null)
    setImagePreview(null)
    setVideoUrl(null)
    reset()
  }, [reset])

  const canGenerate = image && videoCredits > 0
  const isGenerating = currentJobStatus === 'processing' || currentJobStatus === 'uploading'

  const handleGenerate = async () => {
    if (!image || isGenerating) return

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('motion_preset', motionPreset)
      formData.append('duration', duration.toString())
      formData.append('aspect_ratio', aspectRatio)
      if (customPrompt.trim()) {
        formData.append('user_prompt', customPrompt.trim())
      }

      startJob('temp', 'i2v')
      
      const job = await apiClient.createI2VJob(formData)
      startJob(job.id, 'i2v')
      setPolling(true)
      
      let attempts = 0
      const maxAttempts = 120 // 4 minutes max for video

      const poll = async () => {
        try {
          const result = await apiClient.getJob(job.id)
          
          if (result.status === 'completed' && result.outputUrls) {
            setOutputs(result.outputUrls)
            setVideoUrl(result.outputUrls[0])
            setPolling(false)
            decrementVideoCredits()
            toast({ type: 'success', title: 'Video created!', message: 'Your video is ready to download' })
          } else if (result.status === 'failed') {
            setError(result.error || 'Video generation failed')
            setPolling(false)
            toast({ type: 'error', title: 'Generation failed', message: result.error })
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(poll, 2000)
          } else {
            setError('Video generation timed out')
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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              Photo to Video
            </h1>
            <p className="text-foreground-muted mt-2">
              Bring your designs to life with cinematic camera movements
            </p>
          </div>

          {/* Image upload */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              1. Choose an image
            </label>
            <Dropzone
              onFileSelect={handleImageSelect}
              currentFile={image}
              currentPreview={imagePreview}
              onClear={clearImage}
              label="Drop your image here"
              hint="or select from your recent generations"
            />
          </Card>

          {/* Motion presets */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              2. Motion style
            </label>
            <div className="space-y-2">
              {MOTION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setMotionPreset(preset.value)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4',
                    motionPreset === preset.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-border hover:border-border-hover'
                  )}
                >
                  <div className="h-10 w-10 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0">
                    <Video className="h-5 w-5 text-foreground-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{preset.label}</p>
                    <p className="text-sm text-foreground-muted">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Custom prompt */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              3. Custom prompt (optional)
            </label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., move to the window, focus on the sofa, pan across the room..."
              hint="Add specific camera movements or focus points to customize your video"
              rows={3}
            />
          </Card>

          {/* Duration and aspect ratio settings */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              4. Output settings
            </label>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Duration
                </label>
                <Select
                  value={duration.toString()}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  options={Array.from({ length: 8 }, (_, i) => {
                    const value = i + 5
                    return { value: value.toString(), label: `${value}s` }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Aspect Ratio
                </label>
                <Select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  options={ASPECT_RATIOS.map(ar => ({ value: ar.value, label: ar.label }))}
                />
              </div>
              <div className="p-4 rounded-xl bg-surface-secondary">
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="h-4 w-4 text-foreground-muted" />
                  <span className="text-sm font-medium text-foreground">Resolution</span>
                </div>
                <p className="text-2xl font-bold text-foreground">1080p</p>
                <p className="text-xs text-foreground-muted mt-1">High quality output</p>
              </div>
            </div>
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
                'Creating video...'
              ) : (
                <>
                  <Video className="h-5 w-5" />
                  Create video
                </>
              )}
            </Button>
            <p className="text-center text-sm text-foreground-muted mt-2">
              Uses 1 video credit • {videoCredits} available
            </p>
            {videoCredits === 0 && (
              <p className="text-center text-sm text-warning mt-1">
                <a href="/pricing" className="underline">Buy video credits</a> to continue
              </p>
            )}
          </div>
        </div>

        {/* Right panel - Results */}
        <Card padding="lg" className="min-w-0 h-fit">
          <label className="text-sm font-medium text-foreground mb-3 block">Preview</label>

          {/* Container with fixed aspect ratio */}
          <div className="w-full aspect-video relative rounded-xl overflow-hidden bg-surface-secondary mb-3">
            {/* Loading state */}
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-full max-w-sm px-4">
                  <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-6 w-6 text-cyan-500 animate-spin" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground text-center mb-1">
                    Creating your video...
                  </h3>
                  <p className="text-xs text-foreground-muted text-center mb-4">
                    This usually takes 1-2 minutes
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
            {videoUrl && !isGenerating && (
              <div className="absolute inset-0">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Empty state */}
            {!isGenerating && !currentError && !videoUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="h-16 w-16 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-foreground-muted" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Your video will appear here
                </h3>
                <p className="text-xs text-foreground-muted max-w-xs">
                  Upload an image and select a motion style to create your cinematic video
                </p>
              </div>
            )}
          </div>

          {/* Actions - only show when there are outputs */}
          {videoUrl && !isGenerating && (
            <div className="space-y-3">
              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" fullWidth>
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button variant="secondary" size="sm" fullWidth>
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
              </div>

              {/* Quick actions */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Create another motion</p>
                <div className="flex flex-wrap gap-2">
                  {MOTION_PRESETS.filter(p => p.value !== motionPreset).slice(0, 3).map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setMotionPreset(preset.value)
                        setVideoUrl(null)
                        reset()
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
