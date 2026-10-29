import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
} from "react"

type TiltCardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    maxTilt?: number
    perspective?: number
    className?: string
  }
>

export function TiltCard({
  children,
  maxTilt = 6,
  perspective = 1000,
  className = "",
  style,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<string>("")
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      const rotateY = (x * maxTilt).toFixed(2)
      const rotateX = (-y * maxTilt).toFixed(2)

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`
      )
    },
    [maxTilt, perspective]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`)
  }, [perspective])

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${isHovered ? "is-tilting" : ""} ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
