import { useSyncExternalStore } from "react"

/**
 * Hook detecting whether a given CSS media query matches using React's useSyncExternalStore.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {}
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener("change", callback)
      return () => mediaQuery.removeEventListener("change", callback)
    },
    () => {
      if (typeof window === "undefined") return false
      return window.matchMedia(query).matches
    },
    () => false
  )
}
