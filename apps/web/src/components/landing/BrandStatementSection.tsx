import { useEffect, useRef, useState, type ComponentType } from "react"
import { Reveal } from "@/components/landing/Reveal"

const benefits = [
  {
    step: "01",
    title: "Thông tin có ngữ cảnh.",
    description:
      "Mỗi ghi nhận gắn với sản phẩm, lô và bước thực hiện trong quy trình.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Các bên cùng nối tiếp.",
    description:
      "Từ nhà sản xuất đến nhà phân phối, thông tin được cập nhật ở từng chặng.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Dễ dàng tiếp cận.",
    description:
      "Mã QR giúp người dùng mở thông tin được chia sẻ qua Zalo Mini App.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h.01" />
        <path d="M17 7h.01" />
        <path d="M7 17h.01" />
        <path d="M17 17h.01" />
      </svg>
    ),
  },
]

export function BrandStatementSection() {
  const visualRef = useRef<HTMLDivElement>(null)
  const [Scene, setScene] = useState<ComponentType | null>(null)

  useEffect(() => {
    let active = true
    const visual = visualRef.current
    if (!visual) return

    const loadScene = () => {
      import("./three/TrustStructureScene")
        .then((module) => {
          if (active) setScene(() => module.TrustStructureScene)
        })
        .catch((error: unknown) => {
          if (active) {
            console.error("DeepTrace brand scene could not load", error)
          }
        })
    }

    if (!("IntersectionObserver" in window)) {
      loadScene()
      return () => {
        active = false
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        loadScene()
      },
      { rootMargin: "160px" }
    )
    observer.observe(visual)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  return (
    <section className="why-deeptrace" aria-labelledby="why-title">
      <div className="container why-deeptrace__grid">
        <div className="why-deeptrace__column-intro">
          <Reveal variant="glow-pulse">
            <h2 id="why-title">Niềm tin bắt đầu từ thông tin rõ ràng.</h2>
            <p className="why-deeptrace__lead">
              Mỗi mắt xích dữ liệu trong chuỗi cung ứng được bảo chứng bằng cấu
              trúc khối mã hóa phi tập trung — minh bạch, toàn vẹn và bất biến.
            </p>
          </Reveal>
          <div ref={visualRef} className="why-deeptrace__visual-wrap">
            {Scene ? <Scene /> : <div className="why-deeptrace__3d-placeholder" aria-hidden="true" />}
          </div>
        </div>

        <Reveal
          className="why-deeptrace__benefits"
          delay={100}
          variant="stagger-cards"
        >
          {benefits.map((benefit) => (
            <article key={benefit.title} className="why-deeptrace__card">
              <div className="why-deeptrace__card-icon" aria-hidden="true">
                {benefit.icon}
              </div>
              <div className="why-deeptrace__card-body">
                <div className="why-deeptrace__card-header">
                  <h3>{benefit.title}</h3>
                  <span className="why-deeptrace__card-step">{benefit.step}</span>
                </div>
                <p>{benefit.description}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
