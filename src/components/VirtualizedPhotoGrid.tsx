import React, { memo } from 'react'
import { PhotoCard } from './PhotoCard.tsx'
import { LoadingIndicator } from './LoadingIndicator'
import './VirtualizedPhotoGrid.css'
import type { PhotoT } from '../api/picsum'
import { useVirtualizedRows, type VirtualRow } from '../hooks/useVirtualizedRows'
import { useIntersectionVisible } from '../hooks/useIntersectionVisible'

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

const MemoVirtualItem = memo(PhotoCard)
const MemoVirtualRow: React.FC<{ row: VirtualRow; rowHeight: number }> = memo(
  ({ row, rowHeight }) => {
    const [rowRef, isVisible] = useIntersectionVisible<HTMLDivElement>({
      root: null,
      rootMargin: '200px',
      threshold: 0.01,
    })
    return (
      <div
        key={row.index}
        className="virtual-row"
        style={{
          top: row.top,
          height: rowHeight,
        }}
        role="row"
        ref={rowRef}
      >
        {row.photos.map((photo: PhotoT, photoIndex: number) => (
          <MemoVirtualItem
            key={photo.id}
            photo={photo}
            globalIndex={row.startIndex + photoIndex}
            isVisible={isVisible}
          />
        ))}
      </div>
    )
  }
)

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
          <MemoVirtualRow key={row.index} row={row} rowHeight={rowHeight} />
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
