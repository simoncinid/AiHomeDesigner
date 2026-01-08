import { Metadata } from 'next'
import { ROOM_TYPES, STYLE_PRESETS } from '@ai-homedesigner/shared'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return ROOM_TYPES.map((room) => ({
    roomType: room,
  }))
}

export async function generateMetadata({ params }: { params: { roomType: string } }): Promise<Metadata> {
  const roomType = params.roomType
  const roomName = roomType.charAt(0).toUpperCase() + roomType.slice(1)
  
  return {
    title: `${roomName} Design Ideas - AI Home Designer`,
    description: `Discover AI-powered ${roomType} design ideas. Transform your ${roomType} with modern, Scandinavian, Japandi, and more styles.`,
    openGraph: {
      title: `${roomName} Design Ideas`,
      description: `AI-powered ${roomType} design inspiration`,
    },
  }
}

export default function RoomPage({ params }: { params: { roomType: string } }) {
  const roomType = params.roomType
  if (!ROOM_TYPES.includes(roomType as any)) {
    notFound()
  }

  const roomName = roomType.charAt(0).toUpperCase() + roomType.slice(1)

  return (
    <div className="min-h-screen py-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">{roomName} Design Ideas</h1>
      <p className="text-lg text-gray-600 mb-8">
        Transform your {roomType} with AI-powered interior design. Choose from 11+ styles and get instant design variations.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {STYLE_PRESETS.map((style) => (
          <Link
            key={style}
            href={`/ideas/${roomType}/${style.toLowerCase()}`}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{style} {roomName}</h2>
            <p className="text-gray-600">Explore {style.toLowerCase()} design ideas for your {roomType}</p>
          </Link>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Transform Your {roomName}?</h2>
        <Link
          href="/app/photo-makeover"
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
                name: `How do I redesign my ${roomType}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Upload a photo of your ${roomType}, choose a style, and AI will generate 4 design variations in seconds.`,
                },
              },
              {
                '@type': 'Question',
                name: `What styles are available for ${roomType} design?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `We offer 11+ styles including Modern, Scandinavian, Japandi, Minimal, Industrial, Mid-century, Boho, Coastal, Farmhouse, Luxury, and Rustic.`,
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
