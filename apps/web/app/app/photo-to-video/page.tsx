'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { apiClient, ApiError } from '@/lib/api'
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
      alert('Please sign in to create videos')
      window.location.href = '/login'
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

      const job = await apiClient.createI2VJob(formData)
      window.location.href = `/app/job/${job.id}`
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof ApiError) {
        if (error.status === 401) {
          alert('Please sign in to create videos')
          window.location.href = '/login'
        } else if (error.status === 402) {
          alert('Insufficient video credits. Please purchase credits.')
          window.location.href = '/pricing'
        } else {
          alert(error.detail || 'Failed to create job. Please try again.')
        }
      } else {
        alert('Failed to create job. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden flex flex-col pt-20">
      <div className="flex-1 container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-[90vw] h-full max-h-[calc(100vh-5rem)] flex flex-col">
          
          {/* Header Fluttuante */}
          <div className="relative mx-6 mb-3 rounded-2xl overflow-hidden bg-gradient-to-r from-sky-400/80 via-blue-500/80 to-cyan-500/80 backdrop-blur-xl px-5 py-3 shadow-lg border border-white/30">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative">
              <h1 className="text-xl font-bold text-white tracking-tight">Photo to Video</h1>
              <p className="text-white/95 text-xs font-light">Trasforma i tuoi design in video cinematografici con l'AI</p>
            </div>
          </div>
          
          {/* Card Contenuto */}
          <div className="flex-1 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden">
            
            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
                
                {/* Left Side - Upload Area */}
                <div className="space-y-2 overflow-y-auto pr-2">
                  {imageUrl ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs font-bold">✓</span>
                        Immagine selezionata
                      </label>
                      <div className="relative rounded-xl overflow-hidden bg-slate-100 border-2 border-emerald-300 shadow-lg ring-2 ring-emerald-100">
                        <img src={imageUrl} alt="Selected" className="w-full h-auto" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                          Pronta
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs font-bold">1</span>
                        Carica la tua immagine
                      </label>
                      <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                          isDragActive 
                            ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                            : image
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md'
                        }`}
                      >
                        <input {...getInputProps()} />
                        {image ? (
                          <div className="space-y-2">
                            <div className="relative inline-block">
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg shadow-lg ring-2 ring-white"
                              />
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium truncate px-2">{image.name}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); setImage(null) }}
                              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                            >
                              Rimuovi
                            </button>
                          </div>
                        ) : (
                          <div className="py-8">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                              <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-slate-700 font-semibold text-sm mb-1">Trascina qui la tua immagine</p>
                            <p className="text-xs text-slate-500">oppure clicca per selezionare</p>
                            <p className="text-xs text-slate-400 mt-2">JPG, PNG fino a 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side - Settings */}
                <div className="space-y-2 overflow-y-auto pr-2">
                  {/* Motion Preset */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Movimento della camera</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {MOTION_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => setMotionPreset(preset.value)}
                          className={`px-2 py-2 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                            motionPreset === preset.value
                              ? 'bg-gradient-to-br from-sky-500 to-blue-600 border-sky-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:shadow-sm'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Durata del video</label>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-2">
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gradient-to-r from-sky-200 to-blue-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{
                          background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(37 99 235) ${((duration - 5) / 15) * 100}%, rgb(226 232 240) ${((duration - 5) / 15) * 100}%, rgb(226 232 240) 100%)`
                        }}
                      />
                      <span className="text-lg font-bold text-slate-900 w-12 text-center bg-white rounded-lg px-2 py-1 shadow-sm border border-slate-200">{duration}s</span>
                    </div>
                  </div>

                  {/* Resolution */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Risoluzione video</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {VIDEO_RESOLUTIONS.map((res) => (
                        <button
                          key={res}
                          onClick={() => setResolution(res)}
                          className={`px-2 py-2 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                            resolution === res
                              ? 'bg-gradient-to-br from-sky-500 to-blue-600 border-sky-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:shadow-sm'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Prompt */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Prompt personalizzato <span className="text-slate-400 text-xs font-normal">(opzionale)</span>
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Lascia vuoto per usare il movimento predefinito..."
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-200 transition-all resize-none bg-white text-slate-700 placeholder:text-slate-400 text-sm min-h-[80px]"
                      maxLength={600}
                    />
                    <p className="text-xs text-slate-500 mt-1 text-right">{prompt.length}/600</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with CTA */}
            <div className="border-t border-slate-200 px-3 py-2 bg-gradient-to-r from-sky-50/50 to-blue-50/50">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={(!image && !imageUrl) || loading}
                  className="w-full sm:flex-1 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 hover:from-sky-600 hover:via-blue-700 hover:to-cyan-700 disabled:from-slate-300 disabled:via-slate-400 disabled:to-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generazione...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Genera Video
                    </>
                  )}
                </button>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-slate-600">
                    1 credito • <Link href="/pricing" className="text-sky-600 hover:text-sky-700 font-bold">Acquista</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
