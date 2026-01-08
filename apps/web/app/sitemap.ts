import { MetadataRoute } from 'next'
import { ROOM_TYPES, STYLE_PRESETS } from '@ai-homedesigner/shared'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Room pages
  ROOM_TYPES.forEach((room) => {
    routes.push({
      url: `${SITE_URL}/rooms/${room}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Style pages
  STYLE_PRESETS.forEach((style) => {
    routes.push({
      url: `${SITE_URL}/styles/${style.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Ideas pages (room + style combinations)
  ROOM_TYPES.forEach((room) => {
    STYLE_PRESETS.forEach((style) => {
      routes.push({
        url: `${SITE_URL}/ideas/${room}/${style.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  })

  return routes
}
