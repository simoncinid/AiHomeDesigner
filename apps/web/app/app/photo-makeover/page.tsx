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
    <div className="h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden flex flex-col pt-20">
      <div className="flex-1 container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-[90vw] h-full max-h-[calc(100vh-5rem)] flex flex-col">
          
          {/* Header Fluttuante */}
          <div className="relative mx-6 mb-3 rounded-2xl overflow-hidden bg-gradient-to-r from-sky-400/80 via-blue-500/80 to-cyan-500/80 backdrop-blur-xl px-5 py-3 shadow-lg border border-white/30">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative">
              <h1 className="text-xl font-bold text-white tracking-tight">Photo Makeover</h1>
              <p className="text-white/95 text-xs font-light">Trasforma le tue stanze con l'intelligenza artificiale</p>
            </div>
          </div>
          
          {/* Card Contenuto */}
          <div className="flex-1 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden">

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
              
              {/* Left Side - Upload Area */}
              <div className="space-y-2 overflow-y-auto pr-2">
                {/* Main Image Upload */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs font-bold">1</span>
                    Carica la foto della tua stanza
                  </label>
                  <div
                    {...getBaseRootProps()}
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                      isBaseDragActive 
                        ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                        : baseImage
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md'
                    }`}
                  >
                    <input {...getBaseInputProps()} />
                    {baseImage ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(baseImage)}
                            alt="Preview"
                            className="max-h-40 mx-auto rounded-lg shadow-lg ring-2 ring-white"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 font-medium truncate px-2">{baseImage.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setBaseImage(null) }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                        >
                          Rimuovi
                        </button>
                      </div>
                    ) : (
                      <div className="py-6">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-slate-700 font-semibold text-sm mb-1">Trascina qui la tua foto</p>
                        <p className="text-xs text-slate-500">oppure clicca per selezionare</p>
                        <p className="text-xs text-slate-400 mt-2">JPG, PNG fino a 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Style Reference */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-white text-xs font-bold">2</span>
                    Immagine di riferimento <span className="text-slate-400 text-xs font-normal">(opzionale)</span>
                  </label>
                  <div
                    {...getStyleRootProps()}
                    className={`relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all duration-300 ${
                      isStyleDragActive 
                        ? 'border-cyan-400 bg-cyan-50' 
                        : styleRef
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30'
                    }`}
                  >
                    <input {...getStyleInputProps()} />
                    {styleRef ? (
                      <div className="space-y-1">
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(styleRef)}
                            alt="Style preview"
                            className="max-h-20 mx-auto rounded-md shadow-md ring-2 ring-white"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 truncate">{styleRef.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setStyleRef(null) }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          Rimuovi
                        </button>
                      </div>
                    ) : (
                      <div className="py-2">
                        <svg className="w-6 h-6 mx-auto mb-1 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-500 text-xs">Carica uno stile</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Settings */}
              <div className="space-y-2 overflow-y-auto pr-2">
                {/* Room Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Tipo di stanza</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-200 transition-all bg-white text-slate-700 text-sm"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Stile di design</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style}
                        onClick={() => setStylePreset(style)}
                        className={`px-2 py-2 rounded-lg border-2 text-xs font-semibold transition-all duration-200 ${
                          stylePreset === style
                            ? 'bg-gradient-to-br from-sky-500 to-blue-600 border-sky-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:shadow-sm'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Edit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Modifica rapida <span className="text-slate-400 text-xs font-normal">(opzionale)</span></label>
                  <select
                    value={editIntent}
                    onChange={(e) => setEditIntent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-200 transition-all bg-white text-slate-700 text-sm"
                  >
                    <option value="">Nessuna</option>
                    {QUICK_EDITS.map((edit) => (
                      <option key={edit} value={edit}>
                        {edit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Prompt */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Prompt personalizzato <span className="text-slate-400 text-xs font-normal">(opzionale)</span></label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Descrivi le modifiche: es. 'divano blu scuro, aggiungi piante, illuminazione calda...'"
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-200 transition-all resize-none bg-white text-slate-700 placeholder:text-slate-400 text-sm"
                    maxLength={600}
                  />
                  <p className="text-xs text-slate-500 mt-1 text-right">{userPrompt.length}/600</p>
                </div>
              </div>
            </div>

            {/* Footer with CTA */}
            <div className="border-t border-slate-200 px-3 py-2 bg-gradient-to-r from-sky-50/50 to-blue-50/50">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={!baseImage || loading}
                className="w-full sm:flex-1 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 hover:from-sky-600 hover:via-blue-700 hover:to-cyan-700 disabled:from-slate-300 disabled:via-slate-400 disabled:to-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generazione...
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
              {!isLoggedIn && (
                <div className="text-center sm:text-left">
                  <p className="text-xs text-slate-600">
                    Free: 1/giorno • <Link href="/pricing" className="text-sky-600 hover:text-sky-700 font-bold">Premium</Link>
                  </p>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
