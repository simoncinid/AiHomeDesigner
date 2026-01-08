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
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Room Design Generator</h1>

      <div className="space-y-6">
        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Room Type *</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
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
          <label className="block text-sm font-medium mb-2">Style Preset *</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style}
                onClick={() => setStylePreset(style)}
                className={`px-4 py-2 rounded-lg border transition ${
                  stylePreset === style
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white border-gray-300 hover:border-primary-500'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* User Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">Additional Details (Optional)</label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="E.g., 'with a large window overlooking a garden, minimalist furniture'"
            className="w-full border rounded-lg px-4 py-2 h-24"
            maxLength={600}
          />
          <p className="text-sm text-gray-500 mt-1">{userPrompt.length}/600 characters</p>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Image Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
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
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Room Design (2 Images)'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Free tier: 1 image per day. <Link href="/pricing" className="text-primary-600 underline">Upgrade</Link> for 2 images.
        </p>
      </div>
    </div>
  )
}
