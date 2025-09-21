import React from 'react'
import { VirtualizedPhotoGrid } from './VirtualizedPhotoGrid'
import { useVirtualizedPhotoGallery } from '../hooks/useVirtualizedPhotoGallery'
import { ErrorBoundary } from './ErrorBoundary'

interface VirtualizedGalleryProps {
  className?: string
}

export const VirtualizedGallery: React.FC<VirtualizedGalleryProps> = ({ className = '' }) => {
  const { photos, isLoading, error, handleLoadMore, handleLoadPrevious } =
    useVirtualizedPhotoGallery()

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading photos</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`virtualized-gallery-wrapper ${className}`}>
        <VirtualizedPhotoGrid
          photos={photos}
          onLoadMore={handleLoadMore}
          onLoadPrevious={handleLoadPrevious}
          isLoading={isLoading}
          loadMoreThreshold={800}
        />

        {photos.length === 0 && !isLoading && (
          <div className="empty-state">
            <p>No photos to display</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
