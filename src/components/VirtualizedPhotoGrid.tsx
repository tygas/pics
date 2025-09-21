import React, { useEffect, useRef, useState } from 'react'
import { VirtualItem } from './VirtualItem'
import { LoadingIndicator } from './LoadingIndicator'
import type { Photo } from '../types/photo'
import './VirtualizedPhotoGrid.css'

interface VirtualizedPhotoGridProps {
  photos: Photo[]
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
  photos: Photo[]
  startIndex: number
}

export const VirtualizedPhotoGrid: React.FC<VirtualizedPhotoGridProps> = ({
  photos,
  onLoadMore,
  onLoadPrevious,
  isLoading,
  loadMoreThreshold = 800,
  itemsPerRow = 3,
  rowHeight = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(600)
  const [scrollTop, setScrollTop] = useState(0)
  const [visibleRows, setVisibleRows] = useState<VirtualRow[]>([])

  // Calculate total rows and virtual container height
  const totalRows = Math.ceil(photos.length / itemsPerRow)
  const totalHeight = totalRows * rowHeight

  // Group photos into rows
  const rows: Photo[][] = []
  for (let i = 0; i < photos.length; i += itemsPerRow) {
    rows.push(photos.slice(i, i + itemsPerRow))
  }

  // Calculate visible rows based on scroll position
  useEffect(() => {
    const startRow = Math.floor(scrollTop / rowHeight)
    const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + containerHeight) / rowHeight))

    const newVisibleRows: VirtualRow[] = []
    for (let i = Math.max(0, startRow - 1); i <= Math.min(totalRows - 1, endRow + 1); i++) {
      if (rows[i]) {
        newVisibleRows.push({
          index: i,
          top: i * rowHeight,
          photos: rows[i],
          startIndex: i * itemsPerRow,
        })
      }
    }

    setVisibleRows(newVisibleRows)
  }, [scrollTop, containerHeight, totalRows, rowHeight, photos, rows, itemsPerRow])

  // Handle scroll events
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    setScrollTop(target.scrollTop)

    // Load more photos when near bottom
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - loadMoreThreshold) {
      onLoadMore()
    }

    // Load previous photos when near top
    if (target.scrollTop <= loadMoreThreshold) {
      onLoadPrevious()
    }
  }

  // Handle container resize
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="virtualized-photo-grid" onScroll={handleScroll}>
      <div className="virtual-container" style={{ height: totalHeight }}>
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
            }}
          >
            {row.photos.map((photo, photoIndex) => (
              <VirtualItem key={photo.id} photo={photo} globalIndex={row.startIndex + photoIndex} />
            ))}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="loading-container">
          <LoadingIndicator totalSize={100} />
        </div>
      )}
    </div>
  )
}
