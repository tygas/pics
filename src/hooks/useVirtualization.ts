import { useState, useEffect, useCallback, useRef } from 'react'

export interface VirtualItem {
  index: number
  start: number
  size: number
  end: number
}

interface UseVirtualizationOptions {
  count: number
  getScrollElement?: () => Element | null
  estimateSize: number
  overscan?: number
  scrollMargin?: number
  getItemSize?: (index: number) => number
}

export const useVirtualization = ({
  count,
  getScrollElement,
  estimateSize,
  overscan = 5,
  scrollMargin = 0,
  getItemSize,
}: UseVirtualizationOptions) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const scrollElementRef = useRef<Element | null>(null)

  // Cache for measured sizes
  const measurementsCache = useRef<Map<number, number>>(new Map())

  const getItemSizeFn = useCallback(
    (index: number) => {
      if (getItemSize) {
        return getItemSize(index)
      }
      return measurementsCache.current.get(index) ?? estimateSize
    },
    [getItemSize, estimateSize]
  )

  // Calculate item positions
  const calculateItemPositions = useCallback(() => {
    const items: VirtualItem[] = []
    let start = 0

    for (let i = 0; i < count; i++) {
      const size = getItemSizeFn(i)
      items.push({
        index: i,
        start,
        size,
        end: start + size,
      })
      start += size
    }

    return items
  }, [count, getItemSizeFn])

  const allItems = calculateItemPositions()
  const totalSize = allItems[allItems.length - 1]?.end ?? 0

  // Find visible range
  const getVisibleRange = useCallback(() => {
    const start = Math.max(0, scrollTop - scrollMargin)
    const end = scrollTop + viewportHeight + scrollMargin

    let startIndex = 0
    let endIndex = count - 1

    // Binary search for start index
    let low = 0
    let high = allItems.length - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const item = allItems[mid]
      if (item.end < start) {
        low = mid + 1
      } else {
        high = mid - 1
        startIndex = mid
      }
    }

    // Binary search for end index
    low = startIndex
    high = allItems.length - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const item = allItems[mid]
      if (item.start <= end) {
        low = mid + 1
        endIndex = mid
      } else {
        high = mid - 1
      }
    }

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: Math.min(count - 1, endIndex + overscan),
    }
  }, [scrollTop, viewportHeight, scrollMargin, overscan, count, allItems])

  const { startIndex, endIndex } = getVisibleRange()

  const virtualItems = allItems.slice(startIndex, endIndex + 1)

  // Scroll event handler
  useEffect(() => {
    const element = getScrollElement?.() ?? window
    scrollElementRef.current = element === window ? document.documentElement : (element as Element)

    const handleScroll = () => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      const newScrollTop =
        scrollElement === document.documentElement
          ? scrollElement.scrollTop
          : (scrollElement as Element).scrollTop

      setScrollTop(newScrollTop)
    }

    const handleResize = () => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      const height =
        scrollElement === document.documentElement ? window.innerHeight : scrollElement.clientHeight

      setViewportHeight(height)
    }

    handleResize()
    handleScroll()

    const target = element === window ? window : element
    target.addEventListener('scroll', handleScroll, { passive: true })
    target.addEventListener('resize', handleResize, { passive: true })

    return () => {
      target.removeEventListener('scroll', handleScroll)
      target.removeEventListener('resize', handleResize)
    }
  }, [getScrollElement])

  const measureElement = useCallback((index: number, element: Element) => {
    const size = element?.getBoundingClientRect().height
    measurementsCache.current.set(index, size)
  }, [])

  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement || index < 0 || index >= count) return

      const item = allItems[index]
      if (!item) return

      let scrollTop = item.start

      if (align === 'center') {
        scrollTop = item.start - viewportHeight / 2 + item.size / 2
      } else if (align === 'end') {
        scrollTop = item.end - viewportHeight
      }

      if (scrollElement === document.documentElement) {
        window.scrollTo({ top: scrollTop, behavior: 'smooth' })
      } else {
        scrollElement.scrollTo({ top: scrollTop, behavior: 'smooth' })
      }
    },
    [allItems, count, viewportHeight]
  )

  return {
    virtualItems,
    totalSize,
    startIndex,
    endIndex,
    scrollTop,
    measureElement,
    scrollToIndex,
  }
}
