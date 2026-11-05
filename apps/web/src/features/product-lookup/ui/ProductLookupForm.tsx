import React from "react"
import { useTranslation } from "react-i18next"
import { Search, QrCode, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { SUGGESTED_DEMO_CODES } from "../api/demo-data"
import type { LookupStatus } from "../types"

export interface ProductLookupFormProps {
  code: string
  status: LookupStatus
  errorMessage: string | null
  onCodeChange: (value: string) => void
  onSearch: (code?: string) => void
  onReset: () => void
  onOpenScanner: () => void
  onSelectDemo: (demoCode: string) => void
}

export function ProductLookupForm({
  code,
  status,
  errorMessage,
  onCodeChange,
  onSearch,
  onReset,
  onOpenScanner,
  onSelectDemo,
}: ProductLookupFormProps) {
  const { t, i18n } = useTranslation()
  const isEn = (i18n.language || "vi").startsWith("en")
  const isSearching = status === "loading"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSearching) {
      onSearch()
    }
  }

  return (
    <div className="product-lookup-box">
      <form
        className="product-lookup-form"
        onSubmit={handleSubmit}
        role="search"
        aria-label={t("passport.inputPlaceholder", "Tra cứu thông tin nguồn gốc sản phẩm")}
      >
        <div className="product-lookup-form__input-wrapper">
          <label htmlFor="trace-code-input" className="sr-only">
            {t("passport.inputPlaceholder", "Nhập mã truy xuất hoặc số lô sản phẩm")}
          </label>
          <input
            id="trace-code-input"
            type="text"
            className="product-lookup-form__input"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder={t(
              "passport.inputPlaceholder",
              "Nhập mã truy xuất (Ví dụ: VN-AGRI-0824)..."
            )}
            aria-invalid={status === "error" || status === "not_found"}
            aria-describedby={errorMessage ? "lookup-feedback" : undefined}
            autoComplete="off"
            spellCheck="false"
            disabled={isSearching}
          />
          {code && (
            <button
              type="button"
              className="product-lookup-form__clear"
              onClick={() => onCodeChange("")}
              aria-label="Clear input"
              disabled={isSearching}
            >
              ×
            </button>
          )}
        </div>

        <div className="product-lookup-form__actions">
          <Button
            type="submit"
            className="button button--primary product-lookup-form__submit"
            disabled={isSearching || !code.trim()}
          >
            {isSearching ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                <span>{t("passport.searchingBtn", "Đang tra cứu...")}</span>
              </>
            ) : (
              <>
                <Search size={18} aria-hidden="true" />
                <span>{t("passport.searchBtn", "Tra cứu")}</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="button button--outline product-lookup-form__scan"
            onClick={onOpenScanner}
            title={t("passport.scanBtn", "Quét mã QR từ camera")}
          >
            <QrCode size={18} aria-hidden="true" />
            <span>{t("passport.scanBtn", "Quét QR")}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="button button--ghost product-lookup-form__reset"
            onClick={onReset}
            title={t("passport.resetBtn", "Đặt lại về mẫu mặc định")}
            aria-label={t("passport.resetBtn", "Đặt lại về mẫu mặc định")}
          >
            <RotateCcw size={16} aria-hidden="true" />
          </Button>
        </div>
      </form>

      {/* Accessible feedback */}
      {errorMessage && (
        <div
          id="lookup-feedback"
          className="product-lookup-form__feedback"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {/* Quick suggestions chips */}
      <div className="product-lookup-form__chips" aria-label={t("passport.chipsLabel", "Mã mẫu thử nghiệm:")}>
        <span className="chips-label">{t("passport.chipsLabel", "Mã mẫu thử nghiệm:")}</span>
        <div className="chips-list">
          {SUGGESTED_DEMO_CODES.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`chip-button ${code.toUpperCase() === item.code ? "chip-button--active" : ""}`}
              onClick={() => onSelectDemo(item.code)}
              disabled={isSearching}
            >
              <span>{isEn ? item.titleEn : item.title}</span>
              <code>{item.short}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
