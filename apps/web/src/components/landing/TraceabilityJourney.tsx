import { useEffect, useRef } from "react"
import { motionTokens } from "@/lib/motion-tokens"
import { Reveal } from "@/components/landing/Reveal"

const stages = [
  {
    id: "origin",
    label: "Nguồn gốc",
    title: "Hồ sơ nguồn gốc minh bạch.",
    description:
      "Thông tin doanh nghiệp, sản phẩm và quy trình được khai báo để thiết lập hồ sơ truy xuất.",
    record: "Dữ liệu đăng ký: Doanh nghiệp, mặt hàng và tiêu chuẩn quy trình.",
    image: "/images/v10-hero-harvest-960.webp",
    srcSet:
      "/images/v10-hero-harvest-480.webp 480w, /images/v10-hero-harvest-672.webp 672w, /images/v10-hero-harvest-960.webp 960w, /images/v10-hero-harvest-1440.webp 1440w, /images/v10-hero-harvest.webp 1920w",
    alt: "Người nông dân đang làm việc trong nhà kính",
    width: 960,
    height: 640,
  },
  {
    id: "production",
    label: "Sản xuất",
    title: "Minh bạch từng công đoạn.",
    description:
      "Nhà sản xuất chụp ảnh và cập nhật thông tin từng bước qua ứng dụng mobile của hệ thống.",
    record: "Dữ liệu vận hành: Hình ảnh xác thực và nhật ký từng công đoạn.",
    image: "/images/v10-food-greenhouse-960.webp",
    srcSet:
      "/images/v10-food-greenhouse-480.webp 480w, /images/v10-food-greenhouse-672.webp 672w, /images/v10-food-greenhouse-960.webp 960w, /images/v10-food-greenhouse.webp 1920w",
    alt: "Luống rau xanh trong một nhà kính",
    width: 1920,
    height: 1440,
  },
  {
    id: "distribution",
    label: "Phân phối",
    title: "Bàn giao thông suốt.",
    description:
      "Nhà sản xuất hoàn tất hồ sơ lô. Nhà phân phối quét mã QR để ghi nhận việc nhận hàng.",
    record: "Dữ liệu chuỗi: Xác nhận bàn giao lô hàng và giao dịch lưu kho.",
    image: "/images/v10-supply-chain-warehouse-960.webp",
    srcSet:
      "/images/v10-supply-chain-warehouse-480.webp 480w, /images/v10-supply-chain-warehouse-672.webp 672w, /images/v10-supply-chain-warehouse-960.webp 960w, /images/v10-supply-chain-warehouse.webp 1920w",
    alt: "Nhân viên đang xử lý hàng hóa trong kho",
    width: 1920,
    height: 1280,
  },
  {
    id: "lookup",
    label: "Tra cứu",
    title: "Tra cứu nhanh chóng.",
    description:
      "Người dùng quét mã QR để xem thông tin sản phẩm được chia sẻ qua Zalo Mini App.",
    record:
      "Dữ liệu người dùng: Chứng thư số và toàn bộ hành trình đã đối soát.",
    image: "/images/v10-barcode-delivery-720.webp",
    srcSet:
      "/images/v10-barcode-delivery-360.webp 360w, /images/v10-barcode-delivery-640.webp 640w, /images/v10-barcode-delivery-720.webp 720w, /images/v10-barcode-delivery.webp 1000w",
    alt: "Nhân viên giao nhận dùng điện thoại quét nhãn trên một gói hàng",
    width: 1000,
    height: 1500,
  },
] as const

export function TraceabilityJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    let cancelled = false
    let cleanup: (() => void) | undefined
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const loadMotion = () => {
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        .then(([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled || !sectionRef.current) return
          gsap.registerPlugin(ScrollTrigger)
          const media = gsap.matchMedia()
          media.add(
            "(prefers-reduced-motion: no-preference) and (min-height: 740px)",
            () => {
              const panels =
                sectionRef.current!.querySelectorAll<HTMLElement>(
                  ".journey-panel"
                )
              panels.forEach((panel, index) => {
                const next = panels[index + 1]
                if (!next) return
                gsap.to(panel, {
                  scale: motionTokens.stackScale,
                  ease: "none",
                  transformOrigin: "center top",
                  scrollTrigger: {
                    trigger: next,
                    start: "top 90%",
                    end: "top 130px",
                    scrub: motionTokens.scrub,
                    invalidateOnRefresh: true,
                  },
                })
              })
            }
          )
          cleanup = () => media.revert()
        })
        .catch((error: unknown) =>
          console.error("Không thể tải hiệu ứng hành trình", error)
        )
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          loadMotion()
        }
      },
      { rootMargin: "400px" }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      cancelled = true
      cleanup?.()
    }
  }, [])
  return (
    <section
      ref={sectionRef}
      className="section journey-section"
      id="how-it-works"
      aria-labelledby="journey-title"
    >
      <div className="container">
        <Reveal className="section-heading">
          <h2 id="journey-title">
            Hành trình truy xuất
            <br />
            nguồn gốc sản phẩm.
          </h2>
          <p>
            Theo dõi sản phẩm từ trang trại đến tay người tiêu dùng với nền tảng
            truy xuất nguồn gốc ứng dụng công nghệ Blockchain.
          </p>
        </Reveal>
        <div className="journey-stack">
          {stages.map((stage, index) => (
            <article
              key={stage.id}
              className="journey-panel"
              data-stage={index}
            >
              <div className="journey-panel__copy">
                <p className="journey__stage">
                  0{index + 1} / 04 · {stage.label}
                </p>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <div className="journey__record">
                  <span>Thông tin ghi nhận</span>
                  <p>{stage.record}</p>
                </div>
              </div>
              <figure>
                <img
                  src={stage.image}
                  srcSet={stage.srcSet}
                  sizes="(max-width:760px) calc(100vw - 72px), 45vw"
                  width={stage.width}
                  height={stage.height}
                  alt={stage.alt}
                  loading="lazy"
                />
                <figcaption>{stage.label} · DeepTrace</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
