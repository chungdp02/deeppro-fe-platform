import { useState, lazy, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { DOCUMENTS_URL } from "@/components/landing/navigation"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"
import {
  useProductLookup,
  ProductLookupForm,
  ProductPassportCard,
} from "@/features/product-lookup"

// Tải linh hoạt (lazy load) trình quét QR để không tăng kích thước gói ban đầu
const QRScannerDialog = lazy(() =>
  import("@/features/qr-scanner").then((mod) => ({
    default: mod.QRScannerDialog,
  }))
)

export function ProductPassportSection() {
  const { t } = useTranslation()
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const lookup = useProductLookup()

  const handleScanSuccess = (detectedCode: string) => {
    lookup.setCode(detectedCode)
    lookup.search(detectedCode)
  }

  return (
    <section
      className="section passport-section"
      id="product"
      aria-labelledby="passport-title"
    >
      <div className="passport-section__layout container">
        <Reveal className="passport-section__copy">
          <h2 id="passport-title">
            {t("passport.heading", "Từng thông tin đúng lúc.")}
          </h2>
          <p>
            {t(
              "passport.description",
              "Doanh nghiệp thiết lập quy trình theo từng sản phẩm. Các bước được ghi nhận xuyên suốt để người dùng có thể xem thông tin đã chia sẻ qua mã QR hoặc tra cứu trực tiếp theo số lô."
            )}
          </p>

          {/* Form tương tác tra cứu sản phẩm */}
          <ProductLookupForm
            code={lookup.code}
            status={lookup.status}
            errorMessage={lookup.errorMessage}
            onCodeChange={lookup.setCode}
            onSearch={lookup.search}
            onReset={lookup.reset}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSelectDemo={lookup.selectDemo}
          />

          <div className="passport-section__cta-wrap">
            <a
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "button button--outline",
              })}
              href={DOCUMENTS_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t("passport.cta", "Tìm hiểu cách bắt đầu")}
              <ArrowIcon diagonal />
            </a>
          </div>
        </Reveal>

        <Reveal className="passport-section__demo" delay={100}>
          <ProductPassportCard
            data={lookup.data}
            status={lookup.status}
            onResetToDefault={lookup.reset}
          />
        </Reveal>
      </div>

      {/* Hộp thoại quét QR qua Camera (chỉ render khi mở) */}
      {isScannerOpen && (
        <Suspense fallback={null}>
          <QRScannerDialog
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanSuccess={handleScanSuccess}
          />
        </Suspense>
      )}
    </section>
  )
}
