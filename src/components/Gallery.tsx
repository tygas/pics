import React from 'react'
import { PhotoGrid } from './PhotoGrid'
import { ErrorState, LoadingState } from './LoadingStates'
import { ErrorBoundary } from './ErrorBoundary'
import { usePhotoGallery } from '../hooks/usePhotoGallery'

interface GalleryProps {
  className?: string
}

const Gallery: React.FC<GalleryProps> = ({ className = '' }) => {
  const { photos, isLoading, error, containerRef } = usePhotoGallery()

  const isInitialLoading = isLoading && photos.length === 0

  if (isInitialLoading) {
    return <LoadingState message="Loading photo gallery..." />
  }

  if (error && photos.length === 0) {
    return <ErrorState error={error} />
  }

  return (
    <ErrorBoundary>
      <div ref={containerRef} className={`gallery-container ${className}`}>
        <PhotoGrid photos={photos} />
        {isLoading && photos.length > 0 && (
          <div className="loading-more">Loading more photos...</div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default Gallery
