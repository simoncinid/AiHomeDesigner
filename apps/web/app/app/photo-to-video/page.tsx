'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { apiClient } from '@/lib/api'
import { MOTION_PRESETS, VIDEO_RESOLUTIONS } from '@/lib/shared'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'

export default function PhotoToVideoPage() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('image')

  const [image, setImage] = useState<File | null>(null)
  const [motionPreset, setMotionPreset] = useState('dolly-in')
  const [duration, setDuration] = useState(5)
  const [resolution, setResolution] = useState('720p')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please log in to create videos')
      window.location.href = '/app'
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) setImage(files[0])
    },
  })

  const handleSubmit = async () => {
    if (!image && !imageUrl) {
      alert('Please upload an image or provide an image URL')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      if (image) {
        formData.append('image', image)
      } else if (imageUrl) {
        formData.append('image_url', imageUrl)
      }
      formData.append('motion_preset', motionPreset)
      if (prompt) {
        formData.append('prompt', prompt)
      }
      formData.append('duration', duration.toString())
      formData.append('resolution', resolution)

      const response = await apiClient.createI2VJob(formData)
      window.location.href = `/app/job/${response.data.id}`
    } catch (error: any) {
      console.error('Error:', error)
      if (error.response?.status === 401) {
        alert('Please log in to create videos')
        window.location.href = '/app'
      } else if (error.response?.status === 402) {
        alert('Insufficient video credits. Please purchase credits.')
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
          <h1 className="text-4xl font-bold text-navy-900 mb-3">Photo to Video</h1>
          <p className="text-navy-700 text-lg">Transform your designs into cinematic videos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          {/* Image Upload or URL */}
          {imageUrl ? (
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-3">Selected Image</label>
              <img src={imageUrl} alt="Selected" className="max-w-full h-auto rounded-xl shadow-sm" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-3">Upload Image *</label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200"
              >
                <input {...getInputProps()} />
                {image ? (
                  <div>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-sm"
                    />
                    <p className="mt-3 text-sm text-navy-700 font-medium">{image.name}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-navy-700 font-medium mb-1">Drag & drop or click to select</p>
                    <p className="text-sm text-navy-500">JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Motion Preset */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Motion Preset *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MOTION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setMotionPreset(preset.value)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                    motionPreset === preset.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 text-navy-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Duration (seconds)</label>
            <input
              type="number"
              min="5"
              max="20"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {VIDEO_RESOLUTIONS.map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Prompt (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-3">Custom Prompt (Optional)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Leave empty to use default motion prompt"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={600}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={(!image && !imageUrl) || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {loading ? 'Generating...' : 'Generate Video (1 Credit)'}
          </button>

          <p className="text-sm text-navy-600 text-center">
            Video generation requires credits. <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold underline">Purchase credits</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
