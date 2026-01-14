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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/30 pt-20 pb-8">
      <div className="container mx-auto px-6 h-[100vh] max-h-[100vh] flex items-center justify-center">
        <div className="w-full max-w-[90vw] h-[90vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">
          
          {/* Header Elegante */}
          <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Photo to Video</h1>
              <p className="text-white/90 text-sm font-light">Trasforma i tuoi design in video cinematografici con l'AI</p>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              
              {/* Left Side - Upload Area */}
              <div className="space-y-6">
                {imageUrl ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white text-xs font-bold">✓</span>
                      Immagine selezionata
                    </label>
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 border-2 border-green-300 shadow-xl ring-4 ring-green-100">
                      <img src={imageUrl} alt="Selected" className="w-full h-auto" />
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                        Pronta per il video
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white text-xs font-bold">1</span>
                      Carica la tua immagine
                    </label>
                    <div
                      {...getRootProps()}
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive 
                          ? 'border-fuchsia-400 bg-fuchsia-50 scale-[1.02]' 
                          : image
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-slate-200 hover:border-fuchsia-300 hover:bg-fuchsia-50/30 hover:shadow-lg'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {image ? (
                        <div className="space-y-3">
                          <div className="relative inline-block">
                            <img
                              src={URL.createObjectURL(image)}
                              alt="Preview"
                              className="max-h-80 mx-auto rounded-xl shadow-2xl ring-4 ring-white"
                            />
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 font-medium truncate px-4">{image.name}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setImage(null) }}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                          >
                            Rimuovi
                          </button>
                        </div>
                      ) : (
                        <div className="py-12">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-slate-700 font-semibold text-lg mb-2">Trascina qui la tua immagine</p>
                          <p className="text-sm text-slate-500">oppure clicca per selezionare</p>
                          <p className="text-xs text-slate-400 mt-3">JPG, PNG fino a 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-6 border border-violet-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-2">Crea video professionali</h3>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Movimenti di camera realistici</li>
                        <li>• Fino a 20 secondi di durata</li>
                        <li>• Risoluzione HD e Full HD</li>
                        <li>• Elaborazione in 1-2 minuti</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Settings */}
              <div className="space-y-6">
                {/* Motion Preset */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white text-xs font-bold">2</span>
                    Movimento della camera
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MOTION_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setMotionPreset(preset.value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                          motionPreset === preset.value
                            ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600 border-violet-600 text-white shadow-lg scale-105'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-fuchsia-300 hover:shadow-md'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs font-bold">3</span>
                    Durata del video
                  </label>
                  <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-gradient-to-r from-violet-200 to-fuchsia-300 rounded-lg appearance-none cursor-pointer accent-fuchsia-600"
                      style={{
                        background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(192 38 211) ${((duration - 5) / 15) * 100}%, rgb(226 232 240) ${((duration - 5) / 15) * 100}%, rgb(226 232 240) 100%)`
                      }}
                    />
                    <span className="text-2xl font-bold text-slate-900 w-16 text-center bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200">{duration}s</span>
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white text-xs font-bold">4</span>
                    Risoluzione video
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {VIDEO_RESOLUTIONS.map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                          resolution === res
                            ? 'bg-gradient-to-br from-rose-500 to-red-600 border-rose-600 text-white shadow-lg scale-105'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:shadow-md'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white text-xs font-bold">5</span>
                    Prompt personalizzato <span className="text-slate-400 text-xs font-normal">(opzionale)</span>
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Lascia vuoto per usare il movimento predefinito oppure descrivi il movimento desiderato..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-fuchsia-400 focus:ring focus:ring-fuchsia-200 transition-all resize-none bg-white text-slate-700 placeholder:text-slate-400 min-h-[120px]"
                    maxLength={600}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-right font-medium">{prompt.length}/600 caratteri</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with CTA */}
          <div className="border-t border-slate-200 px-8 py-6 bg-gradient-to-r from-violet-50 to-fuchsia-50/50">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={(!image && !imageUrl) || loading}
                className="w-full sm:flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 disabled:from-slate-300 disabled:via-slate-400 disabled:to-slate-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generazione video in corso...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Genera Video
                  </>
                )}
              </button>
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-600 font-medium">
                  Richiede 1 credito video
                </p>
                <Link href="/pricing" className="text-sm text-violet-600 hover:text-violet-700 font-bold underline">
                  Acquista crediti
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
