import { useCallback, useRef } from 'react'

export default function useDebouncedCallback<T extends (...args: number[]) => void>(
  callback: T,
  delay: number
): T {
  const timeout = useRef<NodeJS.Timeout | null>(null)
  return useCallback(
    (...args: number[]) => {
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => callback(...args), delay)
    },
    [callback, delay]
  ) as T
}
