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
    refetchInterval: (data) => {
      // Poll every 1.2s if still processing
      return data?.status === 'processing' ? 1200 : false
    },
  })

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Generation Status</h1>

      {job.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">Generating your design... This may take 30-60 seconds.</p>
        </div>
      )}

      {job.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Generation failed: {job.error || 'Unknown error'}</p>
        </div>
      )}

      {job.status === 'completed' && job.output_urls && job.output_urls.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Designs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {job.output_urls.map((url, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
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

          <div className="mt-6 flex gap-4">
            <a
              href={job.share_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Share Link
            </a>
            {job.kind === 'edit' && (
              <a
                href={`/app/photo-to-video?image=${encodeURIComponent(job.output_urls[0])}`}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Create Video
              </a>
            )}
          </div>
        </div>
      )}

      {job.status === 'processing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing...</p>
        </div>
      )}
    </div>
  )
}
