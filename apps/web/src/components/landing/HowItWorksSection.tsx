import { useEffect, useRef } from "react"
import { traceStages, type ActiveTraceStage, type TraceStageIndex } from "./traceability-data"

type JourneyProps = {
  activeStage: ActiveTraceStage
  onStageChange: (stage: TraceStageIndex) => void
}

export function HowItWorksSection({ activeStage, onStageChange }: JourneyProps) {
  const journeyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = journeyRef.current
    if (!element || !("IntersectionObserver" in window)) return
    const chapters = element.querySelectorAll<HTMLElement>("[data-journey-stage]")
    const visibleChapters = new Set<HTMLElement>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleChapters.add(entry.target as HTMLElement)
        else visibleChapters.delete(entry.target as HTMLElement)
      })
      const visible = [...visibleChapters].map((chapter) => {
        const rect = chapter.getBoundingClientRect()
        return { chapter, distance: Math.abs(rect.top + rect.height / 2 - window.innerHeight * 0.45) }
      })
      if (!visible.length) return
      const closest = visible.sort((a, b) => a.distance - b.distance)[0]
      const index = Number(closest.chapter.dataset.journeyStage) as TraceStageIndex
      onStageChange(index)
    }, { rootMargin: "-112px 0px -112px 0px", threshold: [0, 0.25, 0.5] })
    chapters.forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [onStageChange])

  return (
    <div className="trace-chapters" id="how-it-works" ref={journeyRef} aria-labelledby="journey-title">
      <div className="trace-chapters__intro"><h2 id="journey-title">Theo dấu từng giá trị.</h2><p>Cuộn để khám phá hoặc chọn một chặng trên mô hình.</p></div>
      {traceStages.map((stage, index) => (
        <article className={`trace-chapter${activeStage === index ? " is-active" : ""}`} data-journey-stage={index} id={`journey-${stage.id}`} key={stage.id}>
          <h3>{stage.headline}</h3><p>{stage.description}</p>
          <dl><dt>Thông tin ghi nhận</dt><dd>{stage.record}</dd></dl>
        </article>
      ))}
    </div>
  )
}
