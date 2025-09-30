import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject, UIEvent } from 'react'
import type { PhotoT } from '../api/picsum'
import { useTrackElementHeight } from './useTrackElementHeight.ts'
import { useItemsPerRow } from './useItemsPerRow'

export interface VirtualRow {
  index: number
  top: number
  photos: PhotoT[]
  startIndex: number
}

const DEFAULT_CONTAINER_HEIGHT = 600
const BUFFER_ROWS = 1

interface UseVirtualizedRowsArgs {
  photos: PhotoT[]
  rowHeight: number
  loadMoreThreshold: number
  isLoading: boolean
  onLoadMore: () => void
  onLoadPrevious: () => void
}

interface UseVirtualizedRowsReturn {
  containerRef: RefObject<HTMLDivElement | null>
  visibleRows: VirtualRow[]
  totalHeight: number
  handleScroll: (event: UIEvent<HTMLDivElement>) => void
}

export function useVirtualizedRows({
  photos,
  rowHeight,
  loadMoreThreshold,
  isLoading,
  onLoadMore,
  onLoadPrevious,
}: UseVirtualizedRowsArgs): UseVirtualizedRowsReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const containerHeight = useTrackElementHeight(containerRef, DEFAULT_CONTAINER_HEIGHT)
  const itemsPerRow = useItemsPerRow()

  const [scrollTop, setScrollTop] = useState(0)
  const [visibleRows, setVisibleRows] = useState<VirtualRow[]>([])

  const totalRows = Math.ceil(photos.length / itemsPerRow)
  const totalHeight = totalRows * rowHeight

  const rows = useMemo(() => {
    if (photos.length === 0) return [] as PhotoT[][]

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
    (event: UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget
      const newScrollTop = target.scrollTop

      // Avoid redundant state updates
      if (newScrollTop !== scrollTop) {
        setScrollTop(newScrollTop)
      }

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

  return { containerRef, visibleRows, totalHeight, handleScroll }
}
