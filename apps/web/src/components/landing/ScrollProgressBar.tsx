import { useEffect, useState } from "react"

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frameId: number | null = null

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        if (totalHeight > 0) {
          const current = Math.min(1, Math.max(0, window.scrollY / totalHeight))
          setProgress(current)
        }
        frameId = null
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        className="scroll-progress__bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
