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
    <div className="h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden flex flex-col pt-16">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-3 w-full">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* LEFT COLUMN - Upload & Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Upload Image */}
              {imageUrl ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
                    Selected Image
                  </label>
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 border-2 border-emerald-300 shadow-md">
                    <img src={imageUrl} alt="Selected" className="w-full h-auto max-h-40 object-contain" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                      Ready
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Upload Image
                  </label>
                  <div
                    {...getRootProps()}
                    className={`
                      relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
                      transition-all duration-200 ease-out
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
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="max-h-28 mx-auto rounded-lg shadow-md"
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
                      <div className="py-3">
                        <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 font-medium text-sm mb-1">Click to upload or drag and drop</p>
                        <p className="text-gray-400 text-xs">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Motion Preset */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Camera Motion
                </label>
                <div className="relative">
                  <select
                    value={motionPreset}
                    onChange={(e) => setMotionPreset(e.target.value)}
                    className="
                      w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                      transition-all duration-200
                    "
                  >
                    {MOTION_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Video Duration
                </label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
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
                  <span className="text-sm font-bold text-gray-900 w-10 text-center bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-200">{duration}s</span>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Video Resolution
                </label>
                <div className="relative">
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="
                      w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                      transition-all duration-200
                    "
                  >
                    {VIDEO_RESOLUTIONS.map((res) => (
                      <option key={res} value={res}>
                        {res}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Custom Prompt
                  <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Leave empty to use default motion..."
                  rows={3}
                  maxLength={600}
                  className="
                    w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                    text-sm placeholder:text-gray-400 resize-none
                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                    transition-all duration-200
                  "
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{prompt.length}/600</p>
              </div>

            </div>

            {/* Generate Button - Fixed at bottom */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleSubmit}
                disabled={(!image && !imageUrl) || loading}
                className="
                  w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                  text-white font-semibold text-sm
                  bg-gradient-to-r from-sky-500 to-blue-600
                  hover:from-sky-600 hover:to-blue-700
                  disabled:from-gray-300 disabled:to-gray-300
                  disabled:cursor-not-allowed
                  shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40
                  disabled:shadow-none
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                "
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

              <p className="text-center text-gray-400 text-xs mt-3">
                1 credit • <Link href="/pricing" className="text-sky-500 hover:text-sky-600 font-semibold transition-colors">Buy Credits</Link>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Preview Area */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Preview Header */}
            <div className="border-b border-gray-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50">
              {(image || imageUrl) ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="relative max-w-full max-h-[50vh]">
                    <img
                      src={image ? URL.createObjectURL(image) : imageUrl!}
                      alt="Your image"
                      className="max-w-full max-h-[50vh] rounded-xl shadow-lg object-contain"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-900 font-semibold text-sm">Ready to animate!</p>
                    <p className="text-gray-400 text-xs mt-0.5">Click "Generate Video" to bring it to life</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
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
