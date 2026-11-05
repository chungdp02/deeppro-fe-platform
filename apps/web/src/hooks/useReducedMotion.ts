import { useSyncExternalStore } from "react"

/**
 * Hook detecting whether user prefers reduced motion using useSyncExternalStore.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {}
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      mediaQuery.addEventListener("change", callback)
      return () => mediaQuery.removeEventListener("change", callback)
    },
    () => {
      if (typeof window === "undefined") return false
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },
    () => false
  )
}
