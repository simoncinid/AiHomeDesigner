'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { apiClient, ApiError } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/shared'
import Link from 'next/link'

export default function PhotoMakeoverPage() {
  const [baseImage, setBaseImage] = useState<File | null>(null)
  const [styleRef, setStyleRef] = useState<File | null>(null)
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [userPrompt, setUserPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsLoggedIn(!!token)
  }, [])

  const { getRootProps: getBaseRootProps, getInputProps: getBaseInputProps, isDragActive: isBaseDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) setBaseImage(files[0])
    },
  })

  const { getRootProps: getStyleRootProps, getInputProps: getStyleInputProps, isDragActive: isStyleDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) setStyleRef(files[0])
    },
  })

  const handleSubmit = async () => {
    if (!baseImage) {
      alert('Please upload a base image')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('base_image', baseImage)
      if (styleRef) {
        formData.append('style_ref', styleRef)
      }
      formData.append('room_type', roomType)
      formData.append('style_preset', stylePreset)
      if (userPrompt) {
        formData.append('user_prompt', userPrompt)
      }
      formData.append('size', '2048*2048')

      const job = await apiClient.createEditJob(formData)
      window.location.href = `/app/job/${job.id}`
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof ApiError && error.status === 402) {
        alert('Free quota exhausted. Please purchase credits to continue.')
        window.location.href = '/pricing'
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
          
          {/* LEFT COLUMN - Controls */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Upload Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Upload Image
                </label>
                <div
                  {...getBaseRootProps()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
                    transition-all duration-200 ease-out
                    ${isBaseDragActive 
                      ? 'border-sky-400 bg-sky-50' 
                      : baseImage
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-gray-300 hover:border-sky-400 hover:bg-sky-50/30'
                    }
                  `}
                >
                  <input {...getBaseInputProps()} />
                  {baseImage ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(baseImage)}
                        alt="Preview"
                        className="max-h-28 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-xs text-gray-600 font-medium truncate">{baseImage.name}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setBaseImage(null) }}
                        className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="py-3">
                      <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium text-sm mb-1">Click to upload or drag and drop</p>
                      <p className="text-gray-400 text-xs">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Room Type
                </label>
                <div className="relative">
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="
                      w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                      transition-all duration-200
                    "
                  >
                    {ROOM_TYPES.map((room) => (
                      <option key={room} value={room}>
                        {room.charAt(0).toUpperCase() + room.slice(1)}
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

              {/* Design Style */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Design Style
                </label>
                <div className="relative">
                  <select
                    value={stylePreset}
                    onChange={(e) => setStylePreset(e.target.value)}
                    className="
                      w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                      transition-all duration-200
                    "
                  >
                    {STYLE_PRESETS.map((style) => (
                      <option key={style} value={style}>
                        {style}
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

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Information
                  <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., Add more natural light, change color scheme to warm tones..."
                  rows={3}
                  maxLength={600}
                  className="
                    w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                    text-sm placeholder:text-gray-400 resize-none
                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                    transition-all duration-200
                  "
                />
              </div>

              {/* Style Reference */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Style Reference
                  <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <div
                  {...getStyleRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl p-3 text-center cursor-pointer
                    transition-all duration-200
                    ${isStyleDragActive 
                      ? 'border-sky-400 bg-sky-50' 
                      : styleRef
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50/30'
                    }
                  `}
                >
                  <input {...getStyleInputProps()} />
                  {styleRef ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={URL.createObjectURL(styleRef)}
                        alt="Style preview"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-xs text-gray-700 font-medium truncate">{styleRef.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setStyleRef(null) }}
                          className="text-xs text-red-500 hover:text-red-600 font-medium mt-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-500">Add a style reference image</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Generate Button - Fixed at bottom */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleSubmit}
                disabled={!baseImage || loading}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Generate Design
                  </>
                )}
              </button>

              {!isLoggedIn && (
                <p className="text-center text-gray-400 text-xs mt-3">
                  Free: 1 generation/day • <Link href="/pricing" className="text-sky-500 hover:text-sky-600 font-semibold transition-colors">Upgrade to Pro</Link>
                </p>
              )}
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
              {baseImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="relative max-w-full max-h-[50vh]">
                    <img
                      src={URL.createObjectURL(baseImage)}
                      alt="Your room"
                      className="max-w-full max-h-[50vh] rounded-xl shadow-lg object-contain"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-900 font-semibold text-sm">Ready to transform!</p>
                    <p className="text-gray-400 text-xs mt-0.5">Click "Generate Design" to see the magic</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm mb-1">Your AI-generated design will appear here</p>
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
