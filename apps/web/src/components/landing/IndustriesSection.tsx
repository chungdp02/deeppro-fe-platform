import { useEffect, useRef, useState } from "react"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { ParallaxImage } from "@/components/landing/ParallaxImage"
import { Reveal } from "@/components/landing/Reveal"
import { TiltCard } from "@/components/landing/TiltCard"

const industries = [
  {
    name: "Y tế & Dược phẩm",
    tagline: "Chuỗi cung ứng lạnh & chuẩn dược thư",
    description:
      "Đảm bảo an toàn thuốc và tuân thủ quy định với việc theo dõi chuỗi cung ứng dược phẩm toàn diện.",
    kind: "health",
    specs: [
      "Mã GS1 DataMatrix chuẩn y tế",
      "Giám sát nhiệt độ chuỗi lạnh",
      "Niêm phong chống giả theo lô",
    ],
    image: "/images/medical-product.png",
    imageWebp: "/images/medical-product.webp",
    imageAlt: "Các sản phẩm dược phẩm và vật tư y tế",
    imageWidth: 434,
    imageHeight: 272,
  },
  {
    name: "Thực phẩm & Nông nghiệp",
    tagline: "Minh bạch từ nông trại đến bàn ăn",
    description:
      "Theo dõi sản phẩm thực phẩm từ trang trại đến người tiêu dùng với sự minh bạch hoàn toàn và đảm bảo an toàn.",
    kind: "food",
    specs: [
      "Nhật ký canh tác số VietGAP",
      "Định danh mã vùng trồng & ao nuôi",
      "Chứng nhận xuất xứ & an toàn thực phẩm",
    ],
    image: "/images/vegetable-box.jpg",
    imageWebp: "/images/vegetable-box.webp",
    imageAlt: "Rau củ vừa thu hoạch trong thùng tại trang trại",
    imageWidth: 1200,
    imageHeight: 600,
  },
  {
    name: "Hàng tiêu dùng",
    tagline: "Bảo vệ thương hiệu & hệ thống phân phối",
    description:
      "Giám sát tính xác thực của sản phẩm và tính toàn vẹn của chuỗi cung ứng để bảo vệ người tiêu dùng.",
    kind: "goods",
    specs: [
      "Mã định danh duy nhất (UID) từng sản phẩm",
      "Kích hoạt bảo hành & tem chống giả số",
      "Kiểm soát tràn hàng & kênh đại lý",
    ],
    image: "/images/consumer-goods.jpeg",
    imageWebp: "/images/consumer-goods.webp",
    imageAlt: "Các sản phẩm chăm sóc cá nhân trên kệ bán lẻ",
    imageWidth: 1200,
    imageHeight: 800,
  },
]

export function IndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const stemRef = useRef<HTMLDivElement>(null)
  const [activeNodes, setActiveNodes] = useState<number[]>(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return [0, 1, 2]
    }
    return []
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (stemRef.current) stemRef.current.style.transform = "scaleY(1)"
      return
    }

    const list = listRef.current
    const stem = stemRef.current
    if (!list) return

    let frameId: number | null = null

    const updateTree = () => {
      frameId = null
      const rect = list.getBoundingClientRect()
      const vh = window.innerHeight

      // Progress starts as list enters viewport and completes when list bottom passes middle
      const start = vh * 0.72
      const end = vh * 0.35
      const travel = rect.height + (start - end)
      const current = start - rect.top
      const progress = Math.max(0, Math.min(1, current / travel))

      if (stem) {
        stem.style.transform = `scaleY(${progress})`
      }

      // Check which story items have been scrolled into view
      const storyElements = list.querySelectorAll<HTMLElement>(".industry-story")
      const newlyActive: number[] = []
      storyElements.forEach((el, index) => {
        const itemRect = el.getBoundingClientRect()
        if (itemRect.top <= vh * 0.68) {
          newlyActive.push(index)
        }
      })

      setActiveNodes((prev) => {
        if (
          prev.length === newlyActive.length &&
          prev.every((v, i) => v === newlyActive[i])
        ) {
          return prev
        }
        return newlyActive
      })
    }

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(updateTree)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    updateTree()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <section className="section industries-section" id="industries" ref={sectionRef}>
      <div className="container">
        <Reveal className="section-heading section-heading--industries" variant="fade-up">
          <div>
            <h2>Đa dạng ngành hàng.</h2>
          </div>
          <p>
            Nền tảng toàn diện của chúng tôi hỗ trợ các ngành công nghiệp khác nhau
            bằng giải pháp truy xuất nguồn gốc chuyên biệt, quy trình đạt tiêu chuẩn
            được thiết kế riêng cho từng ngành hàng.
          </p>
        </Reveal>

        <div className="industry-list" ref={listRef}>
          {/* Trục cây trung tâm (Central Tree Trunk) */}
          <div className="industry-tree-track" aria-hidden="true">
            <div className="industry-tree-stem" ref={stemRef}>
              <span className="industry-tree-tip" />
            </div>
          </div>

          {industries.map((industry, index) => {
            const isActive = activeNodes.includes(index)
            const isReversed = index % 2 !== 0

            return (
              <Reveal
                className={`industry-list__reveal ${isActive ? "is-tree-active" : ""}`}
                delay={index * 60}
                variant={index % 2 === 0 ? "slide-right" : "slide-left"}
                key={industry.name}
              >
                {/* Node nhánh cây rẽ ngang */}
                <div
                  className={`industry-tree-node ${isActive ? "is-active" : ""}`}
                  aria-hidden="true"
                >
                  <div className="industry-tree-node__hub">
                    <span className="industry-tree-node__ring" />
                    <span className="industry-tree-node__badge">0{index + 1}</span>
                    <span className="industry-tree-node__dot" />
                  </div>
                  <div className="industry-tree-branch industry-tree-branch--left">
                    <span className="industry-tree-branch__line" />
                    <span className="industry-tree-branch__dot" />
                  </div>
                  <div className="industry-tree-branch industry-tree-branch--right">
                    <span className="industry-tree-branch__line" />
                    <span className="industry-tree-branch__dot" />
                  </div>
                </div>

                <article
                  className={`industry-story industry-story--${industry.kind}${
                    isReversed ? " industry-story--reversed" : ""
                  }`}
                >
                  <TiltCard className="industry-story__art" maxTilt={4}>
                    <ParallaxImage
                      src={industry.image}
                      webpSrc={industry.imageWebp}
                      alt={industry.imageAlt}
                      width={industry.imageWidth}
                      height={industry.imageHeight}
                      speed={0.10}
                    />
                  </TiltCard>
                  <div className="industry-story__copy">
                    <h3>{industry.name}</h3>
                    <p>{industry.description}</p>
                    <ul className="industry-story__specs">
                      {industry.specs.map((spec) => (
                        <li key={spec}>
                          <svg
                            className="industry-story__spec-icon"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M3.5 8.5L6.5 11.5L12.5 4.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                    <a className="text-link" href="#contact">
                      Trao đổi về quy trình
                      <ArrowIcon />
                    </a>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
