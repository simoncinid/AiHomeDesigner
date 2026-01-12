'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'

export default function JobPage() {
  const params = useParams()
  const jobId = params.id as string

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiClient.getJob(jobId).then(res => res.data),
    refetchInterval: (query) => {
      const jobData = query.state.data
      return jobData?.status === 'processing' ? 1200 : false
    },
  })

  if (!job) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-2">Generation Status</h1>
          <p className="text-slate-500">
            Job ID: <span className="font-mono text-slate-400">{jobId.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Processing State */}
        {job.status === 'processing' && (
          <div className="card p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-3 border-brand-100 rounded-full" />
                <div className="absolute inset-0 w-20 h-20 border-3 border-transparent border-t-brand-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Generating your design...</h2>
              <p className="text-slate-500 text-center max-w-md">
                This usually takes 30-60 seconds. Please don't close this page.
              </p>
            </div>
          </div>
        )}

        {/* Failed State */}
        {job.status === 'failed' && (
          <div className="card p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Generation Failed</h2>
              <p className="text-slate-500 text-center max-w-md mb-6">
                {job.error || 'An unexpected error occurred. Please try again.'}
              </p>
              <Link href="/app/photo-makeover" className="btn-primary">
                Try Again
              </Link>
            </div>
          </div>
        )}

        {/* Completed State */}
        {job.status === 'completed' && job.output_urls && job.output_urls.length > 0 && (
          <div className="space-y-8">
            {/* Success Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-emerald-700 font-medium">Your designs are ready!</p>
            </div>

            {/* Results Grid */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Designs</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {job.output_urls.map((url, idx) => (
                  <div key={idx} className="card overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={url}
                        alt={`Design ${idx + 1}`}
                        width={1024}
                        height={1024}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={url}
                          download={`design-${idx + 1}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-sm py-2 px-4 bg-white/90 backdrop-blur-sm"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <a
                href={job.share_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Link
              </a>
              {job.kind === 'edit' && (
                <Link
                  href={`/app/photo-to-video?image=${encodeURIComponent(job.output_urls[0])}`}
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Create Video
                </Link>
              )}
              <Link href="/app/photo-makeover" className="btn-secondary">
                Generate More
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
