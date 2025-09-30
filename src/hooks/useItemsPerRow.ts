import { useEffect, useState } from 'react'

const getItemsPerRow = (width: number) => {
  if (width < 500) return 2
  if (width < 900) return 3
  return 4
}

export function useItemsPerRow(): number {
  const [itemsPerRow, setItemsPerRow] = useState<number>(() => getItemsPerRow(window.innerWidth))

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(getItemsPerRow(window.innerWidth))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return itemsPerRow
}
