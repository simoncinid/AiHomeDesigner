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
    <div className="h-[calc(100vh-5rem)] flex flex-col py-4 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[90vw] flex flex-col h-full">
        {/* Header - compact */}
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Room Generator</h1>
          <p className="text-slate-500 text-sm">Generate room designs from text descriptions</p>
        </div>

        <div className="card p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Type <span className="text-brand-500">*</span>
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="select"
                >
                  {ROOM_TYPES.map((room) => (
                    <option key={room} value={room}>
                      {room.charAt(0).toUpperCase() + room.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Style Preset */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Style Preset <span className="text-brand-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style}
                      onClick={() => setStylePreset(style)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                        stylePreset === style
                          ? 'bg-brand-50 border-brand-200 text-brand-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="select"
                >
                  {IMAGE_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              {/* User Prompt */}
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Prompt <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Describe your ideal room: e.g., 'with a large window overlooking a garden, minimalist furniture, warm lighting, velvet sofa, marble coffee table...'"
                  className="input resize-none flex-1 min-h-[120px]"
                  maxLength={600}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{userPrompt.length}/600</p>
              </div>
            </div>
          </div>

          {/* Submit - bottom */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full sm:w-auto sm:flex-1 text-base py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Room Design (1 Image)'
                )}
              </button>
              {!isLoggedIn && (
                <p className="text-sm text-slate-400 text-center sm:text-left">
                  Free tier: 1 image/day.{' '}
                  <Link href="/pricing" className="text-brand-600 hover:text-brand-700 font-medium">
                    Upgrade
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
