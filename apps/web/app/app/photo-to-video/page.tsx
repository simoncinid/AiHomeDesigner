'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { apiClient } from '@/lib/api'
import { MOTION_PRESETS, VIDEO_RESOLUTIONS } from '@ai-homedesigner/shared'
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
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Photo to Video</h1>

      <div className="space-y-6">
        {/* Image Upload or URL */}
        {imageUrl ? (
          <div>
            <label className="block text-sm font-medium mb-2">Selected Image</label>
            <img src={imageUrl} alt="Selected" className="max-w-full h-auto rounded-lg" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image *</label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition"
            >
              <input {...getInputProps()} />
              {image ? (
                <div>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded"
                  />
                  <p className="mt-2 text-sm text-gray-600">{image.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">Drag & drop or click to select</p>
                  <p className="text-sm text-gray-400 mt-2">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Motion Preset */}
        <div>
          <label className="block text-sm font-medium mb-2">Motion Preset *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {MOTION_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setMotionPreset(preset.value)}
                className={`px-4 py-2 rounded-lg border transition ${
                  motionPreset === preset.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white border-gray-300 hover:border-primary-500'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
          <input
            type="number"
            min="5"
            max="20"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-sm font-medium mb-2">Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
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
          <label className="block text-sm font-medium mb-2">Custom Prompt (Optional)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Leave empty to use default motion prompt"
            className="w-full border rounded-lg px-4 py-2 h-24"
            maxLength={600}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={(!image && !imageUrl) || loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Video (1 Credit)'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Video generation requires credits. <Link href="/pricing" className="text-primary-600 underline">Purchase credits</Link>
        </p>
      </div>
    </div>
  )
}
