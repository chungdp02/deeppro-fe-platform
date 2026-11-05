import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      title: t("features.list.0.title", "Bảo toàn dữ liệu bằng Blockchain"),
      description: t(
        "features.list.0.desc",
        "Mọi giao dịch dữ liệu đều được ký số và lưu trữ bất biến, bảo đảm không bên nào có thể đơn phương chỉnh sửa nhật ký sau khi đã ghi nhận."
      ),
    },
    {
      title: t("features.list.1.title", "Chuẩn định danh GS1 Digital Link"),
      description: t(
        "features.list.1.desc",
        "Một mã QR duy nhất đáp ứng cả việc thanh toán tại quầy thu ngân (POS) lẫn việc quét tra cứu thông tin chi tiết của người tiêu dùng."
      ),
    },
    {
      title: t("features.list.2.title", "Tương thích Hộ chiếu số EU DPP"),
      description: t(
        "features.list.2.desc",
        "Cấu trúc dữ liệu theo chuẩn Châu Âu về kinh tế tuần hoàn, thể hiện rõ nguồn gốc vật liệu, tỷ lệ tái chế và chỉ số môi trường ESG."
      ),
    },
    {
      title: t("features.list.3.title", "Tích hợp Zalo Mini App & Web App"),
      description: t(
        "features.list.3.desc",
        "Người tiêu dùng Việt Nam có thể quét mã bằng camera điện thoại hoặc Zalo quen thuộc mà không cần cài thêm ứng dụng trung gian."
      ),
    },
    {
      title: t("features.list.4.title", "Tuân thủ GS1 & TCVN 12850"),
      description: t(
        "features.list.4.desc",
        "Đáp ứng tiêu chuẩn quốc tế GS1 và tiêu chuẩn Việt Nam TCVN 12850 về truy xuất nguồn gốc các ngành hàng, hỗ trợ quy trình đạt chuẩn."
      ),
    },
    {
      title: t("features.list.5.title", "Xác thực và chống giả mạo"),
      description: t(
        "features.list.5.desc",
        "Sử dụng thuật toán mã hóa và cơ chế xác thực ứng dụng công nghệ Blockchain để đảm bảo tính xác thực và bảo vệ nguồn gốc sản phẩm."
      ),
    },
  ]

  return (
    <section
      className="section features-section"
      id="features"
      aria-labelledby="features-title"
    >
      <div className="container">
        <Reveal className="section-heading features-section__heading">
          <div>
            <h2 id="features-title">
              {t("features.heading", "Năng lực công nghệ cốt lõi của DeepTrace.")}
            </h2>
          </div>
          <p>
            {t(
              "features.description",
              "Tận dụng sức mạnh của sổ cái phân tán, tiêu chuẩn mở và giao diện thân thiện với thiết bị di động."
            )}
          </p>
        </Reveal>

        <div className="features-section__layout">
          <Reveal className="features-section__visual">
            <figure>
              <img
                src="/images/v10-barcode-delivery-720.webp"
                srcSet="/images/v10-barcode-delivery-360.webp 360w, /images/v10-barcode-delivery-640.webp 640w, /images/v10-barcode-delivery-720.webp 720w, /images/v10-barcode-delivery.webp 1000w"
                sizes="(max-width: 980px) calc(100vw - 40px), 40vw"
                alt="Nhân viên giao nhận dùng điện thoại quét nhãn trên một gói hàng"
                width="720"
                height="1080"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                {t("features.visualCaption", "Hành trình được tổ chức theo từng sản phẩm và từng lô.")}
              </figcaption>
            </figure>
          </Reveal>
          <div className="features-section__list">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 45}>
                <details className="feature-row" open={index === 0}>
                  <summary>
                    <h3>{feature.title}</h3>
                    <span>
                      <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                  </summary>
                  <p>{feature.description}</p>
                </details>
              </Reveal>
            ))}
            <a className="text-link" href="#how-it-works">
              {t("features.learnMore", "Xem quy trình từng bước")}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
