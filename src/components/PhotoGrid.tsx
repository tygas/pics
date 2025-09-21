import React, { useRef, useEffect } from 'react'
import { PhotoCard } from './PhotoCard'
import type { Photo } from '../types/photo'
import './PhotoGrid.css'

interface PhotoGridProps {
  photos: Photo[]
  className?: string
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, className = '' }) => {
  const gridRef = useRef<HTMLDivElement>(null)

  // Smooth entrance animation
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || photos.length === 0) return

    // Initial state
    grid.style.transform = 'translateY(20px)'
    grid.style.opacity = '0'

    // Animate in
    const timer = setTimeout(() => {
      grid.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out'
      grid.style.transform = 'translateY(0)'
      grid.style.opacity = '1'
    }, 50)

    return () => clearTimeout(timer)
  }, [photos.length])

  return (
    <div
      ref={gridRef}
      className={`photo-grid-container ${className}`}
      role="grid"
      aria-label="Photo gallery"
    >
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} loading="lazy" />
      ))}
    </div>
  )
}

export default PhotoGrid
