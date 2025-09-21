import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  onLoadPrevious?: () => void
  threshold?: number
  isLoading: boolean
  hasMore?: boolean
}

export const useInfiniteScroll = ({
  onLoadMore,
  onLoadPrevious,
  threshold = 100,
  isLoading,
  hasMore = true,
}: UseInfiniteScrollOptions) => {
  const lastScrollTop = useRef(0)
  const isLoadingRef = useRef(false)

  // Update loading ref when isLoading changes
  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    const handleScroll = () => {
      // Prevent unnecessary calls during loading
      if (isLoadingRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement

      // Debounce scroll events
      if (Math.abs(scrollTop - lastScrollTop.current) < 10) return
      lastScrollTop.current = scrollTop

      // Load more when near bottom
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      console.log('Distance from bottom:', distanceFromBottom)

      if (distanceFromBottom < threshold && hasMore) {
        console.log('Loading more photos...')
        onLoadMore()
      }

      // Load previous when near top (optional)
      if (onLoadPrevious && scrollTop < threshold) {
        console.log('Loading previous photos...')
        onLoadPrevious()
      }
    }

    // Throttle scroll events using requestAnimationFrame
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Listen to window scroll instead of container scroll
    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [onLoadMore, onLoadPrevious, threshold, hasMore])
}
