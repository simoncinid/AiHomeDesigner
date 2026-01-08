import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Gallery - AI Home Designer',
  description: 'Browse curated AI-generated interior design transformations. Before and after room makeovers.',
  openGraph: {
    title: 'Gallery - AI Home Designer',
    description: 'Curated AI interior design gallery',
  },
}

export default function GalleryPage() {
  // In production, fetch curated public jobs from API
  // For now, show placeholder
  return (
    <div className="min-h-screen py-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">Design Gallery</h1>
      <p className="text-lg text-gray-600 mb-8">
        Browse curated AI-powered interior design transformations. All designs are user-submitted and approved.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Placeholder - in production, map over actual gallery items */}
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4">
            <p className="font-semibold">Modern Living Room</p>
            <p className="text-sm text-gray-600">Before & After</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Share Your Designs</h2>
        <p className="text-gray-700 mb-6">
          Create your own designs and share them with the community.
        </p>
        <Link
          href="/app/photo-makeover"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
