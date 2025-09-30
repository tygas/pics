import React from 'react'
import { VirtualItem } from './VirtualItem'
import { LoadingIndicator } from './LoadingIndicator'
import './VirtualizedPhotoGrid.css'
import type { PhotoT } from '../api/picsum'
import { useVirtualizedRows } from '../hooks/useVirtualizedRows'

interface VirtualizedPhotoGridProps {
  photos: PhotoT[]
  onLoadMore: () => void
  onLoadPrevious: () => void
  isLoading: boolean
  loadMoreThreshold?: number
  rowHeight?: number
}

const DEFAULT_LOAD_MORE_THRESHOLD = 800
const DEFAULT_ROW_HEIGHT = 210

export const VirtualizedPhotoGrid: React.FC<VirtualizedPhotoGridProps> = ({
  photos,
  onLoadMore,
  onLoadPrevious,
  isLoading,
  loadMoreThreshold = DEFAULT_LOAD_MORE_THRESHOLD,
  rowHeight = DEFAULT_ROW_HEIGHT,
}) => {
  const { containerRef, visibleRows, totalHeight, handleScroll } = useVirtualizedRows({
    photos,
    rowHeight,
    loadMoreThreshold,
    isLoading,
    onLoadMore,
    onLoadPrevious,
  })

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="virtualized-photo-grid virtualized-photo-grid--empty">
        <div className="empty-state">No photos to display</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="virtualized-photo-grid"
      onScroll={handleScroll}
      role="grid"
      aria-label="Photo gallery"
    >
      <div className="virtual-container" style={{ height: totalHeight }} role="presentation">
        {visibleRows.map((row) => (
          <div
            key={row.index}
            className="virtual-row"
            style={{
              top: row.top,
              height: rowHeight,
            }}
            role="row"
          >
            {row.photos.map((photo, photoIndex) => (
              <VirtualItem key={photo.id} photo={photo} globalIndex={row.startIndex + photoIndex} />
            ))}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="loading-container" role="status" aria-live="polite">
          <LoadingIndicator totalSize={100} />
        </div>
      )}
    </div>
  )
}
