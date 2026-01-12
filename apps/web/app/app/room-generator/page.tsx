'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { ROOM_TYPES, STYLE_PRESETS, IMAGE_SIZES } from '@/lib/shared'
import Link from 'next/link'

export default function RoomGeneratorPage() {
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [userPrompt, setUserPrompt] = useState('')
  const [size, setSize] = useState('2048*2048')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await apiClient.createT2IJob({
        room_type: roomType,
        style_preset: stylePreset,
        user_prompt: userPrompt || undefined,
        size,
      })
      window.location.href = `/app/job/${response.data.id}`
    } catch (error: any) {
      console.error('Error:', error)
      if (error.response?.status === 402) {
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
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Room Generator</h1>
          <p className="text-dark-400 text-lg">Generate room designs from text descriptions</p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Room Type <span className="text-brand-400">*</span>
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
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Style Preset <span className="text-brand-400">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style}
                  onClick={() => setStylePreset(style)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    stylePreset === style
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                      : 'bg-dark-800/50 border-dark-700 text-dark-300 hover:border-dark-600 hover:bg-dark-800'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* User Prompt */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Additional Details <span className="text-dark-500">(Optional)</span>
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="E.g., 'with a large window overlooking a garden, minimalist furniture, warm lighting'"
              className="input resize-none h-28"
              maxLength={600}
            />
            <p className="text-sm text-dark-500 mt-2 text-right">{userPrompt.length}/600</p>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
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

          {/* Submit */}
          <div className="pt-4 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full text-lg py-4"
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
                'Generate Room Design (2 Images)'
              )}
            </button>

            <p className="text-sm text-dark-500 text-center">
              Free tier: 1 image per day.{' '}
              <Link href="/pricing" className="text-brand-400 hover:text-brand-300 font-medium">
                Upgrade
              </Link>{' '}
              for more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
