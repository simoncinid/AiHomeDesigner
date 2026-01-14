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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-20 pb-8">
      <div className="container mx-auto px-6 h-[100vh] max-h-[100vh] flex items-center justify-center">
        <div className="w-full max-w-[90vw] h-[90vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">
          
          {/* Header Elegante */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Photo Makeover</h1>
              <p className="text-white/90 text-sm font-light">Trasforma le tue stanze con l'intelligenza artificiale</p>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              
              {/* Left Side - Upload Area */}
              <div className="space-y-6">
                {/* Main Image Upload */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">1</span>
                    Carica la foto della tua stanza
                  </label>
                  <div
                    {...getBaseRootProps()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isBaseDragActive 
                        ? 'border-purple-400 bg-purple-50 scale-[1.02]' 
                        : baseImage
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 hover:shadow-lg'
                    }`}
                  >
                    <input {...getBaseInputProps()} />
                    {baseImage ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(baseImage)}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-xl shadow-xl ring-4 ring-white"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium truncate px-4">{baseImage.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setBaseImage(null) }}
                          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                          Rimuovi
                        </button>
                      </div>
                    ) : (
                      <div className="py-12">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-slate-700 font-semibold text-lg mb-2">Trascina qui la tua foto</p>
                        <p className="text-sm text-slate-500">oppure clicca per selezionare</p>
                        <p className="text-xs text-slate-400 mt-3">JPG, PNG fino a 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Style Reference */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white text-xs font-bold">2</span>
                    Immagine di riferimento <span className="text-slate-400 text-xs font-normal">(opzionale)</span>
                  </label>
                  <div
                    {...getStyleRootProps()}
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                      isStyleDragActive 
                        ? 'border-pink-400 bg-pink-50' 
                        : styleRef
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50/30'
                    }`}
                  >
                    <input {...getStyleInputProps()} />
                    {styleRef ? (
                      <div className="space-y-2">
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(styleRef)}
                            alt="Style preview"
                            className="max-h-32 mx-auto rounded-lg shadow-lg ring-2 ring-white"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 font-medium truncate">{styleRef.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setStyleRef(null) }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          Rimuovi
                        </button>
                      </div>
                    ) : (
                      <div className="py-3">
                        <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-500 text-sm">Carica uno stile di riferimento</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Settings */}
              <div className="space-y-6">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Tipo di stanza</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all bg-white text-slate-700 font-medium"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Stile di design</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style}
                        onClick={() => setStylePreset(style)}
                        className={`px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                          stylePreset === style
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 border-purple-600 text-white shadow-lg scale-105'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Edit */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Modifica rapida <span className="text-slate-400 text-xs font-normal">(opzionale)</span></label>
                  <select
                    value={editIntent}
                    onChange={(e) => setEditIntent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all bg-white text-slate-700 font-medium"
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
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Prompt personalizzato <span className="text-slate-400 text-xs font-normal">(opzionale)</span></label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Descrivi le modifiche che desideri: es. 'divano blu scuro in velluto, aggiungi piante, illuminazione calda, pavimento in legno...'"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all resize-none bg-white text-slate-700 placeholder:text-slate-400"
                    maxLength={600}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-right font-medium">{userPrompt.length}/600 caratteri</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with CTA */}
          <div className="border-t border-slate-200 px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50/50">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={!baseImage || loading}
                className="w-full sm:flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:via-slate-400 disabled:to-slate-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Genera Design
                  </>
                )}
              </button>
              {!isLoggedIn && (
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-600 font-medium">
                    Free: 1 immagine/giorno
                  </p>
                  <Link href="/pricing" className="text-sm text-purple-600 hover:text-purple-700 font-bold underline">
                    Passa a Premium
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
