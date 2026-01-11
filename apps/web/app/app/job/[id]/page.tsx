'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useEffect } from 'react'
import Image from 'next/image'

export default function JobPage() {
  const params = useParams()
  const jobId = params.id as string

  const { data: job, refetch } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiClient.getJob(jobId).then(res => res.data),
    refetchInterval: (query) => {
      // Poll every 1.2s if still processing
      const jobData = query.state.data
      return jobData?.status === 'processing' ? 1200 : false
    },
  })

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-navy-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">Generation Status</h1>

        {job.status === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-blue-800 font-medium">Generating your design... This may take 30-60 seconds.</p>
          </div>
        )}

        {job.status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-800 font-medium">Generation failed: {job.error || 'Unknown error'}</p>
          </div>
        )}

        {job.status === 'completed' && job.output_urls && job.output_urls.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-navy-900 mb-6">Your Designs</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {job.output_urls.map((url, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <Image
                    src={url}
                    alt={`Design ${idx + 1}`}
                    width={1024}
                    height={1024}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={job.share_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Share Link
              </a>
              {job.kind === 'edit' && (
                <a
                  href={`/app/photo-to-video?image=${encodeURIComponent(job.output_urls[0])}`}
                  className="bg-navy-700 hover:bg-navy-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Create Video
                </a>
              )}
            </div>
          </div>
        )}

        {job.status === 'processing' && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-navy-700 font-medium text-lg">Processing your design...</p>
          </div>
        )}
      </div>
    </div>
  )
}
