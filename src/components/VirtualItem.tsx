import React from 'react'
import type { Photo } from '../types/photo'

interface VirtualItemProps {
  photo: Photo
  globalIndex: number
}

export const VirtualItem: React.FC<VirtualItemProps> = ({ photo, globalIndex }) => (
  <div className="virtual-photo-card">
    <img
      src={photo.download_url}
      alt={`Photo by ${photo.author}`}
      loading={globalIndex < 20 ? 'eager' : 'lazy'}
      className="photo-img"
    />
    <div className="photo-author">{photo.author}</div>
  </div>
)
