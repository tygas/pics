import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useTrackElementHeight<T extends HTMLElement>(
  ref: RefObject<T | null>,
  initialHeight = 0
): number {
  const [height, setHeight] = useState<number>(initialHeight)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const newHeight = entry.contentRect.height
      setHeight((prev) => (prev !== newHeight ? newHeight : prev))
    })

    ro.observe(el)

    return () => ro.disconnect()
  }, [ref])

  return height
}
