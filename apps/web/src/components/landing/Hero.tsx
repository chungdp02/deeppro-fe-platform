import { useCallback, useEffect, useState } from "react"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { HeroScene } from "@/components/landing/HeroScene"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import type { ActiveTraceStage, TraceStageIndex } from "@/components/landing/traceability-data"

const PRODUCT_LOGIN_URL = "https://deeptrace.deepprotech.com/login?redirect=%2Fproduct"

export function Hero() {
  const [activeStage, setActiveStage] = useState<ActiveTraceStage>(null)

  const selectStage = useCallback((stage: TraceStageIndex) => {
    setActiveStage(stage)
    // Scroll mượt mà đến bước tương ứng trong hành trình nếu người dùng đã chủ động cuộn xuống
    const chapterElement = document.getElementById(`journey-${["origin", "production", "distribution", "traceability"][stage]}`)
    if (chapterElement && window.scrollY > 150) {
      chapterElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  const handleStageChangeFromScroll = useCallback((stage: TraceStageIndex) => {
    setActiveStage(stage)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Khi người dùng cuộn lên đỉnh trang (Hero view)
      if (window.scrollY < 80) {
        setActiveStage(null)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="trace-experience" id="top" aria-label="DeepTrace, từ nguồn gốc đến niềm tin">
      <div className="container trace-experience__grid">
        <div className="trace-intro">
          <h1>Truy xuất nguồn gốc Blockchain.</h1>
          <p className="trace-intro__description">
            Theo dõi sản phẩm toàn diện từ trang trại đến tay người tiêu dùng với
            nền tảng truy xuất nguồn gốc ứng dụng công nghệ Blockchain.
          </p>
          <div className="trace-intro__actions">
            <a className="button button--light" href={PRODUCT_LOGIN_URL} target="_blank" rel="noreferrer">
              Bắt đầu truy xuất <ArrowIcon diagonal />
            </a>
            <a className="trace-intro__explore" href="#solutions">
              Khám phá giải pháp <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="trace-intro__footnote">
            <p>
              Chuỗi cung ứng Dược phẩm · Nông sản thực phẩm · Hàng tiêu dùng minh bạch.
            </p>
          </div>
        </div>
        <div className="trace-stage-column">
          <HeroScene activeStage={activeStage} onSelect={selectStage} />
        </div>
        <HowItWorksSection activeStage={activeStage} onStageChange={handleStageChangeFromScroll} />
      </div>
      <div className="trace-experience__handoff container">
        <span>Từ hành trình dữ liệu</span><span aria-hidden="true">↓</span><a href="#product">đến trải nghiệm sản phẩm.</a>
      </div>
    </section>
  )
}
