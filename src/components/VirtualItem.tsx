import React from 'react'
import { PAGE_SIZE, type PhotoT } from '../api/picsum.ts'

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
      loading={globalIndex < PAGE_SIZE ? 'eager' : 'lazy'}
      className="photo-img"
    />
    <div className="photo-author">{photo.author}</div>
  </div>
)
