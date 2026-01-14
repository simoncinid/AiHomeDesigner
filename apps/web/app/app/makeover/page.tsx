'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Download, 
  Share2, 
  Video,
  ChevronDown,
  Wand2,
  RotateCcw,
  Check,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Dropzone } from '@/components/ui/Dropzone'
import { ImageCompareSlider } from '@/components/ui/ImageCompareSlider'
import { Progress, IndeterminateProgress } from '@/components/ui/Progress'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/lib/stores/auth'
import { useCreditsStore } from '@/lib/stores/credits'
import { useJobsStore } from '@/lib/stores/jobs'
import { apiClient } from '@/lib/api'
import { ROOM_TYPES, STYLE_PRESETS, EXAMPLE_PROMPTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function PhotoMakeoverPage() {
  // State
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [styleReference, setStyleReference] = useState<File | null>(null)
  const [styleReferencePreview, setStyleReferencePreview] = useState<string | null>(null)
  const [showStyleReference, setShowStyleReference] = useState(false)
  const [roomType, setRoomType] = useState('living_room')
  const [stylePreset, setStylePreset] = useState('modern')
  const [prompt, setPrompt] = useState('')
  const [keepLayout, setKeepLayout] = useState(true)
  const [keepItems, setKeepItems] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedOutput, setSelectedOutput] = useState(0)
  const [customEditPrompt, setCustomEditPrompt] = useState('')
  const [showCustomEdit, setShowCustomEdit] = useState(false)
  const [generatedImagesHistory, setGeneratedImagesHistory] = useState<string[][]>([]) // Stack di array di immagini generate

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
    isPolling,
    setPolling,
  } = useJobsStore()

  // Handlers
  const handleImageSelect = useCallback((file: File) => {
    setImage(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [])

  const handleStyleReferenceSelect = useCallback((file: File) => {
    setStyleReference(file)
    const url = URL.createObjectURL(file)
    setStyleReferencePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [])

  const clearImage = useCallback(() => {
    setImage(null)
    setImagePreview(null)
    reset()
  }, [reset])

  const clearStyleReference = useCallback(() => {
    setStyleReference(null)
    setStyleReferencePreview(null)
  }, [])

  const canGenerate = image && (freeQuotaRemaining > 0 || photoCredits > 0)
  const isGenerating = currentJobStatus === 'processing' || currentJobStatus === 'uploading'
  const isFree = freeQuotaRemaining > 0

  const handleGenerate = async () => {
    if (!image || isGenerating) return

    try {
      // Prepare form data
      const formData = new FormData()
      formData.append('base_image', image)
      formData.append('room_type', roomType)
      formData.append('style_preset', stylePreset)
      if (prompt) formData.append('user_prompt', prompt)
      if (styleReference) formData.append('style_ref', styleReference)
      // Build edit_intent from keep_layout and keep_items
      if (keepLayout || keepItems) {
        const intentParts = []
        if (keepLayout) intentParts.push('keep layout')
        if (keepItems) intentParts.push('keep furniture')
        if (intentParts.length > 0) {
          formData.append('edit_intent', intentParts.join(', '))
        }
      }

      // Start job
      startJob('temp', 'edit')
      
      // Create job
      const job = await apiClient.createEditJob(formData)
      startJob(job.id, 'edit')

      // Poll for results
      setPolling(true)
      let attempts = 0
      const maxAttempts = 120 // 4 minutes max (120 * 2s = 240s)

      const poll = async () => {
        attempts++
        console.log(`[POLL] Attempt ${attempts}/${maxAttempts} for job ${job.id}`)
        
        try {
          const result = await apiClient.getJob(job.id)
          console.log(`[POLL] Job ${job.id} status:`, result.status, 'has outputs:', !!result.outputUrls, 'outputs count:', result.outputUrls?.length || 0)
          
          if (result.status === 'completed' && result.outputUrls && result.outputUrls.length > 0) {
            console.log(`[POLL] ✅ Job completed! Outputs:`, result.outputUrls)
            setOutputs(result.outputUrls)
            // Add to history stack
            setGeneratedImagesHistory(prev => [...prev, result.outputUrls || []])
            setPolling(false)
            
            // Decrement credits
            if (isFree) {
              decrementFreeQuota()
            } else {
              decrementPhotoCredits()
            }
            
            toast({ type: 'success', title: 'Design generated!', message: 'Your room makeover is ready' })
          } else if (result.status === 'failed') {
            console.log(`[POLL] ❌ Job failed:`, result.error)
            setError(result.error || 'Generation failed')
            setPolling(false)
            toast({ type: 'error', title: 'Generation failed', message: result.error })
          } else if (attempts < maxAttempts) {
            console.log(`[POLL] ⏳ Still processing, will retry in 2s...`)
            setTimeout(poll, 2000)
          } else {
            console.log(`[POLL] ⏱️ Timeout after ${maxAttempts} attempts`)
            setError('Generation timed out. Please check back later or try again.')
            setPolling(false)
            toast({ type: 'error', title: 'Timeout', message: 'Generation is taking longer than expected. Check back later.' })
          }
        } catch (e: any) {
          console.error(`[POLL] Error checking job status:`, e)
          if (attempts < maxAttempts) {
            console.log(`[POLL] Retrying after error...`)
            setTimeout(poll, 2000)
          } else {
            setError('Failed to check status')
            setPolling(false)
            toast({ type: 'error', title: 'Error', message: 'Failed to check generation status' })
          }
        }
      }

      poll()
    } catch (error: any) {
      setError(error.detail || 'Failed to start generation')
      toast({ type: 'error', title: 'Error', message: error.detail || 'Failed to start generation' })
    }
  }

  // Convert image URL to File for FormData
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type || 'image/jpeg' })
  }

  const handleEditFromGenerated = async (editPrompt: string, sourceImageUrl: string) => {
    if (!sourceImageUrl || isGenerating) return

    try {
      console.log(`[EDIT] Starting edit from generated image with prompt: ${editPrompt}`)
      
      // Convert the generated image URL to a File
      const imageFile = await urlToFile(sourceImageUrl, 'generated-image.jpg')
      
      // Prepare form data
      const formData = new FormData()
      formData.append('base_image', imageFile)
      formData.append('room_type', roomType)
      formData.append('style_preset', stylePreset)
      formData.append('user_prompt', editPrompt)
      if (styleReference) formData.append('style_ref', styleReference)
      
      // Start job
      startJob('temp', 'edit')
      
      // Create job
      const job = await apiClient.createEditJob(formData)
      startJob(job.id, 'edit')

      // Poll for results
      setPolling(true)
      let attempts = 0
      const maxAttempts = 120

      const poll = async () => {
        attempts++
        console.log(`[POLL EDIT] Attempt ${attempts}/${maxAttempts} for job ${job.id}`)
        
        try {
          const result = await apiClient.getJob(job.id)
          console.log(`[POLL EDIT] Job ${job.id} status:`, result.status, 'has outputs:', !!result.outputUrls)
          
          if (result.status === 'completed' && result.outputUrls && result.outputUrls.length > 0) {
            console.log(`[POLL EDIT] ✅ Edit completed! Outputs:`, result.outputUrls)
            setOutputs(result.outputUrls)
            // Add to history stack
            setGeneratedImagesHistory(prev => [...prev, result.outputUrls || []])
            setSelectedOutput(0)
            setPolling(false)
            
            // Decrement credits
            if (isFree) {
              decrementFreeQuota()
            } else {
              decrementPhotoCredits()
            }
            
            toast({ type: 'success', title: 'Edit completed!', message: 'Your edited design is ready' })
          } else if (result.status === 'failed') {
            console.log(`[POLL EDIT] ❌ Edit failed:`, result.error)
            setError(result.error || 'Edit failed')
            setPolling(false)
            toast({ type: 'error', title: 'Edit failed', message: result.error })
          } else if (attempts < maxAttempts) {
            setTimeout(poll, 2000)
          } else {
            setError('Edit timed out')
            setPolling(false)
            toast({ type: 'error', title: 'Timeout', message: 'Edit is taking longer than expected' })
          }
        } catch (e: any) {
          console.error(`[POLL EDIT] Error:`, e)
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000)
          } else {
            setError('Failed to check edit status')
            setPolling(false)
            toast({ type: 'error', title: 'Error', message: 'Failed to check edit status' })
          }
        }
      }

      poll()
    } catch (error: any) {
      setError(error.detail || 'Failed to start edit')
      toast({ type: 'error', title: 'Error', message: error.detail || 'Failed to start edit' })
    }
  }

  const handleQuickEdit = async (editPrompt: string) => {
    if (!currentOutputs[selectedOutput]) {
      toast({ type: 'error', title: 'No image', message: 'Please generate an image first' })
      return
    }
    
    const sourceImage = currentOutputs[selectedOutput]
    await handleEditFromGenerated(editPrompt, sourceImage)
  }

  const handleCustomEdit = async () => {
    if (!customEditPrompt.trim()) {
      toast({ type: 'error', title: 'Empty prompt', message: 'Please enter a custom edit prompt' })
      return
    }
    
    if (!currentOutputs[selectedOutput]) {
      toast({ type: 'error', title: 'No image', message: 'Please generate an image first' })
      return
    }
    
    const sourceImage = currentOutputs[selectedOutput]
    setShowCustomEdit(false)
    setCustomEditPrompt('')
    await handleEditFromGenerated(customEditPrompt.trim(), sourceImage)
  }

  return (
    <div className="h-full">
      <div className="grid lg:grid-cols-2 gap-6 h-full">
        {/* Left panel - Inputs */}
        <div className="space-y-6 overflow-y-auto pb-6">
          {/* Header */}
          <div>
            <h1 className="heading-3 text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              Photo Makeover
            </h1>
            <p className="text-foreground-muted mt-2">
              Transform your room photo into a stunning redesign
            </p>
          </div>

          {/* Image upload */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              1. Upload your room photo
            </label>
            <Dropzone
              onFileSelect={handleImageSelect}
              currentFile={image}
              currentPreview={imagePreview}
              onClear={clearImage}
              label="Drop your room photo here"
            />
          </Card>

          {/* Style reference toggle */}
          <Card padding="lg">
            <Toggle
              checked={showStyleReference}
              onChange={setShowStyleReference}
              label="Add style reference image"
              description="Upload an image to guide the style"
            />
            
            <AnimatePresence>
              {showStyleReference && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <Dropzone
                    onFileSelect={handleStyleReferenceSelect}
                    currentFile={styleReference}
                    currentPreview={styleReferencePreview}
                    onClear={clearStyleReference}
                    label="Style reference"
                    hint="Optional: guide the design style"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Room type and style */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              2. Room type
            </label>
            <Select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              options={ROOM_TYPES.map(r => ({ value: r.value, label: r.label }))}
            />
          </Card>

          {/* Style presets */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              3. Choose style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLE_PRESETS.map((style) => (
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
                  <p className="text-xs text-foreground-muted line-clamp-1">{style.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Prompt input */}
          <Card padding="lg">
            <label className="text-sm font-medium text-foreground mb-3 block">
              4. Custom instructions (optional)
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Add plants, warm lighting, cozy atmosphere..."
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {EXAMPLE_PROMPTS.slice(0, 4).map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>

          {/* Advanced options */}
          <Card padding="lg">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-sm font-medium text-foreground">Advanced options</span>
              <ChevronDown className={cn(
                'h-5 w-5 text-foreground-muted transition-transform',
                showAdvanced && 'rotate-180'
              )} />
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  <Toggle
                    checked={keepLayout}
                    onChange={setKeepLayout}
                    label="Keep room layout"
                    description="Preserve the general arrangement"
                  />
                  <Toggle
                    checked={keepItems}
                    onChange={setKeepItems}
                    label="Keep key items"
                    description="Preserve main furniture pieces"
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
                  <Sparkles className="h-5 w-5" />
                  Generate design
                </>
              )}
            </Button>
            <p className="text-center text-sm text-foreground-muted mt-2">
              {isFree ? (
                <span className="text-success">Free today!</span>
              ) : (
                <span>Uses 1 photo credit</span>
              )}
              {!isAuthenticated && (
                <span className="text-warning"> • Sign in to save</span>
              )}
            </p>
          </div>
        </div>

        {/* Right panel - Results */}
        <div className="bg-surface rounded-2xl border border-border p-6 flex flex-col min-w-0">
          <h2 className="text-lg font-semibold text-foreground mb-4">Results</h2>

          {/* Loading state */}
          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                  Creating your design...
                </h3>
                <p className="text-sm text-foreground-muted text-center mb-6">
                  This usually takes 10-30 seconds
                </p>
                <IndeterminateProgress />
              </div>
            </div>
          )}

          {/* Error state */}
          {currentError && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">😕</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Something went wrong
                </h3>
                <p className="text-sm text-foreground-muted mb-6">{currentError}</p>
                <Button variant="secondary" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </Button>
              </div>
            </div>
          )}

          {/* Success state */}
          {currentOutputs.length > 0 && !isGenerating && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Main output */}
              <div className="mb-4 w-full">
                {imagePreview && currentOutputs[selectedOutput] && (
                  <ImageCompareSlider
                    beforeImage={imagePreview}
                    afterImage={currentOutputs[selectedOutput]}
                    className="w-full"
                    aspectRatio="video"
                  />
                )}
              </div>

              {/* Output thumbnails */}
              {currentOutputs.length > 1 && (
                <div className="flex gap-2 mb-4">
                  {currentOutputs.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOutput(index)}
                      className={cn(
                        'relative h-16 w-24 rounded-lg overflow-hidden transition-all',
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
              <div className="flex gap-2 mb-4">
                <Button variant="secondary" size="sm" fullWidth>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="secondary" size="sm" fullWidth>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="secondary" size="sm" fullWidth asChild>
                  <a href="/app/photo-to-video">
                    <Video className="h-4 w-4" />
                    Make video
                  </a>
                </Button>
              </div>

              {/* Quick edits */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Quick edits</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Add plants', 'More lighting', 'Warmer colors'].map((edit) => (
                    <button
                      key={edit}
                      onClick={() => handleQuickEdit(edit)}
                      disabled={isGenerating}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wand2 className="h-3 w-3" />
                      {edit}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomEdit(!showCustomEdit)}
                    disabled={isGenerating}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed",
                      showCustomEdit 
                        ? "bg-primary-500 text-white hover:bg-primary-600" 
                        : "bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary"
                    )}
                  >
                    <Wand2 className="h-3 w-3" />
                    Custom edit
                  </button>
                </div>
                
                {/* Custom edit input */}
                <AnimatePresence>
                  {showCustomEdit && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2">
                        <Input
                          value={customEditPrompt}
                          onChange={(e) => setCustomEditPrompt(e.target.value)}
                          placeholder="E.g., Add a modern chandelier, change wall color to blue..."
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleCustomEdit()
                            }
                          }}
                        />
                        <Button
                          onClick={handleCustomEdit}
                          disabled={!customEditPrompt.trim() || isGenerating}
                          size="sm"
                        >
                          <Check className="h-4 w-4" />
                          Apply
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isGenerating && !currentError && currentOutputs.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-surface-secondary flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-foreground-muted" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your design will appear here
              </h3>
              <p className="text-sm text-foreground-muted max-w-xs">
                Upload a photo and click generate to see your room transformation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
