'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { apiClient, ApiError } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { ROOM_TYPES, STYLE_PRESETS, QUICK_EDITS } from '@/lib/shared'
import Link from 'next/link'

export default function PhotoMakeoverPage() {
  const [baseImage, setBaseImage] = useState<File | null>(null)
  const [styleRef, setStyleRef] = useState<File | null>(null)
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [editIntent, setEditIntent] = useState('')
  const [userPrompt, setUserPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsLoggedIn(!!token)
  }, [])

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
      if (userPrompt) {
        formData.append('user_prompt', userPrompt)
      }
      formData.append('size', '2048*2048')

      const job = await apiClient.createEditJob(formData)
      window.location.href = `/app/job/${job.id}`
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof ApiError && error.status === 402) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-[4.5rem]">
      <div className="container mx-auto px-4 py-6">
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto">
          
          {/* LEFT: Image Upload Section */}
          <div className="lg:col-span-5 space-y-3">
            {/* Main Image Upload */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <label className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">1</span>
                La tua foto
              </label>
              <div
                {...getBaseRootProps()}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  isBaseDragActive 
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/10' 
                    : baseImage
                    ? 'bg-slate-800/50'
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border-2 border-dashed border-slate-600 hover:border-emerald-400/50'
                }`}
                style={{ aspectRatio: baseImage ? 'auto' : '4/3' }}
              >
                <input {...getBaseInputProps()} />
                {baseImage ? (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(baseImage)}
                      alt="Preview"
                      className="w-full h-auto max-h-[280px] object-contain rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation() }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium backdrop-blur-sm transition-colors"
                      >
                        Cambia
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setBaseImage(null) }}
                        className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white text-sm font-medium transition-colors"
                      >
                        Rimuovi
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 mb-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white/90 font-semibold text-sm">Trascina o clicca</p>
                    <p className="text-white/40 text-xs mt-1">JPG, PNG • Max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Style Reference - More Compact */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <label className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 text-white text-xs font-bold shadow-lg shadow-violet-500/30">2</span>
                Stile di riferimento
                <span className="text-white/30 text-xs font-normal ml-1">opzionale</span>
              </label>
              <div
                {...getStyleRootProps()}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 h-24 ${
                  isStyleDragActive 
                    ? 'ring-2 ring-violet-400 bg-violet-500/10' 
                    : styleRef
                    ? 'bg-slate-800/50'
                    : 'bg-slate-800/30 hover:bg-slate-800/50 border-2 border-dashed border-slate-600 hover:border-violet-400/50'
                }`}
              >
                <input {...getStyleInputProps()} />
                {styleRef ? (
                  <div className="relative h-full flex items-center gap-3 px-3 group">
                    <img
                      src={URL.createObjectURL(styleRef)}
                      alt="Style preview"
                      className="h-16 w-16 object-cover rounded-lg ring-2 ring-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{styleRef.name}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setStyleRef(null) }}
                        className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors"
                      >
                        Rimuovi
                      </button>
                    </div>
                    <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-sm">Carica un'immagine di stile</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CENTER: Settings */}
          <div className="lg:col-span-4 space-y-3">
            {/* Room Type & Style in one card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 space-y-4">
              {/* Room Type */}
              <div>
                <label className="text-sm font-semibold text-white/90 mb-2 block">Tipo di stanza</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-white text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
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
                <label className="text-sm font-semibold text-white/90 mb-2 block">Stile</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style}
                      onClick={() => setStylePreset(style)}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        stylePreset === style
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-800/80 text-white/70 hover:bg-slate-700/80 hover:text-white border border-slate-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Edit */}
              <div>
                <label className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                  Modifica rapida
                  <span className="text-white/30 text-xs font-normal">opzionale</span>
                </label>
                <select
                  value={editIntent}
                  onChange={(e) => setEditIntent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-white text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                >
                  <option value="">Nessuna</option>
                  {QUICK_EDITS.map((edit) => (
                    <option key={edit} value={edit}>
                      {edit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <label className="text-sm font-semibold text-white/90 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  Prompt personalizzato
                  <span className="text-white/30 text-xs font-normal">opzionale</span>
                </span>
                <span className="text-white/30 text-xs">{userPrompt.length}/600</span>
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Es: 'divano blu scuro, aggiungi piante, illuminazione calda...'"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600 text-white text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all resize-none placeholder:text-white/30 h-24"
                maxLength={600}
              />
            </div>
          </div>

          {/* RIGHT: CTA Panel */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-5 sticky top-24">
              {/* Preview/Status */}
              <div className="text-center mb-5">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Pronto a generare?</h3>
                <p className="text-white/50 text-sm">
                  {baseImage ? 'Immagine caricata ✓' : 'Carica una foto per iniziare'}
                </p>
              </div>

              {/* Summary */}
              {baseImage && (
                <div className="bg-slate-800/50 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Stanza</span>
                    <span className="text-white font-medium">{roomType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Stile</span>
                    <span className="text-white font-medium">{stylePreset}</span>
                  </div>
                  {editIntent && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Modifica</span>
                      <span className="text-white font-medium text-xs">{editIntent}</span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={handleSubmit}
                disabled={!baseImage || loading}
                className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 disabled:from-slate-600 disabled:via-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/40 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Genera Design
                  </>
                )}
              </button>

              {/* Credits Info */}
              {!isLoggedIn && (
                <p className="text-center text-white/40 text-xs mt-3">
                  Gratis: 1/giorno • <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300 font-semibold">Vai Premium</Link>
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
