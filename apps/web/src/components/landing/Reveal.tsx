import { useEffect, useRef, useState, type HTMLAttributes, type PropsWithChildren } from "react"

export type RevealVariant =
  | "fade-up"
  | "slide-right"
  | "slide-left"
  | "zoom-in"
  | "stagger-cards"
  | "glow-pulse"
  | "flip-card"
  | "cube-rotate"
  | "wave-float"

type RevealProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & {
  className?: string
  delay?: number
  variant?: RevealVariant
}>

type RevealCallback = () => void
let sharedObserver: IntersectionObserver | null = null
const revealCallbacks = new WeakMap<Element, RevealCallback>()
let isAnimationDisabled: boolean | null = null

function checkAnimationDisabled(): boolean {
  if (typeof window === "undefined") return true
  if (isAnimationDisabled === null) {
    isAnimationDisabled =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  }
  return isAnimationDisabled
}

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null
  if (checkAnimationDisabled()) return null

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = revealCallbacks.get(entry.target)
            if (callback) {
              callback()
              revealCallbacks.delete(entry.target)
            }
            sharedObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    )
  }
  return sharedObserver
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
  ...rest
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = getSharedObserver()
    if (!observer) return

    revealCallbacks.set(element, () => setIsVisible(true))
    observer.observe(element)

    return () => {
      revealCallbacks.delete(element)
      observer.unobserve(element)
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={[
        "reveal",
        `reveal--${variant}`,
        isVisible ? "is-visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: delay ? delay + "ms" : undefined }}
      {...rest}
    >
      {children}
    </div>
  )
}
