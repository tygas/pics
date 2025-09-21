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

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement

      if (Math.abs(scrollTop - lastScrollTop.current) < 5) return
      lastScrollTop.current = scrollTop

      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      if (distanceFromBottom < threshold && hasMore) {
        onLoadMore()
      }

      if (onLoadPrevious && scrollTop < threshold) {
        onLoadPrevious()
      }
    }

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

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [onLoadMore, onLoadPrevious, threshold, hasMore])
}
