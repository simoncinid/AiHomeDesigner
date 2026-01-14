'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { apiClient, ApiError } from '@/lib/api'
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

      const job = await apiClient.createI2VJob(formData)
      window.location.href = `/app/job/${job.id}`
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof ApiError) {
        if (error.status === 401) {
          alert('Please sign in to create videos')
          window.location.href = '/login'
        } else if (error.status === 402) {
          alert('Insufficient video credits. Please purchase credits.')
          window.location.href = '/pricing'
        } else {
          alert(error.detail || 'Failed to create job. Please try again.')
        }
      } else {
        alert('Failed to create job. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden flex flex-col pt-14">
      <div className="flex-1 max-w-7xl mx-auto px-3 py-1 w-full min-h-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          
          {/* LEFT COLUMN - Upload & Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              
              {/* Upload Image */}
              {imageUrl ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                    Selected Image
                  </label>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-emerald-300 shadow-md">
                    <img src={imageUrl} alt="Selected" className="w-full h-auto max-h-32 object-contain" />
                    <div className="absolute top-1 right-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                      Ready
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Upload Image
                  </label>
                  <div
                    {...getRootProps()}
                    className={`
                      relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ease-out
                      ${isDragActive 
                        ? 'border-sky-400 bg-sky-50' 
                        : image
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : 'border-gray-300 hover:border-sky-400 hover:bg-sky-50/30'
                      }
                    `}
                  >
                    <input {...getInputProps()} />
                    {image ? (
                      <div className="space-y-1.5">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="max-h-20 mx-auto rounded-lg shadow-md"
                        />
                        <p className="text-xs text-gray-600 font-medium truncate">{image.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setImage(null) }}
                          className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 font-medium text-sm">Click to upload or drag and drop</p>
                        <p className="text-gray-400 text-xs">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Motion & Resolution - Inline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Camera Motion
                  </label>
                  <div className="relative">
                    <select
                      value={motionPreset}
                      onChange={(e) => setMotionPreset(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
                    >
                      {MOTION_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Resolution
                  </label>
                  <div className="relative">
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
                    >
                      {VIDEO_RESOLUTIONS.map((res) => (
                        <option key={res} value={res}>
                          {res}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Duration
                </label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    style={{
                      background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(37 99 235) ${((duration - 5) / 15) * 100}%, rgb(229 231 235) ${((duration - 5) / 15) * 100}%, rgb(229 231 235) 100%)`
                    }}
                  />
                  <span className="text-sm font-bold text-gray-900 w-10 text-center bg-white rounded px-2 py-1 shadow-sm border border-gray-200">{duration}s</span>
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Custom Prompt <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Leave empty to use default motion..."
                  rows={2}
                  maxLength={600}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
                />
              </div>

            </div>

            {/* Generate Button - Fixed at bottom */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleSubmit}
                disabled={(!image && !imageUrl) || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 disabled:shadow-none transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate Video
                  </>
                )}
              </button>

              <p className="text-center text-gray-400 text-xs mt-2">
                1 credit • <Link href="/pricing" className="text-sky-500 hover:text-sky-600 font-semibold">Buy Credits</Link>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Preview Area */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
            
            {/* Preview Header */}
            <div className="border-b border-gray-100 px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50/50 min-h-0">
              {(image || imageUrl) ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                  <div className="relative max-w-full max-h-[45vh]">
                    <img
                      src={image ? URL.createObjectURL(image) : imageUrl!}
                      alt="Your image"
                      className="max-w-full max-h-[45vh] rounded-lg shadow-lg object-contain"
                    />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-900 font-semibold text-sm">Ready to animate!</p>
                    <p className="text-gray-400 text-xs">Click "Generate Video" to bring it to life</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm mb-1">Your video preview will appear here</p>
                  <p className="text-gray-400 text-xs">Upload an image to get started</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
