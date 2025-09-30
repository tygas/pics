import React, { useState } from 'react'
import { PAGE_SIZE, type PhotoT } from '../api/picsum.ts'
import { useIntersectionVisible } from '../hooks/useIntersectionVisible'

interface VirtualItemProps {
  photo: PhotoT
  globalIndex: number
  isWideRow?: boolean
}

const DISPLAY_HEIGHT = 200

export const VirtualItem: React.FC<VirtualItemProps> = ({ photo, globalIndex }) => {
  const aspectRatio = photo.width / photo.height
  const displayWidth = Math.round(DISPLAY_HEIGHT * aspectRatio)

  const [isLoaded, setIsLoaded] = useState(false)
  const [imgRef, isVisible] = useIntersectionVisible<HTMLDivElement>({
    root: null,
    rootMargin: '200px',
    threshold: 0.01,
  })

  return (
    <div
      className="virtual-photo-card"
      style={{ width: displayWidth, height: DISPLAY_HEIGHT }}
      ref={imgRef}
    >
      {!isLoaded && <div className="photo-placeholder" />}
      <img
        src={isVisible ? photo.download_url : undefined}
        alt={`Photo by ${photo.author}`}
        loading={globalIndex < PAGE_SIZE ? 'eager' : 'lazy'}
        className="photo-img"
        onLoad={() => setIsLoaded(true)}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      />
      <div className="photo-author">{photo.author}</div>
    </div>
  )
}
