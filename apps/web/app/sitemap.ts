import { MetadataRoute } from 'next'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/constants'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Room pages
  ROOM_TYPES.forEach((room) => {
    routes.push({
      url: `${SITE_URL}/rooms/${room.value}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Style pages
  STYLE_PRESETS.forEach((style) => {
    routes.push({
      url: `${SITE_URL}/styles/${style.value.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Ideas pages (room + style combinations)
  ROOM_TYPES.forEach((room) => {
    STYLE_PRESETS.forEach((style) => {
      routes.push({
        url: `${SITE_URL}/ideas/${room.value}/${style.value.toLowerCase()}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  })

  // Gallery detail pages (room + style combinations for SEO)
  ROOM_TYPES.forEach((room) => {
    STYLE_PRESETS.forEach((style) => {
      routes.push({
        url: `${SITE_URL}/gallery/${room.value}/${style.value.toLowerCase()}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })

  return routes
}
