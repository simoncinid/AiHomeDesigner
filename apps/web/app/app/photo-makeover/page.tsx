'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { apiClient } from '@/lib/api'
import { ROOM_TYPES, STYLE_PRESETS, QUICK_EDITS } from '@/lib/shared'
import Link from 'next/link'

export default function PhotoMakeoverPage() {
  const [baseImage, setBaseImage] = useState<File | null>(null)
  const [styleRef, setStyleRef] = useState<File | null>(null)
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [editIntent, setEditIntent] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)

  const { getRootProps: getBaseRootProps, getInputProps: getBaseInputProps } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) setBaseImage(files[0])
    },
  })

  const { getRootProps: getStyleRootProps, getInputProps: getStyleInputProps } = useDropzone({
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
      formData.append('size', '2048*2048')

      const response = await apiClient.createEditJob(formData)
      setJobId(response.data.id)
      // Redirect to job status page
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
      <h1 className="text-3xl font-bold mb-8">Photo to Room Design</h1>

      <div className="space-y-6">
        {/* Base Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Room Photo *</label>
          <div
            {...getBaseRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition"
          >
            <input {...getBaseInputProps()} />
            {baseImage ? (
              <div>
                <img
                  src={URL.createObjectURL(baseImage)}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded"
                />
                <p className="mt-2 text-sm text-gray-600">{baseImage.name}</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">Drag & drop or click to select</p>
                <p className="text-sm text-gray-400 mt-2">JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Style Reference (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">Style Reference (Optional)</label>
          <div
            {...getStyleRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition"
          >
            <input {...getStyleInputProps()} />
            {styleRef ? (
              <div>
                <img
                  src={URL.createObjectURL(styleRef)}
                  alt="Style preview"
                  className="max-h-64 mx-auto rounded"
                />
                <p className="mt-2 text-sm text-gray-600">{styleRef.name}</p>
              </div>
            ) : (
              <p className="text-gray-600">Upload a reference image for style matching</p>
            )}
          </div>
        </div>

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

        {/* Quick Edit Intent (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">Quick Edit (Optional)</label>
          <select
            value={editIntent}
            onChange={(e) => setEditIntent(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">None</option>
            {QUICK_EDITS.map((edit) => (
              <option key={edit} value={edit}>
                {edit}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!baseImage || loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Design (4 Variations)'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Free tier: 1 image per day. <Link href="/pricing" className="text-primary-600 underline">Upgrade</Link> for 4 variations.
        </p>
      </div>
    </div>
  )
}
