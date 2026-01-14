'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { cn } from '@/lib/utils'

interface ImageCompareSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'auto'
}

export function ImageCompareSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  aspectRatio = 'video',
}: ImageCompareSliderProps) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    auto: '',
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        aspectClasses[aspectRatio],
        className
      )}
    >
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt="Before"
            style={{ objectFit: 'cover' }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt="After"
            style={{ objectFit: 'cover' }}
          />
        }
        handle={
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-1 h-full bg-white shadow-lg" />
            <div className="absolute w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-gray-400 rounded" />
                <div className="w-0.5 h-4 bg-gray-400 rounded" />
              </div>
            </div>
          </div>
        }
        style={{ height: '100%' }}
      />

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
        <span className="text-sm font-medium text-white">{beforeLabel}</span>
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
        <span className="text-sm font-medium text-white">{afterLabel}</span>
      </div>
    </div>
  )
}
