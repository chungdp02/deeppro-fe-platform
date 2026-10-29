import { traceStages, type ActiveTraceStage } from "./traceability-data"

export function HeroFallback({ activeStage }: { activeStage: ActiveTraceStage }) {
  return (
    <div className="trace-fallback" aria-hidden="true" data-ui="true">
      <div className="trace-fallback__path" />
      {traceStages.map((stage, index) => (
        <span
          className={`trace-fallback__node trace-fallback__node--${index}${activeStage === index ? " is-active" : ""}`}
          key={stage.id}
        >
          {stage.title}
        </span>
      ))}
      <div className="trace-fallback__passport">
        <span className="trace-fallback__brand">Hành trình dữ liệu số</span>
        <span>Hộ chiếu sản phẩm Blockchain</span>
      </div>
    </div>
  )
}
