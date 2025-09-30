import { useEffect, useState } from 'react'

export function useItemsPerRow(): number {
  const getItemsPerRow = () => {
    const width = window.innerWidth
    if (width < 500) return 2
    if (width < 900) return 3
    return 4
  }

  const [itemsPerRow, setItemsPerRow] = useState<number>(getItemsPerRow())

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(getItemsPerRow())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return itemsPerRow
}
