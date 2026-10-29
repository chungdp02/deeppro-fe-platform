type ArrowIconProps = {
  diagonal?: boolean
}

export function ArrowIcon({ diagonal = false }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon--diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  )
}
