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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 pt-20 pb-8">
      <div className="container mx-auto px-6 h-[100vh] max-h-[100vh] flex items-center justify-center">
        <div className="w-full max-w-[90vw] h-[90vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">
          
          {/* Header Elegante */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Room Generator</h1>
              <p className="text-white/90 text-sm font-light">Crea stanze straordinarie partendo da zero con l'AI</p>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              
              {/* Left Side - Visualization/Inspiration */}
              <div className="lg:col-span-1 flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">La tua visione</h2>
                    <p className="text-slate-600 leading-relaxed">
                      Descrivi il tuo ambiente ideale e lascia che l'intelligenza artificiale lo realizzi per te
                    </p>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-700"><span className="font-semibold">Qualità professionale</span> in pochi secondi</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-700"><span className="font-semibold">Infinite variazioni</span> di stile</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-700"><span className="font-semibold">Nessuna skill richiesta</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Room Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">1</span>
                    Tipo di stanza
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 transition-all bg-white text-slate-700 font-medium text-lg"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold">2</span>
                    Stile di design
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style}
                        onClick={() => setStylePreset(style)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                          stylePreset === style
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white shadow-lg scale-105'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:shadow-md hover:scale-102'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold">3</span>
                    Dimensione immagine
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 transition-all bg-white text-slate-700 font-medium"
                  >
                    {IMAGE_SIZES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Prompt */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">4</span>
                    Descrivi la tua stanza ideale <span className="text-slate-400 text-xs font-normal">(opzionale)</span>
                  </label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Es: 'con una grande finestra che dà sul giardino, mobili minimalisti, illuminazione calda, divano in velluto, tavolo in marmo, piante tropicali...'"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 transition-all resize-none bg-white text-slate-700 placeholder:text-slate-400 min-h-[160px]"
                    maxLength={600}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-right font-medium">{userPrompt.length}/600 caratteri</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with CTA */}
          <div className="border-t border-slate-200 px-8 py-6 bg-gradient-to-r from-emerald-50 to-teal-50/50">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 disabled:from-slate-300 disabled:via-slate-400 disabled:to-slate-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creazione in corso...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Genera Stanza
                  </>
                )}
              </button>
              {!isLoggedIn && (
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-600 font-medium">
                    Free: 1 immagine/giorno
                  </p>
                  <Link href="/pricing" className="text-sm text-emerald-600 hover:text-emerald-700 font-bold underline">
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
