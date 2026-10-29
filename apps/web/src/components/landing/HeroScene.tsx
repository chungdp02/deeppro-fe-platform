import { Component, useCallback, useEffect, useRef, useState, type ComponentType, type KeyboardEvent, type ReactNode } from "react"
import { useMediaQuery, usePageVisible } from "@/hooks/useMediaQuery"
import { HeroFallback } from "./HeroFallback"
import { traceStages, type ActiveTraceStage, type TraceStageIndex } from "./traceability-data"

type Phase = "poster" | "loading" | "ready" | "unsupported" | "lost" | "error"
type HeroSceneProps = { activeStage: ActiveTraceStage; onSelect: (stage: TraceStageIndex) => void }

export type TraceCanvasProps = HeroSceneProps & {
  compact: boolean
  animate: boolean
  running: boolean
  onReady: () => void
  onContextLost: () => void
  onContextRestored: () => void
  onError: () => void
  onRegisterOrbitReset: (reset: (() => void) | null) => void
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error) {
    console.error("DeepTrace 3D could not initialize", error)
    this.props.onError()
  }
  render() { return this.state.failed ? null : this.props.children }
}

function supportsWebGL2() {
  try {
    const context = document.createElement("canvas").getContext("webgl2")
    if (!context) return false
    context.getExtension("WEBGL_lose_context")?.loseContext()
    return true
  } catch { return false }
}

export function HeroScene({ activeStage, onSelect }: HeroSceneProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const requestedRef = useRef(false)
  const [requested, setRequested] = useState(false)
  const [phase, setPhase] = useState<Phase>("poster")
  const [attempt, setAttempt] = useState(0)
  const [SceneComponent, setSceneComponent] = useState<ComponentType<TraceCanvasProps> | null>(null)
  const [moduleFailed, setModuleFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const orbitResetRef = useRef<() => void>(() => {})
  const compact = useMediaQuery("(max-width: 767px)")
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const pageVisible = usePageVisible()
  const currentStage = activeStage !== null ? traceStages[activeStage] : traceStages[0]

  useEffect(() => {
    if (!requested) return
    let current = true
    import("./three/TraceabilityScene").then((module) => {
      if (current) setSceneComponent(() => module.default)
    }).catch((error: unknown) => {
      if (!current) return
      console.error("DeepTrace 3D module could not load", error)
      setModuleFailed(true)
      setPhase("error")
    })
    return () => { current = false }
  }, [requested, attempt])

  const enableScene = useCallback(() => {
    if (requestedRef.current) return
    requestedRef.current = true
    if (!supportsWebGL2()) { setPhase("unsupported"); return }
    setPhase("loading")
    setRequested(true)
  }, [])

  useEffect(() => {
    const element = shellRef.current
    if (!element || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.02 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const environment = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    if (compact || reducedMotion || !inView || !pageVisible || environment.connection?.saveData ||
      (environment.deviceMemory !== undefined && environment.deviceMemory <= 4) ||
      (environment.hardwareConcurrency && environment.hardwareConcurrency <= 4)) return

    let idleId: number | undefined
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(enableScene, { timeout: 1500 })
      else enableScene()
    }, 350)
    return () => {
      window.clearTimeout(timer)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
    }
  }, [compact, reducedMotion, inView, pageVisible, enableScene])

  const handleReady = useCallback(() => setPhase("ready"), [])
  const handleLost = useCallback(() => setPhase("lost"), [])
  const handleError = useCallback(() => setPhase("error"), [])
  const registerOrbitReset = useCallback((reset: (() => void) | null) => {
    orbitResetRef.current = reset ?? (() => {})
  }, [])
  const retryScene = () => {
    // Browsers can cache a failed module fetch; a fresh document can fetch it again.
    if (moduleFailed) { window.location.reload(); return }
    setSceneComponent(null)
    setPhase("loading")
    setAttempt((value) => value + 1)
  }
  const animate = !reducedMotion && !paused
  const running = inView && pageVisible && phase !== "lost" && phase !== "error"

  function handleStageKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % 4
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + 3) % 4
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = 3
    else return
    event.preventDefault()
    onSelect(next as TraceStageIndex)
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")
    buttons?.[next].focus()
  }

  const canvasContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return
    const lost = (e: Event) => {
      e.preventDefault()
      handleLost()
    }
    const restored = () => handleReady()

    // Capture phase intercepts webglcontextlost immediately on any descendant canvas
    container.addEventListener("webglcontextlost", lost, true)
    container.addEventListener("webglcontextrestored", restored, true)

    let detach: (() => void) | undefined
    const attach = (c: HTMLCanvasElement) => {
      c.addEventListener("webglcontextlost", lost)
      c.addEventListener("webglcontextrestored", restored)
      return () => {
        c.removeEventListener("webglcontextlost", lost)
        c.removeEventListener("webglcontextrestored", restored)
      }
    }
    const canvas = container.querySelector("canvas")
    if (canvas) detach = attach(canvas)
    const observer = new MutationObserver(() => {
      const c = container.querySelector("canvas")
      if (c && !detach) detach = attach(c)
    })
    observer.observe(container, { childList: true, subtree: true })
    return () => {
      container.removeEventListener("webglcontextlost", lost, true)
      container.removeEventListener("webglcontextrestored", restored, true)
      observer.disconnect()
      detach?.()
    }
  }, [handleLost, handleReady])

  return (
    <div
      className="trace-scene-shell"
      ref={shellRef}
      data-scene-phase={phase}
      data-selected-stage={activeStage ?? ""}
    >
      <div className="trace-scene__heading"><span className="trace-scene__wordmark">DeepTrace</span></div>
      <div className={`trace-scene__viewport${phase === "ready" ? " is-ready" : ""}`}>
        <HeroFallback activeStage={activeStage} />
        <div className="trace-scene__canvas" ref={canvasContainerRef} aria-hidden="true">
          {SceneComponent && (
            <SceneBoundary key={attempt} onError={handleError}>
                <SceneComponent activeStage={activeStage} onSelect={onSelect} compact={compact}
                  animate={animate} running={running} onReady={handleReady}
                  onContextLost={handleLost} onContextRestored={handleReady} onError={handleError}
                  onRegisterOrbitReset={registerOrbitReset} />
            </SceneBoundary>
          )}
        </div>
        {phase === "poster" && <button type="button" className="trace-scene__load" onClick={enableScene}><span aria-hidden="true">↗</span>Khám phá 3D{reducedMotion && <small>Chế độ ít chuyển động</small>}</button>}
        {phase === "loading" && <span className="trace-scene__loading" role="status">Đang chuẩn bị mô hình 3D…</span>}
        {(phase === "lost" || phase === "error") && <div className="trace-scene__recovery" role="status"><p>{phase === "lost" ? "Kết nối đồ họa bị gián đoạn." : "Chưa tải được mô hình 3D."}</p><button type="button" onClick={retryScene}>{moduleFailed ? "Tải lại trang" : "Thử lại 3D"}</button></div>}
      </div>
      <p className="visually-hidden">Mô hình khái niệm gồm một hồ sơ sản phẩm ở trung tâm, nối với bốn chặng nguồn gốc, sản xuất, phân phối và tra cứu. Chọn chặng bằng các nút bên dưới để đọc thông tin.</p>
      <div className="trace-scene__stages" role="group" aria-label="Chọn chặng của hành trình">
        {traceStages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={activeStage === index}
            aria-controls="trace-stage-detail"
            aria-label={`Bước ${index + 1}: ${item.title}`}
            onClick={() => onSelect(index as TraceStageIndex)}
            onKeyDown={(event) => handleStageKey(event, index)}
          >
            <span>0{index + 1}</span>
            <b>{item.title}</b>
          </button>
        ))}
      </div>
      <div
        className={`trace-scene__detail${activeStage !== null ? " is-visible" : " is-hidden"}`}
        id="trace-stage-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{currentStage.title}</span>
        <p>{currentStage.description}</p>
        <a href={currentStage.link}>
          {currentStage.linkLabel}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      {phase === "ready" && !reducedMotion && (
        <button
          type="button"
          className="trace-scene__a11y-pause"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
        >
          {paused ? "Bật chuyển động" : "Dừng chuyển động"}
        </button>
      )}
    </div>
  )
}
