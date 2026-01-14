import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Sparkles, Download, Share2 } from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/constants'

interface PageProps {
  params: { roomType: string; style: string }
}

// Sample images for SEO pages (in production, these would come from database)
const sampleImages: Record<string, Record<string, string[]>> = {
  living_room: {
    modern: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'],
    scandinavian: ['https://images.unsplash.com/photo-1600210492486-275a8ee65a7c?w=1200'],
    minimalist: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'],
    industrial: ['https://images.unsplash.com/photo-1600573472591-ee6c4e3d5e5a?w=1200'],
    bohemian: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200'],
    luxury: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200'],
  },
  bedroom: {
    modern: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200'],
    scandinavian: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200'],
    minimalist: ['https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200'],
    bohemian: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200'],
    luxury: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200'],
  },
  kitchen: {
    modern: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200'],
    scandinavian: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200'],
    minimalist: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200'],
    industrial: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'],
  },
  bathroom: {
    modern: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200'],
    minimalist: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200'],
    luxury: ['https://images.unsplash.com/photo-1600573472591-ee6c4e3d5e5a?w=1200'],
  },
  office: {
    modern: ['https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=1200'],
    minimalist: ['https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200'],
    scandinavian: ['https://images.unsplash.com/photo-1600494448655-ae04b18eda99?w=1200'],
  },
}

// Generate static paths for all room/style combinations
export async function generateStaticParams() {
  const params: { roomType: string; style: string }[] = []
  
  for (const room of ROOM_TYPES) {
    for (const style of STYLE_PRESETS) {
      params.push({
        roomType: room.value,
        style: style.value,
      })
    }
  }
  
  return params
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const room = ROOM_TYPES.find(r => r.value === params.roomType)
  const style = STYLE_PRESETS.find(s => s.value === params.style)
  
  if (!room || !style) {
    return { title: 'Design Not Found' }
  }
  
  const title = `${style.label} ${room.label} Design Ideas | AI Home Designer`
  const description = `Discover stunning ${style.label.toLowerCase()} ${room.label.toLowerCase()} designs created with AI. Get inspired and transform your ${room.label.toLowerCase()} with ${style.label.toLowerCase()} interior design. ${style.description}`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: sampleImages[params.roomType]?.[params.style] || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/gallery/${params.roomType}/${params.style}`,
    },
  }
}

export default function GalleryDetailPage({ params }: PageProps) {
  const room = ROOM_TYPES.find(r => r.value === params.roomType)
  const style = STYLE_PRESETS.find(s => s.value === params.style)
  
  if (!room || !style) {
    notFound()
  }
  
  const images = sampleImages[params.roomType]?.[params.style] || []
  const hasImages = images.length > 0
  
  // Find related styles for the same room
  const relatedStyles = STYLE_PRESETS.filter(s => 
    s.value !== params.style && sampleImages[params.roomType]?.[s.value]
  ).slice(0, 4)
  
  // Find same style in different rooms
  const relatedRooms = ROOM_TYPES.filter(r => 
    r.value !== params.roomType && sampleImages[r.value]?.[params.style]
  ).slice(0, 4)

  return (
    <MarketingLayout>
      <article className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-foreground-muted">
              <li>
                <Link href="/gallery" className="hover:text-foreground transition-colors">
                  Gallery
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/rooms/${params.roomType}`} className="hover:text-foreground transition-colors capitalize">
                  {room.label}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground capitalize">{style.label}</li>
            </ol>
          </nav>
          
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="default" size="lg">{room.label}</Badge>
              <Badge variant="primary" size="lg">{style.label} Style</Badge>
            </div>
            <h1 className="heading-1 text-foreground mb-4">
              {style.label} {room.label} Design Ideas
            </h1>
            <p className="body-large max-w-3xl mx-auto">
              Explore beautiful {style.label.toLowerCase()} {room.label.toLowerCase()} designs created with AI. 
              {style.description}. Get inspired and create your own stunning interior design.
            </p>
          </header>
          
          {/* Main image */}
          {hasImages ? (
            <div className="max-w-4xl mx-auto mb-12">
              <Card variant="default" padding="none" className="overflow-hidden">
                <div className="aspect-[16/10] relative bg-surface-secondary">
                  <Image
                    src={images[0]}
                    alt={`${style.label} ${room.label} Interior Design`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Card>
              
              {/* Actions */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button variant="secondary" asChild>
                  <a href={images[0]} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
                <Button variant="secondary">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="p-12 text-center">
                <p className="text-foreground-muted mb-4">
                  No example images available for this combination yet.
                </p>
                <Button asChild>
                  <Link href="/app/makeover">
                    <Sparkles className="h-4 w-4" />
                    Create your own
                  </Link>
                </Button>
              </Card>
            </div>
          )}
          
          {/* Content section for SEO */}
          <section className="max-w-3xl mx-auto prose prose-lg dark:prose-invert mb-16">
            <h2>About {style.label} {room.label} Design</h2>
            <p>
              The {style.label.toLowerCase()} style brings a unique aesthetic to your {room.label.toLowerCase()}. 
              {getStyleDescription(style.value, room.value)}
            </p>
            
            <h3>Key Features of {style.label} Design</h3>
            <ul>
              {getStyleFeatures(style.value).map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            
            <h3>How to Achieve This Look</h3>
            <p>
              Transform your {room.label.toLowerCase()} into a stunning {style.label.toLowerCase()} space 
              using AI Home Designer. Simply upload a photo of your current room, select the {style.label} 
              style, and watch as AI creates a beautiful redesign in seconds.
            </p>
          </section>
          
          {/* CTA */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card variant="gradient" padding="lg" className="text-center bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
              <h2 className="heading-3 text-foreground mb-2">
                Create Your Own {style.label} {room.label}
              </h2>
              <p className="text-foreground-muted mb-6">
                Transform your space with AI-powered interior design. Get 1 free design per day.
              </p>
              <Button size="lg" asChild>
                <Link href="/app/makeover">
                  <Sparkles className="h-5 w-5" />
                  Start Designing Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </Card>
          </div>
          
          {/* Related styles */}
          {relatedStyles.length > 0 && (
            <section className="mb-16">
              <h2 className="heading-3 text-foreground mb-6">
                More {room.label} Styles
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedStyles.map((s) => (
                  <Link key={s.value} href={`/gallery/${params.roomType}/${s.value}`}>
                    <Card variant="interactive" padding="none" className="overflow-hidden group">
                      <div className="aspect-[4/3] relative bg-surface-secondary">
                        {sampleImages[params.roomType]?.[s.value]?.[0] && (
                          <Image
                            src={sampleImages[params.roomType][s.value][0]}
                            alt={`${s.label} ${room.label}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">{s.label}</h3>
                        <p className="text-sm text-foreground-muted">{room.label}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          {/* Same style, different rooms */}
          {relatedRooms.length > 0 && (
            <section>
              <h2 className="heading-3 text-foreground mb-6">
                {style.label} Style in Other Rooms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedRooms.map((r) => (
                  <Link key={r.value} href={`/gallery/${r.value}/${params.style}`}>
                    <Card variant="interactive" padding="none" className="overflow-hidden group">
                      <div className="aspect-[4/3] relative bg-surface-secondary">
                        {sampleImages[r.value]?.[params.style]?.[0] && (
                          <Image
                            src={sampleImages[r.value][params.style][0]}
                            alt={`${style.label} ${r.label}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">{r.label}</h3>
                        <p className="text-sm text-foreground-muted">{style.label} Style</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </MarketingLayout>
  )
}

function getStyleDescription(styleValue: string, roomValue: string): string {
  const descriptions: Record<string, string> = {
    modern: `Modern design emphasizes clean lines, minimalism, and functional furniture. In your ${roomValue.replace('_', ' ')}, this translates to sleek surfaces, neutral colors with bold accents, and an open, airy feel that maximizes both style and usability.`,
    scandinavian: `Scandinavian design brings Nordic warmth and simplicity to your space. Expect light wood tones, cozy textiles, and a bright, welcoming atmosphere that balances form and function beautifully.`,
    minimalist: `Minimalist design strips away the unnecessary to reveal pure, functional beauty. Clean surfaces, limited color palettes, and thoughtful furniture placement create a serene, uncluttered environment.`,
    industrial: `Industrial design celebrates raw, unfinished materials like exposed brick, metal fixtures, and reclaimed wood. This style brings urban character and authentic texture to your space.`,
    bohemian: `Bohemian design embraces eclectic patterns, rich colors, and globally-inspired decor. Layered textiles, plants, and unique accessories create a warm, personalized atmosphere.`,
    luxury: `Luxury design combines premium materials, sophisticated color palettes, and elegant furnishings. Rich textures, metallic accents, and statement pieces create an opulent, refined space.`,
    coastal: `Coastal design brings the beach indoors with light blues, sandy neutrals, and natural textures. This relaxed style creates a breezy, vacation-like atmosphere year-round.`,
    traditional: `Traditional design honors classic aesthetics with elegant furniture, rich wood tones, and timeless patterns. Symmetry and refined details create a warm, distinguished space.`,
    mid_century: `Mid-century modern design features organic curves, bold colors, and iconic furniture from the 1950s-60s. This retro style brings both nostalgia and timeless appeal.`,
    japanese: `Japanese design emphasizes harmony, natural materials, and mindful simplicity. Clean lines, neutral tones, and connection to nature create a peaceful, zen-like environment.`,
  }
  return descriptions[styleValue] || descriptions.modern
}

function getStyleFeatures(styleValue: string): string[] {
  const features: Record<string, string[]> = {
    modern: ['Clean, straight lines', 'Neutral color palette with bold accents', 'Open floor plans', 'Minimalist furniture', 'Large windows and natural light'],
    scandinavian: ['Light wood tones', 'White and neutral colors', 'Cozy textiles like wool and cotton', 'Functional, simple furniture', 'Indoor plants and natural elements'],
    minimalist: ['Clutter-free spaces', 'Monochromatic color schemes', 'Essential furniture only', 'Hidden storage solutions', 'Quality over quantity'],
    industrial: ['Exposed brick and concrete', 'Metal fixtures and accents', 'Reclaimed wood elements', 'Open ductwork and pipes', 'Vintage industrial lighting'],
    bohemian: ['Layered patterns and textures', 'Global-inspired decor', 'Abundant plants', 'Mix of furniture styles', 'Rich, warm color palette'],
    luxury: ['High-end materials', 'Statement lighting fixtures', 'Rich textures like velvet and silk', 'Metallic accents', 'Custom furniture pieces'],
    coastal: ['Blue and white color scheme', 'Natural fiber textiles', 'Light, weathered wood', 'Nautical accents', 'Airy, open spaces'],
    traditional: ['Symmetrical arrangements', 'Classic furniture profiles', 'Rich wood finishes', 'Elegant window treatments', 'Refined accessories'],
    mid_century: ['Organic, curved shapes', 'Bold accent colors', 'Iconic designer furniture', 'Mix of materials', 'Retro patterns'],
    japanese: ['Natural materials', 'Neutral color palette', 'Low furniture profiles', 'Sliding doors and screens', 'Zen garden elements'],
  }
  return features[styleValue] || features.modern
}
