import { ArrowRight, ArrowUpRight } from "lucide-react"

type ArrowIconProps = {
  diagonal?: boolean
  className?: string
  size?: number
}

export function ArrowIcon({
  diagonal = false,
  className = "arrow-icon",
  size = 16,
}: ArrowIconProps) {
  if (diagonal) {
    return (
      <ArrowUpRight
        aria-hidden="true"
        className={className ? `${className} arrow-icon--diagonal` : "arrow-icon--diagonal"}
        size={size}
        strokeWidth={2}
      />
    )
  }

  return (
    <ArrowRight
      aria-hidden="true"
      className={className}
      size={size}
      strokeWidth={2}
    />
  )
}
