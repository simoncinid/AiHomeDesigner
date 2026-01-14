'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient, GalleryItem } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { BeforeAfterSlider } from './BeforeAfterSlider'

export function GallerySection() {
  const { data: gallery, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => apiClient.getGallery(6, 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) {
    return (
      <section className="relative py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Design Gallery</h2>
            <p className="section-subheading mx-auto">
              Esplora le trasformazioni create dalla nostra community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!gallery || gallery.items.length === 0) {
    return null
  }

  return (
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">Design Gallery</h2>
          <p className="section-subheading mx-auto">
            Esplora le trasformazioni create dalla nostra community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {gallery.items.map((item) => {
            // Per i job di tipo 'edit', mostra il before/after slider
            if (item.kind === 'edit' && item.input_urls && item.input_urls.length > 0 && item.output_urls && item.output_urls.length > 0) {
              return (
                <Link
                  key={item.id}
                  href={item.share_url}
                  className="group block bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square">
                    <BeforeAfterSlider
                      beforeImage={item.input_urls[0]}
                      afterImage={item.output_urls[0]}
                      beforeLabel="Prima"
                      afterLabel="Dopo"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">
                        {item.room_type || 'Room'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.style_preset || 'Style'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            }
            
            // Per altri tipi, mostra solo l'immagine di output
            if (item.output_urls && item.output_urls.length > 0) {
              return (
                <Link
                  key={item.id}
                  href={item.share_url}
                  className="group block bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.output_urls[0]}
                      alt={`${item.room_type || 'Room'} - ${item.style_preset || 'Design'}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">
                          {item.room_type || 'Room'}
                        </span>
                        <span className="text-xs text-white/80">
                          {item.style_preset || 'Style'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            }
            
            return null
          })}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Vedi tutta la galleria
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
