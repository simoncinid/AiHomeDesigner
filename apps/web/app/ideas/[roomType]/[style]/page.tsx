import { Metadata } from 'next'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/shared'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const params: Array<{ roomType: string; style: string }> = []
  ROOM_TYPES.forEach((room) => {
    STYLE_PRESETS.forEach((style) => {
      params.push({
        roomType: room,
        style: style.toLowerCase(),
      })
    })
  })
  return params
}

export async function generateMetadata({ params }: { params: { roomType: string; style: string } }): Promise<Metadata> {
  const { roomType, style } = params
  const roomName = roomType.charAt(0).toUpperCase() + roomType.slice(1)
  const styleName = style.charAt(0).toUpperCase() + style.slice(1)
  
  return {
    title: `${styleName} ${roomName} Design Ideas - AI Home Designer`,
    description: `${styleName} ${roomName} design ideas and inspiration. Get AI-powered ${roomType} makeovers in ${styleName.toLowerCase()} style.`,
    openGraph: {
      title: `${styleName} ${roomName} Design Ideas`,
      description: `AI-powered ${styleName.toLowerCase()} ${roomType} design inspiration`,
    },
  }
}

// Template content for ideas pages
const PROMPT_IDEAS = [
  'Add a statement lighting fixture',
  'Incorporate natural materials',
  'Create a focal point with artwork',
  'Use plants to add life',
  'Optimize storage solutions',
  'Choose a cohesive color palette',
  'Layer textures for depth',
  'Balance open and closed storage',
  'Add personal touches',
  'Consider traffic flow',
]

const COLOR_PALETTES = [
  'Neutral tones with accent colors',
  'Warm earth tones',
  'Cool blues and grays',
  'Monochromatic scheme',
  'Bold contrasting colors',
]

const COMMON_MISTAKES = [
  'Overcrowding the space',
  'Ignoring natural light',
  'Mismatched furniture scales',
  'Poor lighting plan',
  'Forgetting about storage',
]

export default function IdeasPage({ params }: { params: { roomType: string; style: string } }) {
  const { roomType, style } = params
  
  if (!ROOM_TYPES.includes(roomType as any)) {
    notFound()
  }
  
  const stylePreset = STYLE_PRESETS.find(s => s.toLowerCase() === style.toLowerCase())
  if (!stylePreset) {
    notFound()
  }

  const roomName = roomType.charAt(0).toUpperCase() + roomType.slice(1)
  const styleName = stylePreset

  return (
    <div className="min-h-screen py-12 container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{styleName} {roomName} Design Ideas</h1>
      <p className="text-lg text-gray-600 mb-8">
        Transform your {roomType} with {styleName.toLowerCase()} style. Get AI-powered design variations and inspiration.
      </p>

      <div className="prose max-w-none mb-12">
        <p>
          Creating a {styleName.toLowerCase()} {roomType} design combines functionality with aesthetic appeal. 
          This style emphasizes [characteristics of the style]. Whether you're starting from scratch or 
          redesigning an existing space, these ideas will help you achieve a cohesive {styleName.toLowerCase()} look.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10 Design Prompt Ideas</h2>
        <ul className="list-disc pl-6 space-y-2">
          {PROMPT_IDEAS.map((idea, idx) => (
            <li key={idx}>{idea}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Recommended Color Palettes</h2>
        <ul className="list-disc pl-6 space-y-2">
          {COLOR_PALETTES.map((palette, idx) => (
            <li key={idx}>{palette}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Common Mistakes to Avoid</h2>
        <ul className="list-disc pl-6 space-y-2">
          {COMMON_MISTAKES.map((mistake, idx) => (
            <li key={idx}>{mistake}</li>
          ))}
        </ul>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Ready to Create Your {styleName} {roomName}?</h2>
        <p className="text-gray-700 mb-6">
          Upload a photo of your {roomType} and get 4 AI-powered design variations in {styleName.toLowerCase()} style.
        </p>
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
            '@type': 'Article',
            headline: `${styleName} ${roomName} Design Ideas`,
            description: `Design ideas and inspiration for ${styleName.toLowerCase()} ${roomType} design`,
            author: {
              '@type': 'Organization',
              name: 'AI Home Designer',
            },
          }),
        }}
      />
    </div>
  )
}
