'use client'

import { useState, useEffect } from 'react'
import { apiClient, ApiError } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { ROOM_TYPES, STYLE_PRESETS, IMAGE_SIZES } from '@/lib/shared'
import Link from 'next/link'

export default function RoomGeneratorPage() {
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [userPrompt, setUserPrompt] = useState('')
  const [size, setSize] = useState('2048*2048')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsLoggedIn(!!token)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const job = await apiClient.createT2IJob({
        room_type: roomType,
        style_preset: stylePreset,
        user_prompt: userPrompt || undefined,
        size,
      })
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

              {/* Image Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Image Size
                </label>
                <div className="relative">
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="
                      w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                      text-sm font-medium appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                      transition-all duration-200
                    "
                  >
                    {IMAGE_SIZES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
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
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Describe Your Ideal Room
                  <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g., with a large window overlooking the garden, minimalist furniture, warm lighting..."
                  rows={4}
                  maxLength={600}
                  className="
                    flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900
                    text-sm placeholder:text-gray-400 resize-none
                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
                    transition-all duration-200
                  "
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{userPrompt.length}/600</p>
              </div>

            </div>

            {/* Generate Button - Fixed at bottom */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleSubmit}
                disabled={loading}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Room
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
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold text-sm mb-1">Your AI-generated room will appear here</p>
                <p className="text-gray-400 text-xs">Configure your preferences and click Generate</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
