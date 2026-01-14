import { Metadata } from 'next'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/constants'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return STYLE_PRESETS.map((style) => ({
    style: style.value.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: { params: { style: string } }): Promise<Metadata> {
  const style = params.style
  const styleName = style.charAt(0).toUpperCase() + style.slice(1)
  
  return {
    title: `${styleName} Interior Design - AI Home Designer`,
    description: `Discover ${styleName.toLowerCase()} interior design ideas for every room. AI-powered design transformations in ${styleName.toLowerCase()} style.`,
    openGraph: {
      title: `${styleName} Interior Design`,
      description: `AI-powered ${styleName.toLowerCase()} design inspiration`,
    },
  }
}

export default function StylePage({ params }: { params: { style: string } }) {
  const styleLower = params.style.toLowerCase()
  const stylePreset = STYLE_PRESETS.find(s => s.value.toLowerCase() === styleLower)
  
  if (!stylePreset) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">{stylePreset.label} Interior Design</h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore {stylePreset.label.toLowerCase()} design ideas for every room in your home. Get AI-powered design transformations.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {ROOM_TYPES.map((room) => (
          <Link
            key={room.value}
            href={`/ideas/${room.value}/${styleLower}`}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{stylePreset.label} {room.label}</h2>
            <p className="text-gray-600">Explore {stylePreset.label.toLowerCase()} design ideas for {room.label.toLowerCase()}</p>
          </Link>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Create {stylePreset.label} Designs?</h2>
        <Link
          href="/app/room-generator"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
        >
          Get Started Free
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `What is ${stylePreset.label.toLowerCase()} style?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `${stylePreset.label} style is characterized by [add description]. Our AI can transform any room into ${stylePreset.label.toLowerCase()} design.`,
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
