import { useEffect, useState, useRef } from 'react'

export function useIntersectionVisible<T extends HTMLElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  // this can optimize, but for demo purposes it's working real fast

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new window.IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options || { root: null, rootMargin: '200px', threshold: 0.01 })
    observer.observe(node)
    return () => {
      observer.unobserve(node)
      observer.disconnect()
    }
  }, [options])

  return [ref, isVisible]
}
