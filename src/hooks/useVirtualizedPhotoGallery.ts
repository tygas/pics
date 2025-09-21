import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPhotos, PAGE_SIZE } from '../api/picsum'
import type { Photo } from '../types/photo'

interface UseVirtualizedPhotoGalleryReturn {
  photos: Photo[]
  isLoading: boolean
  error: string | null
  handleLoadMore: () => void
  handleLoadPrevious: () => void
  totalPhotos: number
}

export const useVirtualizedPhotoGallery = (): UseVirtualizedPhotoGalleryReturn => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())
  const [totalPhotos, setTotalPhotos] = useState(0)

  const isLoadingRef = useRef(false)

  const loadPage = useCallback(
    async (page: number, direction: 'append' | 'prepend' = 'append') => {
      if (loadedPages.has(page) || isLoadingRef.current || page < 1) return

      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        const newPhotos = await fetchPhotos({ page, limit: PAGE_SIZE })

        setPhotos((prevPhotos) =>
          direction === 'prepend' ? [...newPhotos, ...prevPhotos] : [...prevPhotos, ...newPhotos]
        )

        setLoadedPages((prev) => new Set([...prev, page]))
        setTotalPhotos((prev) => Math.max(prev, page * PAGE_SIZE))
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
    if (loadedPages.size > 0 && !isLoadingRef.current) {
      const nextPage = Math.max(...Array.from(loadedPages)) + 1
      loadPage(nextPage, 'append')
    }
  }, [loadPage, loadedPages])

  const handleLoadPrevious = useCallback(() => {
    if (loadedPages.size > 0 && !isLoadingRef.current) {
      const prevPage = Math.min(...Array.from(loadedPages)) - 1
      if (prevPage >= 1) {
        loadPage(prevPage, 'prepend')
      }
    }
  }, [loadPage, loadedPages])

  return {
    photos,
    isLoading,
    error,
    handleLoadMore,
    handleLoadPrevious,
    totalPhotos,
  }
}
