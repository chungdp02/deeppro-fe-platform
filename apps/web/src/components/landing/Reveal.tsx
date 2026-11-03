import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react"

type RevealProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    className?: string
    delay?: number
  }
>

let sharedObserver: IntersectionObserver | null = null

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window))
    return null
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting)
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -28px 0px" }
    )
  }

  return sharedObserver
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  ...rest
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    const observer = getSharedObserver()
    if (!element || !observer) return

    element.style.transitionDelay = delay ? delay + "ms" : ""
    element.classList.add("reveal-ready")
    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [delay])

  return (
    <div
      ref={elementRef}
      className={["reveal", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  )
}
