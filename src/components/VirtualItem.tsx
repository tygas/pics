import React, { useState } from 'react'
import { PAGE_SIZE, type PhotoT } from '../api/picsum.ts'

interface VirtualItemProps {
  photo: PhotoT
  globalIndex: number
  rowTotalWidth?: number
  isWideRow?: boolean
}

const DISPLAY_HEIGHT = 200

export const VirtualItem: React.FC<VirtualItemProps> = ({ photo, globalIndex }) => {
  const aspectRatio = photo.width / photo.height
  const displayWidth = Math.round(DISPLAY_HEIGHT * aspectRatio)

  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="virtual-photo-card" style={{ width: displayWidth, height: DISPLAY_HEIGHT }}>
      {!isLoaded && <div className="photo-placeholder" />}
      <img
        src={photo.download_url}
        alt={`Photo by ${photo.author}`}
        loading={globalIndex < PAGE_SIZE ? 'eager' : 'lazy'}
        className="photo-img"
        onLoad={() => setIsLoaded(true)}
      />
      <div className="photo-author">{photo.author}</div>
    </div>
  )
}
