import { useEffect, useRef } from "react"

type ParallaxImageProps = {
  src: string
  alt: string
  webpSrc?: string
  width?: number | string
  height?: number | string
  speed?: number
  className?: string
  priority?: boolean
}

export function ParallaxImage({
  src,
  alt,
  webpSrc,
  width,
  height,
  speed = 0.12,
  className = "",
  priority = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const container = containerRef.current
    const img = imgRef.current
    if (!container || !img) return

    let frameId: number | null = null

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(() => {
        frameId = null
        const rect = container.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Only calculate parallax when element is near/in viewport
        if (rect.bottom >= -150 && rect.top <= viewportHeight + 150) {
          const elementCenter = rect.top + rect.height / 2
          const viewportCenter = viewportHeight / 2
          const distance = elementCenter - viewportCenter
          // Subtle translation offset
          const offsetY = (distance * speed).toFixed(1)
          img.style.transform = `translate3d(0, ${offsetY}px, 0) scale(1.14)`
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [speed])

  return (
    <div ref={containerRef} className={`parallax-wrap ${className}`.trim()}>
      <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="parallax-img"
        />
      </picture>
    </div>
  )
}
