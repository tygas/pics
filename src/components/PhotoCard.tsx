import React, { memo } from 'react'
import type { Photo } from '../types/photo'

interface PhotoCardProps {
  photo: Photo
  loading?: 'lazy' | 'eager'
  className?: string
}

export const PhotoCard: React.FC<PhotoCardProps> = memo(
  ({ photo, loading = 'lazy', className = '' }) => {
    return (
      <div className={`photo-card ${className}`}>
        <img
          className="photo-img"
          src={photo.download_url}
          alt={`Photo by ${photo.author}`}
          loading={loading}
          width={photo.width}
          height={photo.height}
        />
        <div className="photo-author">
          {photo.id} {photo.author}
        </div>
      </div>
    )
  }
)

PhotoCard.displayName = 'PhotoCard'
