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
      formData.append('size', '2048*2048')

      const response = await apiClient.createEditJob(formData)
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Photo Makeover</h1>
          <p className="text-dark-400 text-lg">Transform your room photos with AI-powered design</p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Base Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Upload Room Photo <span className="text-brand-400">*</span>
            </label>
            <div
              {...getBaseRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isBaseDragActive 
                  ? 'border-brand-500 bg-brand-500/10' 
                  : 'border-dark-600 hover:border-dark-500 hover:bg-dark-800/30'
              }`}
            >
              <input {...getBaseInputProps()} />
              {baseImage ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(baseImage)}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-soft"
                  />
                  <p className="text-sm text-dark-300 font-medium">{baseImage.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setBaseImage(null) }}
                    className="text-sm text-dark-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-dark-200 font-medium mb-1">Drag & drop or click to upload</p>
                  <p className="text-sm text-dark-500">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Style Reference (Optional) */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Style Reference <span className="text-dark-500">(Optional)</span>
            </label>
            <div
              {...getStyleRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                isStyleDragActive 
                  ? 'border-brand-500 bg-brand-500/10' 
                  : 'border-dark-700 hover:border-dark-600 hover:bg-dark-800/30'
              }`}
            >
              <input {...getStyleInputProps()} />
              {styleRef ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(styleRef)}
                    alt="Style preview"
                    className="max-h-48 mx-auto rounded-lg shadow-soft"
                  />
                  <p className="text-sm text-dark-300 font-medium">{styleRef.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStyleRef(null) }}
                    className="text-sm text-dark-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-dark-500">Upload a reference image for style matching</p>
              )}
            </div>
          </div>

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

          {/* Quick Edit Intent (Optional) */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-3">
              Quick Edit <span className="text-dark-500">(Optional)</span>
            </label>
            <select
              value={editIntent}
              onChange={(e) => setEditIntent(e.target.value)}
              className="select"
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
          <div className="pt-4 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={!baseImage || loading}
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
                'Generate Design (4 Variations)'
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
