'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import Image from 'next/image'

export function SharePageClient({ shareId }: { shareId: string }) {
  // Extract job ID from share ID (in production, you'd have an endpoint to get job by share_id)
  // For now, we'll need to add that endpoint or use a different approach
  const { data: job } = useQuery({
    queryKey: ['share', shareId],
    queryFn: () => apiClient.getJobByShareId(shareId).then(res => res.data),
  })

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading shared design...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Shared Design</h1>
      
      {job.status === 'completed' && job.output_urls && (
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
      )}
    </div>
  )
}
