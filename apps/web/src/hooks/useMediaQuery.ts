import { useCallback, useSyncExternalStore } from "react"

export function useMediaQuery(query: string) {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", notify)
    return () => media.removeEventListener("change", notify)
  }, [query])
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query])
  return useSyncExternalStore(subscribe, snapshot, () => false)
}

function subscribeToVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify)
  return () => document.removeEventListener("visibilitychange", notify)
}

export function usePageVisible() {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === "visible",
    () => true,
  )
}
