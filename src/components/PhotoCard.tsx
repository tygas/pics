import React, { useState } from 'react'
import { PAGE_SIZE, type PhotoT } from '../api/picsum.ts'

interface VirtualItemProps {
  photo: PhotoT
  globalIndex: number
  isWideRow?: boolean
  isVisible: boolean
}

const DISPLAY_HEIGHT = 200

export const PhotoCard: React.FC<VirtualItemProps> = ({ photo, globalIndex, isVisible }) => {
  const aspectRatio = photo.width / photo.height
  const displayWidth = Math.round(DISPLAY_HEIGHT * aspectRatio)

  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="virtual-photo-card" style={{ width: displayWidth, height: DISPLAY_HEIGHT }}>
      {!isLoaded && <div className="photo-placeholder" />}
      <img
        src={isVisible ? photo.download_url : undefined}
        alt={`Photo by ${photo.author || 'Unknown Author'}`}
        loading={globalIndex < PAGE_SIZE ? 'eager' : 'lazy'}
        className="photo-img"
        onLoad={() => setIsLoaded(true)}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      />
      <div className="photo-author">{photo.author}</div>
    </div>
  )
}
