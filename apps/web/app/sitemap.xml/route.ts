import { NextResponse } from 'next/server'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/constants'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-homedesigner.com'

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

export async function GET() {
  const now = new Date().toISOString()
  const routes: Array<{
    url: string
    lastModified: string
    changeFrequency: string
    priority: number
  }> = [
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

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${escapeXml(route.url)}</loc>
    <lastmod>${escapeXml(route.lastModified)}</lastmod>
    <changefreq>${escapeXml(route.changeFrequency)}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
