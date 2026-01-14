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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-sky-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-sky-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Processing State */}
        {job.status === 'processing' && (
          <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center">
                  {/* Animated Icon */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                      <div className="relative w-18 h-18">
                        <div className="absolute inset-0 border-4 border-sky-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-sky-500 border-r-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-10 h-10 text-sky-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Creating your design
                  </h2>
                  <p className="text-gray-500 text-center max-w-sm mb-6">
                    AI is working on your design. This usually takes 30-60 seconds.
                  </p>

                  {/* Progress Indicator */}
                  <div className="w-full max-w-sm">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium text-sm">Processing image...</span>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-3 font-mono">Job ID: {jobId.slice(0, 8)}...</p>
                  </div>

                  {/* Warning */}
                  <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-medium">Don't close this page</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Failed State */}
        {job.status === 'failed' && (
          <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Generation Failed</h2>
                  <p className="text-gray-500 max-w-sm mb-6">
                    {job.error || 'An unexpected error occurred. Please try again.'}
                  </p>
                  <Link 
                    href="/app/photo-makeover" 
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Try Again
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed State */}
        {job.status === 'completed' && job.output_urls && job.output_urls.length > 0 && (
          <div className="max-w-6xl mx-auto py-4">
            {/* Success Header */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">Design completed!</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Your results are ready</h1>
              <p className="text-gray-500 text-sm">Drag the slider to compare before and after</p>
            </div>

            {/* Results */}
            {job.kind === 'edit' && job.input_urls && job.input_urls.length > 0 && job.output_urls && job.output_urls.length > 0 ? (
              /* Edit Job - Show Before/After Slider */
              <div className="mb-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="aspect-square max-h-[60vh]">
                    <BeforeAfterSlider 
                      beforeImage={job.input_urls[0]} 
                      afterImage={job.output_urls[0]}
                      beforeLabel="Before"
                      afterLabel="After"
                    />
                  </div>
                  
                  {/* Download Button */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <a
                        href={job.output_urls[0]}
                        download="design-ai-home-designer.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Image
                      </a>
                      <a
                        href={job.share_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50 transition-all flex items-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* T2I or I2V Job - Show Grid */
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {job.output_urls.map((url, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={url}
                        alt={`Design ${idx + 1}`}
                        width={1024}
                        height={1024}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={url}
                          download={`design-${idx + 1}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/50 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              {job.kind === 'edit' && (
                <Link
                  href={`/app/photo-to-video?image=${encodeURIComponent(job.output_urls[0])}`}
                  className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Create Video
                </Link>
              )}
              <Link 
                href="/app/photo-makeover" 
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50 transition-all flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate More
              </Link>
              <Link 
                href="/app/room-generator" 
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50 transition-all flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create from Scratch
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
