import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { VirtualItem } from './VirtualItem'
import { LoadingIndicator } from './LoadingIndicator'
import './VirtualizedPhotoGrid.css'
import type { PhotoT } from '../api/picsum.ts'

interface VirtualizedPhotoGridProps {
  photos: PhotoT[]
  onLoadMore: () => void
  onLoadPrevious: () => void
  isLoading: boolean
  loadMoreThreshold?: number
  itemsPerRow?: number
  rowHeight?: number
}

interface VirtualRow {
  index: number
  top: number
  photos: PhotoT[]
  startIndex: number
}

const DEFAULT_CONTAINER_HEIGHT = 600
const DEFAULT_LOAD_MORE_THRESHOLD = 800
const DEFAULT_ITEMS_PER_ROW = 3
const DEFAULT_ROW_HEIGHT = 300
const BUFFER_ROWS = 1

export const VirtualizedPhotoGrid: React.FC<VirtualizedPhotoGridProps> = ({
  photos,
  onLoadMore,
  onLoadPrevious,
  isLoading,
  loadMoreThreshold = DEFAULT_LOAD_MORE_THRESHOLD,
  itemsPerRow = DEFAULT_ITEMS_PER_ROW,
  rowHeight = DEFAULT_ROW_HEIGHT,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(DEFAULT_CONTAINER_HEIGHT)
  const [scrollTop, setScrollTop] = useState(0)
  const [visibleRows, setVisibleRows] = useState<VirtualRow[]>([])

  const totalRows = Math.ceil(photos.length / itemsPerRow)
  const totalHeight = totalRows * rowHeight

  const rows = useMemo(() => {
    if (photos.length === 0) return []

    const result: PhotoT[][] = []
    for (let i = 0; i < photos.length; i += itemsPerRow) {
      result.push(photos.slice(i, i + itemsPerRow))
    }
    return result
  }, [photos, itemsPerRow])

  const calculateVisibleRows = useCallback(() => {
    if (totalRows === 0 || containerHeight === 0) {
      setVisibleRows([])
      return
    }

    const startRow = Math.floor(scrollTop / rowHeight)
    const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + containerHeight) / rowHeight))

    const bufferedStartRow = Math.max(0, startRow - BUFFER_ROWS)
    const bufferedEndRow = Math.min(totalRows - 1, endRow + BUFFER_ROWS)

    const newVisibleRows: VirtualRow[] = []
    for (let i = bufferedStartRow; i <= bufferedEndRow; i++) {
      const rowPhotos = rows[i]
      if (rowPhotos) {
        newVisibleRows.push({
          index: i,
          top: i * rowHeight,
          photos: rowPhotos,
          startIndex: i * itemsPerRow,
        })
      }
    }

    setVisibleRows(newVisibleRows)
  }, [scrollTop, containerHeight, totalRows, rowHeight, rows, itemsPerRow])

  useEffect(() => {
    calculateVisibleRows()
  }, [calculateVisibleRows])

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget
      const newScrollTop = target.scrollTop

      if (newScrollTop === scrollTop) return

      setScrollTop(newScrollTop)

      const { scrollHeight, clientHeight } = target
      const scrollFromBottom = scrollHeight - (newScrollTop + clientHeight)

      if (scrollFromBottom <= loadMoreThreshold && !isLoading) {
        onLoadMore()
      }

      if (newScrollTop <= loadMoreThreshold && !isLoading) {
        onLoadPrevious()
      }
    },
    [scrollTop, loadMoreThreshold, isLoading, onLoadMore, onLoadPrevious]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const newHeight = entry.contentRect.height
        if (newHeight !== containerHeight) {
          setContainerHeight(newHeight)
        }
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerHeight])

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
              position: 'absolute',
              top: row.top,
              left: 0,
              right: 0,
              height: rowHeight,
              overflow: 'hidden',
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
