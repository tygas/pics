import React from 'react'
import type { PhotoT } from '../api/picsum.ts'

interface VirtualItemProps {
  photo: PhotoT
  globalIndex: number
  rowTotalWidth?: number
  isWideRow?: boolean
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
