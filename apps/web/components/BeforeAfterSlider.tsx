'use client'

import { useState, useRef, useEffect } from 'react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = 'Prima',
  afterLabel = 'Dopo'
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-2xl group"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Before Image (Background) */}
      <div className="absolute inset-0">
        <img 
          src={beforeImage} 
          alt="Before" 
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Before Label */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-slate-900/80 backdrop-blur-sm text-white font-bold rounded-lg shadow-lg">
          {beforeLabel}
        </div>
      </div>

      {/* After Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* After Label */}
        <div className="absolute top-4 right-4 px-4 py-2 bg-emerald-600/90 backdrop-blur-sm text-white font-bold rounded-lg shadow-lg">
          {afterLabel}
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize transition-transform group-hover:scale-110">
          <div className="flex gap-1">
            <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
            <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Instruction Overlay (appears on first hover) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
          <p className="text-slate-800 font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Trascina per confrontare
          </p>
        </div>
      </div>
    </div>
  )
}
