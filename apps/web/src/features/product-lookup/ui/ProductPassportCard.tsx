import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Building2, Calendar, ShieldAlert, CheckCircle2, FileText, Cpu, Hash } from "lucide-react"
import type { ProductPassportData, LookupStatus } from "../types"

export interface ProductPassportCardProps {
  data: ProductPassportData | null
  status: LookupStatus
  onResetToDefault?: () => void
}

export function ProductPassportCard({
  data,
  status,
  onResetToDefault,
}: ProductPassportCardProps) {
  const { t, i18n } = useTranslation()
  const isEn = (i18n.language || "vi").startsWith("en")

  // Trạng thái đang tải dữ liệu
  if (status === "loading") {
    return (
      <Card
        as="article"
        className="passport-demo passport-demo--loading"
        data-ui="product-passport"
        aria-busy="true"
        aria-label={t("passport.loadingText", "Đang tải thông tin hộ chiếu sản phẩm")}
      >
        <div className="passport-demo__chrome">
          <span aria-hidden="true">● ● ●</span>
          <span>DeepTrace / {t("passport.loadingText", "Đang tra cứu dữ liệu...")}</span>
          <span>System</span>
        </div>
        <CardContent className="passport-demo__content passport-skeleton">
          <div className="passport-skeleton__header" />
          <div className="passport-skeleton__media" />
          <div className="passport-skeleton__lines">
            <div className="passport-skeleton__line" />
            <div className="passport-skeleton__line passport-skeleton__line--short" />
            <div className="passport-skeleton__line" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Trạng thái không tìm thấy hoặc lỗi tra cứu
  if (!data || status === "not_found" || status === "error") {
    return (
      <Card
        as="article"
        className="passport-demo passport-demo--empty"
        data-ui="product-passport"
      >
        <div className="passport-demo__chrome">
          <span aria-hidden="true">● ● ●</span>
          <span>DeepTrace / {t("passport.emptyTitle", "Kết quả tra cứu")}</span>
          <span>Notice</span>
        </div>
        <CardContent className="passport-demo__content passport-empty-state">
          <div className="passport-empty-state__icon">
            <ShieldAlert size={40} aria-hidden="true" />
          </div>
          <h3 className="passport-empty-state__title">
            {t("passport.emptyTitle", "Không tìm thấy thông tin sản phẩm")}
          </h3>
          <p className="passport-empty-state__description">
            {t(
              "passport.emptyDesc",
              "Mã định danh không tồn tại trong cơ sở dữ liệu mẫu hoặc bạn chưa nhập đúng ký tự. Vui lòng kiểm tra lại mã hoặc bấm nút dưới đây để xem lại mẫu mặc định."
            )}
          </p>
          {onResetToDefault && (
            <button
              type="button"
              className="button button--primary passport-empty-state__button"
              onClick={onResetToDefault}
            >
              {t("passport.emptyResetBtn", "Xem mẫu nông sản VietGAP mặc định")}
            </button>
          )}
        </CardContent>
      </Card>
    )
  }

  const productName = (isEn && data.nameEn) ? data.nameEn : data.name
  const productCategory = (isEn && data.categoryEn) ? data.categoryEn : data.category
  const standardBadge = (isEn && data.standardBadgeEn) ? data.standardBadgeEn : data.standardBadge
  const productDesc = (isEn && data.descriptionEn) ? data.descriptionEn : data.description
  const producerName = (isEn && data.producer.nameEn) ? data.producer.nameEn : data.producer.name
  const producerLoc = (isEn && data.producer.locationEn) ? data.producer.locationEn : data.producer.location

  // Trạng thái hiển thị dữ liệu thành công
  return (
    <Card
      as="article"
      className="passport-demo"
      data-ui="product-passport"
    >
      {/* Cửa sổ mô phỏng Chrome */}
      <div className="passport-demo__chrome">
        <span aria-hidden="true">● ● ●</span>
        <span>DeepTrace / {t("passport.demoTitle", "Hộ chiếu sản phẩm")}</span>
        <span>Preview</span>
      </div>

      <CardHeader className="passport-demo__header">
        <div>
          <p className="passport-demo__brand">DeepTrace Passport</p>
          <h3>{t("passport.demoTitle", "Hộ chiếu sản phẩm số")}</h3>
        </div>
        <Badge variant="secondary" className="passport-demo__badge">
          {standardBadge}
        </Badge>
      </CardHeader>

      <CardContent className="passport-demo__content">
        {/* Thông tin sản phẩm & hình ảnh */}
        <figure className="passport-demo__photo">
          <img
            src={data.image.src}
            srcSet={data.image.srcSet}
            sizes="104px"
            alt={data.image.alt}
            width="192"
            height="144"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <strong>{productName}</strong>
            <span>
              {isEn ? "Lot" : "Lô"} #{data.batchNumber} · GTIN: {data.gtin}
            </span>
            <span className="passport-demo__category-tag">{productCategory}</span>
          </figcaption>
        </figure>

        <p className="passport-demo__note">
          {productDesc}
        </p>

        {/* Chi tiết cơ sở sản xuất & thời hạn */}
        <div className="passport-demo__meta-grid">
          <div className="meta-item">
            <span className="meta-item__label">
              <Building2 size={14} aria-hidden="true" /> {t("passport.producer", "Đơn vị sản xuất")}
            </span>
            <span className="meta-item__value">{producerName}</span>
            <span className="meta-item__sub">{producerLoc}</span>
          </div>

          <div className="meta-item">
            <span className="meta-item__label">
              <Calendar size={14} aria-hidden="true" /> {t("passport.productionAndExpiry", "Ngày sản xuất / Hạn dùng")}
            </span>
            <span className="meta-item__value">
              {data.productionDate} {data.expiryDate ? `— ${data.expiryDate}` : ""}
            </span>
            <span className="meta-item__sub">
              {t("passport.facilityCode", "Mã cơ sở")}: {data.producer.facilityId}
            </span>
          </div>
        </div>

        {/* Mốc sự kiện hành trình truy xuất */}
        <div className="passport-demo__timeline-heading">
          <h4>{t("passport.timelineHeading", "Các mốc truy xuất")}</h4>
          <Badge variant="outline" className="passport-demo__live">
            {t("passport.sampleBadge", "Mẫu dữ liệu")}
          </Badge>
        </div>

        <dl className="passport-demo__fields">
          {data.timeline.map((item) => {
            const stepTitle = (isEn && item.titleEn) ? item.titleEn : item.title
            const stepDetail = (isEn && item.detailEn) ? item.detailEn : item.detail
            const stepLocation = (isEn && item.locationEn) ? item.locationEn : item.location
            const evidenceLabel = (isEn && item.evidence?.labelEn) ? item.evidence.labelEn : item.evidence?.label

            return (
              <div className="passport-demo__field" key={item.step}>
                <dt>
                  <CheckCircle2 size={14} className="field-icon" aria-hidden="true" />
                  <span>
                    {item.step} · {stepTitle}
                  </span>
                </dt>
                <dd>
                  <div className="field-detail">
                    {stepDetail} ({item.time})
                  </div>
                  {stepLocation && (
                    <div className="field-location">📍 {stepLocation}</div>
                  )}
                  {item.evidence && (
                    <div className="field-evidence">
                      <span className="evidence-type">
                        {item.evidence.type === "hash" && <Hash size={12} aria-hidden="true" />}
                        {item.evidence.type === "sensor" && <Cpu size={12} aria-hidden="true" />}
                        {item.evidence.type === "document" && <FileText size={12} aria-hidden="true" />}
                        {evidenceLabel}:
                      </span>{" "}
                      <code>{item.evidence.value}</code>
                    </div>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>

        {/* Footer card */}
        <div className="passport-demo__footer">
          <p>
            {t("passport.footerStandard", "Dữ liệu chuẩn hóa theo tiêu chuẩn GS1 và kết nối Hộ chiếu số DPP.")}
          </p>
          <span className="passport-demo__block-tag">
            {t("passport.footerDemoTag", "Dữ liệu minh họa")}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
