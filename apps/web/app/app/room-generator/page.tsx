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
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-navy-900 mb-3">Room Design Generator</h1>
          <p className="text-navy-700 text-lg">Generate room designs from text descriptions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Room Type *</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-semibold text-navy-900 mb-3">Style Preset *</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style}
                  onClick={() => setStylePreset(style)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                    stylePreset === style
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 text-navy-900'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* User Prompt */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Additional Details (Optional)</label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="E.g., 'with a large window overlooking a garden, minimalist furniture'"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={600}
            />
            <p className="text-sm text-navy-500 mt-2">{userPrompt.length}/600 characters</p>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Image Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {IMAGE_SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {loading ? 'Generating...' : 'Generate Room Design (2 Images)'}
          </button>

          <p className="text-sm text-navy-600 text-center">
            Free tier: 1 image per day. <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold underline">Upgrade</Link> for 2 images.
          </p>
        </div>
      </div>
    </div>
  )
}
