'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { apiClient, ApiError } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { ROOM_TYPES, STYLE_PRESETS, QUICK_EDITS } from '@/lib/shared'
import Link from 'next/link'

export default function PhotoMakeoverPage() {
  const [baseImage, setBaseImage] = useState<File | null>(null)
  const [styleRef, setStyleRef] = useState<File | null>(null)
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [editIntent, setEditIntent] = useState('')
  const [userPrompt, setUserPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'template' | 'custom'>('template')

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
      if (editIntent) {
        formData.append('edit_intent', editIntent)
      }
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
    <div className="min-h-screen bg-gray-50 pt-[4.5rem]">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Two Column Layout - Perfectly Symmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN - All Controls */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              
              {/* ─────────────────────────────────────────────────────────────── */}
              {/* Section 1: Upload Image */}
              {/* ─────────────────────────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Upload Image
                </label>
                <div
                  {...getBaseRootProps()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-200 ease-out
                    ${isBaseDragActive 
                      ? 'border-rose-400 bg-rose-50' 
                      : baseImage
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <input {...getBaseInputProps()} />
                  {baseImage ? (
                    <div className="space-y-3">
                      <img
                        src={URL.createObjectURL(baseImage)}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600 font-medium">{baseImage.name}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setBaseImage(null) }}
                        className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* Section 2: Template / Custom Toggle */}
              {/* ─────────────────────────────────────────────────────────────── */}
              <div>
                <div className="flex rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setActiveTab('template')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold
                      transition-all duration-200
                      ${activeTab === 'template'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Template
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold
                      transition-all duration-200
                      ${activeTab === 'custom'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Custom
                  </button>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* Section 3: Room Type */}
              {/* ─────────────────────────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Room Type
                </label>
                <div className="relative">
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="
                      w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400
                      transition-all duration-200
                    "
                  >
                    {ROOM_TYPES.map((room) => (
                      <option key={room} value={room}>
                        {room.charAt(0).toUpperCase() + room.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* Section 4: Design Style */}
              {/* ─────────────────────────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Design Style
                </label>
                <div className="relative">
                  <select
                    value={stylePreset}
                    onChange={(e) => setStylePreset(e.target.value)}
                    className="
                      w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400
                      transition-all duration-200
                    "
                  >
                    {STYLE_PRESETS.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* Section 5: Additional Information */}
              {/* ─────────────────────────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Additional Information
                  <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., Add more natural light, change color scheme to warm tones, include modern furniture..."
                  rows={4}
                  maxLength={600}
                  className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900
                    text-sm placeholder:text-gray-400 resize-none
                    focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400
                    transition-all duration-200
                  "
                />
              </div>

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* Section 6: Generate Button */}
              {/* ─────────────────────────────────────────────────────────────── */}
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!baseImage || loading}
                  className="
                    w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl
                    text-white font-semibold text-base
                    bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500
                    hover:from-rose-500 hover:via-rose-600 hover:to-pink-600
                    disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300
                    disabled:cursor-not-allowed
                    shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40
                    disabled:shadow-none
                    transform hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-200
                  "
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Generate Design
                    </>
                  )}
                </button>

                {/* Credits Info */}
                {!isLoggedIn && (
                  <p className="text-center text-gray-400 text-sm mt-4">
                    Free: 1 generation/day • <Link href="/pricing" className="text-rose-500 hover:text-rose-600 font-semibold transition-colors">Upgrade to Pro</Link>
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN - Preview Area */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Preview / History Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button className="flex-1 px-6 py-4 text-sm font-semibold text-gray-900 border-b-2 border-rose-500 bg-white">
                  Preview
                </button>
                <button className="flex-1 px-6 py-4 text-sm font-semibold text-gray-400 hover:text-gray-600 border-b-2 border-transparent transition-colors">
                  History
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-8 min-h-[500px] bg-gray-50/50">
              {baseImage ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                  {/* Preview Image */}
                  <div className="relative max-w-full max-h-[400px]">
                    <img
                      src={URL.createObjectURL(baseImage)}
                      alt="Your room"
                      className="max-w-full max-h-[400px] rounded-xl shadow-lg object-contain"
                    />
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Ready State */}
                  <div className="text-center">
                    <p className="text-gray-900 font-semibold">Ready to transform!</p>
                    <p className="text-gray-400 text-sm mt-1">Click "Generate Design" to see the magic</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {/* Placeholder Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">Your AI-generated design will appear here</p>
                  <p className="text-gray-400 text-sm">Upload an image to get started</p>
                </div>
              )}
            </div>

            {/* Style Reference Section - Bottom of Preview */}
            <div className="border-t border-gray-200 p-6 bg-white">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Style Reference
                <span className="text-gray-400 font-normal ml-2">(Optional)</span>
              </label>
              <div
                {...getStyleRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
                  transition-all duration-200
                  ${isStyleDragActive 
                    ? 'border-rose-400 bg-rose-50' 
                    : styleRef
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <input {...getStyleInputProps()} />
                {styleRef ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={URL.createObjectURL(styleRef)}
                      alt="Style preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm text-gray-700 font-medium truncate">{styleRef.name}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setStyleRef(null) }}
                        className="text-xs text-rose-500 hover:text-rose-600 font-medium mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 py-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500">Add a style reference image</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
