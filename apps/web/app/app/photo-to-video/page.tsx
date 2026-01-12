'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { apiClient } from '@/lib/api'
import { MOTION_PRESETS, VIDEO_RESOLUTIONS } from '@/lib/shared'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'

export default function PhotoToVideoPage() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('image')

  const [image, setImage] = useState<File | null>(null)
  const [motionPreset, setMotionPreset] = useState('dolly-in')
  const [duration, setDuration] = useState(5)
  const [resolution, setResolution] = useState('720p')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please sign in to create videos')
      window.location.href = '/login'
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) setImage(files[0])
    },
  })

  const handleSubmit = async () => {
    if (!image && !imageUrl) {
      alert('Please upload an image or provide an image URL')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      if (image) {
        formData.append('image', image)
      } else if (imageUrl) {
        formData.append('image_url', imageUrl)
      }
      formData.append('motion_preset', motionPreset)
      if (prompt) {
        formData.append('prompt', prompt)
      }
      formData.append('duration', duration.toString())
      formData.append('resolution', resolution)

      const response = await apiClient.createI2VJob(formData)
      window.location.href = `/app/job/${response.data.id}`
    } catch (error: any) {
      console.error('Error:', error)
      if (error.response?.status === 401) {
        alert('Please sign in to create videos')
        window.location.href = '/login'
      } else if (error.response?.status === 402) {
        alert('Insufficient video credits. Please purchase credits.')
        window.location.href = '/pricing'
      } else {
        alert('Failed to create job. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Photo to Video</h1>
          <p className="text-dark-400 text-lg">Transform your designs into cinematic videos</p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Image Upload or URL */}
          {imageUrl ? (
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">
                Selected Image
              </label>
              <div className="rounded-xl overflow-hidden bg-dark-800/50 border border-dark-700">
                <img src={imageUrl} alt="Selected" className="w-full h-auto" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">
                Upload Image <span className="text-brand-400">*</span>
              </label>
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-brand-500 bg-brand-500/10' 
                    : 'border-dark-600 hover:border-dark-500 hover:bg-dark-800/30'
                }`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div className="space-y-3">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-soft"
                    />
                    <p className="text-sm text-dark-300 font-medium">{image.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setImage(null) }}
                      className="text-sm text-dark-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800 flex items-center justify-center">
                      <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-dark-200 font-medium mb-1">Drag & drop or click to upload</p>
                    <p className="text-sm text-dark-500">JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Motion Preset */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Motion Preset <span className="text-brand-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOTION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setMotionPreset(preset.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    motionPreset === preset.value
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                      : 'bg-dark-800/50 border-dark-700 text-dark-300 hover:border-dark-600 hover:bg-dark-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Duration <span className="text-dark-500">(seconds)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="20"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <span className="text-white font-medium w-12 text-center">{duration}s</span>
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Resolution
            </label>
            <div className="flex gap-2">
              {VIDEO_RESOLUTIONS.map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    resolution === res
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                      : 'bg-dark-800/50 border-dark-700 text-dark-300 hover:border-dark-600 hover:bg-dark-800'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt (Optional) */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Custom Prompt <span className="text-dark-500">(Optional)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Leave empty to use default motion prompt"
              className="input resize-none h-24"
              maxLength={600}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={(!image && !imageUrl) || loading}
              className="btn-primary w-full text-lg py-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Video...
                </span>
              ) : (
                'Generate Video (1 Credit)'
              )}
            </button>

            <p className="text-sm text-dark-500 text-center">
              Video generation requires credits.{' '}
              <Link href="/pricing" className="text-brand-400 hover:text-brand-300 font-medium">
                Purchase credits
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
