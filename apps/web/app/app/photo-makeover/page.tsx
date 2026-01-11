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
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-navy-900 mb-3">Photo to Room Design</h1>
          <p className="text-navy-700 text-lg">Transform your room photos with AI-powered design</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          {/* Base Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Upload Room Photo *</label>
            <div
              {...getBaseRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200"
            >
              <input {...getBaseInputProps()} />
              {baseImage ? (
                <div>
                  <img
                    src={URL.createObjectURL(baseImage)}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <p className="mt-3 text-sm text-navy-700 font-medium">{baseImage.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-navy-700 font-medium mb-1">Drag & drop or click to select</p>
                  <p className="text-sm text-navy-500">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Style Reference (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Style Reference (Optional)</label>
            <div
              {...getStyleRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200"
            >
              <input {...getStyleInputProps()} />
              {styleRef ? (
                <div>
                  <img
                    src={URL.createObjectURL(styleRef)}
                    alt="Style preview"
                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <p className="mt-3 text-sm text-navy-700 font-medium">{styleRef.name}</p>
                </div>
              ) : (
                <p className="text-navy-700">Upload a reference image for style matching</p>
              )}
            </div>
          </div>

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

          {/* Quick Edit Intent (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Quick Edit (Optional)</label>
            <select
              value={editIntent}
              onChange={(e) => setEditIntent(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {loading ? 'Generating...' : 'Generate Design (4 Variations)'}
          </button>

          <p className="text-sm text-navy-600 text-center">
            Free tier: 1 image per day. <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold underline">Upgrade</Link> for 4 variations.
          </p>
        </div>
      </div>
    </div>
  )
}
