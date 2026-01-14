'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'

export default function JobPage() {
  const params = useParams()
  const jobId = params.id as string

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiClient.getJob(jobId),
    refetchInterval: (query) => {
      const jobData = query.state.data
      return jobData?.status === 'processing' ? 1200 : false
    },
  })

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-slate-700 font-semibold text-lg">Caricamento in corso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-20 pb-8">
      <div className="container mx-auto px-6">
        
        {/* Processing State */}
        {job.status === 'processing' && (
          <div className="h-[100vh] max-h-[100vh] flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12">
                <div className="flex flex-col items-center justify-center">
                  {/* Animated Icon */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Stiamo creando la tua magia
                  </h2>
                  <p className="text-slate-600 text-center max-w-md text-lg mb-8">
                    L'intelligenza artificiale sta lavorando al tuo design. Di solito ci vogliono 30-60 secondi.
                  </p>

                  {/* Progress Indicators */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">Elaborazione immagine in corso...</span>
                    </div>
                    <p className="text-xs text-center text-slate-500 font-mono">Job ID: {jobId.slice(0, 8)}...</p>
                  </div>

                  {/* Warning */}
                  <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-medium">Non chiudere questa pagina</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Failed State */}
        {job.status === 'failed' && (
          <div className="h-[100vh] max-h-[100vh] flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Generazione fallita</h2>
                  <p className="text-slate-600 max-w-md mb-8 text-lg">
                    {job.error || 'Si è verificato un errore imprevisto. Riprova.'}
                  </p>
                  <Link href="/app/photo-makeover" className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                    Riprova
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed State */}
        {job.status === 'completed' && job.output_urls && job.output_urls.length > 0 && (
          <div className="max-w-7xl mx-auto">
            {/* Success Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-lg">Design completato!</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">I tuoi risultati sono pronti</h1>
              <p className="text-slate-600 text-lg">Confronta il prima e dopo trascinando lo slider</p>
            </div>

            {/* Results */}
            {job.kind === 'edit' && job.input_url ? (
              /* Edit Job - Show Before/After Slider */
              <div className="mb-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                  <div className="aspect-square max-h-[80vh]">
                    <BeforeAfterSlider 
                      beforeImage={job.input_url} 
                      afterImage={job.output_urls[0]}
                      beforeLabel="Prima"
                      afterLabel="Dopo"
                    />
                  </div>
                  
                  {/* Download Button */}
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-t border-slate-200">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <a
                        href={job.output_urls[0]}
                        download="design-ai-home-designer.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Scarica Immagine
                      </a>
                      <a
                        href={job.share_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Condividi
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* T2I or I2V Job - Show Grid */
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {job.output_urls.map((url, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={url}
                        alt={`Design ${idx + 1}`}
                        width={1024}
                        height={1024}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={url}
                          download={`design-${idx + 1}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/50 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Scarica
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center items-center p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
              {job.kind === 'edit' && (
                <Link
                  href={`/app/photo-to-video?image=${encodeURIComponent(job.output_urls[0])}`}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Crea Video
                </Link>
              )}
              <Link 
                href="/app/photo-makeover" 
                className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Genera Altri Design
              </Link>
              <Link 
                href="/app/room-generator" 
                className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Crea da Zero
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
