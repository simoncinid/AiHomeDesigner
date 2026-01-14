'use client'

import { useState, useEffect } from 'react'
import { apiClient, ApiError } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { ROOM_TYPES, STYLE_PRESETS, IMAGE_SIZES } from '@/lib/shared'
import Link from 'next/link'

export default function RoomGeneratorPage() {
  const [roomType, setRoomType] = useState('living room')
  const [stylePreset, setStylePreset] = useState('Modern')
  const [userPrompt, setUserPrompt] = useState('')
  const [size, setSize] = useState('2048*2048')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsLoggedIn(!!token)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const job = await apiClient.createT2IJob({
        room_type: roomType,
        style_preset: stylePreset,
        user_prompt: userPrompt || undefined,
        size,
      })
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
              <h1 className="text-xl font-bold text-white tracking-tight">Room Generator</h1>
              <p className="text-white/95 text-xs font-light">Crea stanze straordinarie partendo da zero con l'AI</p>
            </div>
          </div>
          
          {/* Card Contenuto */}
          <div className="flex-1 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden">
            
            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
                
                {/* Left Side - Settings */}
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

                  {/* Size */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Dimensione immagine</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-sky-400 focus:ring focus:ring-sky-200 transition-all bg-white text-slate-700 text-sm"
                    >
                      {IMAGE_SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Side - Prompt */}
                <div className="flex flex-col min-h-0 overflow-y-auto pr-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Descrivi la tua stanza ideale <span className="text-slate-400 text-xs font-normal">(opzionale)</span>
                  </label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Es: 'con una grande finestra che dà sul giardino, mobili minimalisti, illuminazione calda, divano in velluto, tavolo in marmo...'"
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
                  disabled={loading}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Genera Stanza
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
