import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPhotos, PAGE_SIZE } from '../api/picsum'
import type { Photo } from '../types/photo'
import { useInfiniteScroll } from './useInfiniteScroll'

interface UsePhotoGalleryReturn {
  photos: Photo[]
  isLoading: boolean
  error: string | null
  containerRef: React.RefObject<HTMLDivElement | null>
  currentPage: number
}

export const usePhotoGallery = (): UsePhotoGalleryReturn => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())

  const containerRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  const loadPage = useCallback(
    async (page: number, direction: 'append' | 'prepend' = 'append') => {
      if (loadedPages.has(page) || isLoadingRef.current) return

      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        const newPhotos = await fetchPhotos({ page, limit: PAGE_SIZE })

        setPhotos((prevPhotos) => {
          if (direction === 'prepend') {
            return [...newPhotos, ...prevPhotos]
          }
          return [...prevPhotos, ...newPhotos]
        })

        setLoadedPages((prev) => new Set([...prev, page]))
        setCurrentPage(page)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load photos')
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    },
    [loadedPages]
  )

  useEffect(() => {
    const initializePages = async () => {
      await loadPage(1, 'append')
      await loadPage(2, 'append')
    }
    initializePages()
  }, [loadPage])

  const handleLoadMore = useCallback(() => {
    if (loadedPages.size > 0) {
      const nextPage = Math.max(...Array.from(loadedPages)) + 1
      loadPage(nextPage, 'append')
    }
  }, [loadPage, loadedPages])

  const handleLoadPrevious = useCallback(() => {
    if (loadedPages.size > 0) {
      const prevPage = Math.min(...Array.from(loadedPages)) - 1
      if (prevPage >= 1) {
        loadPage(prevPage, 'prepend')
      }
    }
  }, [loadPage, loadedPages])

  useInfiniteScroll({
    onLoadMore: handleLoadMore,
    onLoadPrevious: handleLoadPrevious,
    threshold: 200,
    isLoading,
    hasMore: true,
  })

  return {
    photos,
    isLoading,
    error,
    containerRef,
    currentPage,
  }
}
