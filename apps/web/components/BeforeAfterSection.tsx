'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import Link from 'next/link'
import { BeforeAfterSlider } from './BeforeAfterSlider'

export function BeforeAfterSection() {
  const { data: gallery, isLoading } = useQuery({
    queryKey: ['gallery', 'before-after'],
    queryFn: () => apiClient.getGallery(4, 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Filtra solo i job di tipo 'edit' con input e output
  const beforeAfterItems = gallery?.items.filter(
    (item) => item.kind === 'edit' && item.input_urls && item.input_urls.length > 0 && item.output_urls && item.output_urls.length > 0
  ) || []

  // Prendi i primi 2
  const examples = beforeAfterItems.slice(0, 2)

  return (
    <section className="relative py-24 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Trasformazioni Prima e Dopo
          </h2>
          <p className="section-subheading mx-auto">
            Vedi come l'AI trasforma qualsiasi spazio in pochi secondi
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="relative aspect-[4/3] bg-slate-100 animate-pulse" />
                <div className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : examples.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {examples.map((item) => (
              <Link
                key={item.id}
                href={item.share_url}
                className="group block bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3]">
                  <BeforeAfterSlider
                    beforeImage={item.input_urls![0]}
                    afterImage={item.output_urls![0]}
                    beforeLabel="Prima"
                    afterLabel="Dopo"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.room_type || 'Stanza'}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Trasformazione in stile {item.style_preset || 'Moderno'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Placeholder quando non ci sono esempi reali */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <p className="text-slate-400 text-sm">Esempio trasformazione</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {i === 0 ? 'Salotto Moderno' : 'Camera da Letto'}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {i === 0 
                      ? 'Trasformazione in stile Scandinavian con arredi minimalisti'
                      : 'Redesign in stile Luxury con dettagli raffinati'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/app/photo-makeover" className="btn-primary inline-flex items-center gap-2">
            Prova Gratis
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
