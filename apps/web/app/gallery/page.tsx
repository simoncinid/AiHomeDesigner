'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Filter } from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkeletonImage } from '@/components/ui/Skeleton'
import { apiClient, type GalleryItem } from '@/lib/api'
import { ROOM_TYPES, STYLE_PRESETS } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Static placeholder images for gallery
const placeholderGallery: GalleryItem[] = [
  {
    id: '1',
    shareId: 'gallery-1',
    kind: 'edit',
    outputUrls: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    roomType: 'living_room',
    stylePreset: 'modern',
    shareUrl: '/gallery/living_room/modern',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    shareId: 'gallery-2',
    kind: 't2i',
    outputUrls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    roomType: 'bedroom',
    stylePreset: 'scandinavian',
    shareUrl: '/gallery/bedroom/scandinavian',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    shareId: 'gallery-3',
    kind: 'edit',
    outputUrls: ['https://images.unsplash.com/photo-1600210492486-275a8ee65a7c?w=800'],
    roomType: 'kitchen',
    stylePreset: 'minimalist',
    shareUrl: '/gallery/kitchen/minimalist',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    shareId: 'gallery-4',
    kind: 't2i',
    outputUrls: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'],
    roomType: 'bathroom',
    stylePreset: 'luxury',
    shareUrl: '/gallery/bathroom/luxury',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    shareId: 'gallery-5',
    kind: 'edit',
    outputUrls: ['https://images.unsplash.com/photo-1600573472591-ee6c4e3d5e5a?w=800'],
    roomType: 'dining_room',
    stylePreset: 'industrial',
    shareUrl: '/gallery/living_room/industrial',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    shareId: 'gallery-6',
    kind: 't2i',
    outputUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    roomType: 'living_room',
    stylePreset: 'bohemian',
    shareUrl: '/gallery/living_room/bohemian',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    shareId: 'gallery-7',
    kind: 'edit',
    outputUrls: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'],
    roomType: 'bedroom',
    stylePreset: 'coastal',
    shareUrl: '/gallery/bedroom/bohemian',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    shareId: 'gallery-8',
    kind: 't2i',
    outputUrls: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
    roomType: 'office',
    stylePreset: 'modern',
    shareUrl: '/gallery/office/modern',
    createdAt: new Date().toISOString(),
  },
]

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(placeholderGallery)
  const [loading, setLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  const filteredItems = items.filter((item) => {
    if (selectedRoom && item.roomType !== selectedRoom) return false
    if (selectedStyle && item.stylePreset !== selectedStyle) return false
    return true
  })

  // Generate SEO-friendly URL for gallery item
  const getItemUrl = (item: GalleryItem) => {
    if (item.roomType && item.stylePreset) {
      return `/gallery/${item.roomType}/${item.stylePreset}`
    }
    return item.shareUrl
  }

  return (
    <MarketingLayout>
      <section className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="heading-1 text-foreground mb-4">
              Design Gallery
            </h1>
            <p className="body-large max-w-2xl mx-auto mb-8">
              Get inspired by stunning room transformations created with AI Home Designer
            </p>
            <Button asChild>
              <Link href="/app/makeover">
                <Sparkles className="h-4 w-4" />
                Create your own
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-foreground-muted" />
              <span className="text-sm font-medium text-foreground">Filter by:</span>
            </div>

            {/* Room type filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedRoom(null)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  !selectedRoom
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                )}
              >
                All rooms
              </button>
              {ROOM_TYPES.slice(0, 6).map((room) => (
                <button
                  key={room.value}
                  onClick={() => setSelectedRoom(selectedRoom === room.value ? null : room.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedRoom === room.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                  )}
                >
                  {room.label}
                </button>
              ))}
            </div>

            {/* Style filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStyle(null)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  !selectedStyle
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                )}
              >
                All styles
              </button>
              {STYLE_PRESETS.slice(0, 6).map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(selectedStyle === style.value ? null : style.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedStyle === style.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-secondary text-foreground-muted hover:bg-surface-tertiary'
                  )}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Gallery grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={getItemUrl(item)}>
                  <Card variant="interactive" padding="none" className="overflow-hidden group">
                    <div className="aspect-[4/3] relative bg-surface-secondary">
                      {item.outputUrls?.[0] && (
                        <Image
                          src={item.outputUrls[0]}
                          alt={`${item.stylePreset} ${item.roomType?.replace('_', ' ')} design`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" fullWidth>
                          View details
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm" className="capitalize">
                          {item.roomType?.replace('_', ' ')}
                        </Badge>
                        <Badge variant="primary" size="sm" className="capitalize">
                          {item.stylePreset}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-foreground-muted mb-4">No designs match your filters</p>
              <Button variant="secondary" onClick={() => { setSelectedRoom(null); setSelectedStyle(null); }}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Browse by category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="heading-3 text-foreground text-center mb-8">
              Browse by Room Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ROOM_TYPES.slice(0, 8).map((room) => (
                <Link key={room.value} href={`/rooms/${room.value}`}>
                  <Card variant="interactive" padding="lg" className="text-center h-full">
                    <h3 className="font-semibold text-foreground mb-1">{room.label}</h3>
                    <p className="text-sm text-foreground-muted">View all styles</p>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="heading-3 text-foreground text-center mb-8">
              Browse by Style
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {STYLE_PRESETS.slice(0, 10).map((style) => (
                <Link key={style.value} href={`/styles/${style.value}`}>
                  <Card variant="interactive" padding="lg" className="text-center h-full">
                    <h3 className="font-semibold text-foreground mb-1">{style.label}</h3>
                    <p className="text-xs text-foreground-muted">{style.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  )
}
