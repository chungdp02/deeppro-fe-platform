import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { ParallaxImage } from "@/components/landing/ParallaxImage"
import { Reveal } from "@/components/landing/Reveal"
import { TiltCard } from "@/components/landing/TiltCard"

const DOCUMENTS_URL = "https://deeptrace.deepprotech.com/documents"

const journey = [
  {
    step: "01",
    title: "Khai báo nguồn gốc & Giống",
    detail: "Được khai báo theo quy trình chuẩn",
    time: "15/10/2026",
    status: "verified",
  },
  {
    step: "02",
    title: "Các bước canh tác & Sản xuất",
    detail: "Được cập nhật bằng hình ảnh thực tế",
    time: "22/10/2026",
    status: "verified",
  },
  {
    step: "03",
    title: "Bàn giao & Phân phối theo lô",
    detail: "Được xác nhận trong ứng dụng",
    time: "24/10/2026",
    status: "active",
  },
]

export function ProductShowcaseSection() {
  return (
    <section className="section product-showcase" id="product">
      <div className="container product-showcase__layout">
        <Reveal className="product-showcase__intro" variant="fade-up">
          <h2>Từng thông tin đúng lúc.</h2>
          <p>
            Doanh nghiệp thiết lập quy trình theo từng sản phẩm. Các bước được
            ghi nhận xuyên suốt để người dùng có thể xem thông tin đã chia sẻ
            qua mã QR.
          </p>
          <a className="text-link" href={DOCUMENTS_URL} target="_blank" rel="noreferrer">
            Tìm hiểu cách bắt đầu
            <ArrowIcon diagonal />
          </a>
        </Reveal>

        <Reveal className="trace-preview" delay={100} variant="cube-rotate" data-ui="true">
          {/* Header thanh cửa sổ phần mềm */}
          <div className="trace-preview__topbar">
            <div className="trace-preview__window-nav">
              <div className="trace-preview__window-controls" aria-hidden="true">
                <span className="trace-preview__control-dot trace-preview__control-dot--close" />
                <span className="trace-preview__control-dot trace-preview__control-dot--min" />
                <span className="trace-preview__control-dot trace-preview__control-dot--max" />
              </div>
              <span className="trace-preview__brand">
                <img
                  src="/images/deeptrace-icon.png"
                  alt=""
                  width="26"
                  height="26"
                  loading="lazy"
                  decoding="async"
                />
                <span>DeepTrace Passport</span>
              </span>
            </div>
            <div className="trace-preview__badge">
              <span className="trace-preview__badge-dot" />
              <span>Hộ chiếu sản phẩm số</span>
            </div>
          </div>

          <div className="trace-preview__main">
            {/* Cột trái: Thẻ sản phẩm chuẩn định danh số */}
            <TiltCard className="trace-preview__product" maxTilt={4}>
              <div className="trace-preview__image-container">
                <ParallaxImage
                  src="/images/vegetable-box.jpg"
                  webpSrc="/images/vegetable-box.webp"
                  alt="Nông sản xuất khẩu đạt chuẩn VietGAP được định danh số"
                  width="1200"
                  height="600"
                  speed={0.10}
                />
                <div className="trace-preview__image-tag">
                  <span className="trace-preview__tag-pulse" />
                  <span>Lô #VN-AGRI-0824</span>
                </div>
              </div>
              <div className="trace-preview__product-copy">
                <div className="trace-preview__meta-bar">
                  <span className="trace-preview__meta-badge">Chuẩn VietGAP</span>
                  <span className="trace-preview__meta-gtin">GTIN: 8936012345678</span>
                </div>
                <strong>Rau củ hữu cơ chuẩn xuất khẩu</strong>
                <span>Quy trình được thiết lập theo khai báo của doanh nghiệp.</span>
              </div>
            </TiltCard>

            {/* Cột phải: Dòng thời gian các mốc xác thực chuỗi */}
            <TiltCard className="trace-preview__journey" maxTilt={4}>
              <div className="trace-preview__journey-heading">
                <div>
                  <span className="trace-preview__journey-subtitle">Sổ cái chuỗi cung ứng</span>
                  <strong>Các mốc truy xuất</strong>
                </div>
                <div className="trace-preview__live-badge">
                  <span className="trace-preview__live-dot" aria-hidden="true" />
                  <span>Live</span>
                </div>
              </div>
              <ol className="trace-preview__timeline">
                {journey.map((item, index) => (
                  <li
                    key={item.title}
                    className={`trace-preview__timeline-item trace-preview__timeline-item--${item.status}`}
                  >
                    <div className="trace-preview__step-marker" aria-hidden="true">
                      <span className="trace-preview__step-circle">
                        {item.status === "verified" ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2.5 6 5 8.5 9.5 3.5" />
                          </svg>
                        ) : (
                          <span className="trace-preview__step-pulse" />
                        )}
                      </span>
                      {index < journey.length - 1 && <span className="trace-preview__step-line" />}
                    </div>
                    <div className="trace-preview__step-copy">
                      <div className="trace-preview__step-header">
                        <strong>{item.title}</strong>
                        <span className="trace-preview__step-time">{item.time}</span>
                      </div>
                      <span>{item.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </TiltCard>
          </div>

          {/* Footer bảo chứng mật mã chuẩn */}
          <div className="trace-preview__footer">
            <div className="trace-preview__disclaimer">
              <svg
                className="trace-preview__shield-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Dữ liệu chuẩn hóa theo tiêu chuẩn GS1 và kết nối Hộ chiếu số DPP.</span>
            </div>
            <span className="trace-preview__block-tag">Block #849,201</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
