import { useEffect, useRef, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { BrowserQRCodeReader } from "@zxing/browser"
import { X, Camera, RefreshCw, AlertCircle } from "lucide-react"
import { SUGGESTED_DEMO_CODES } from "../../product-lookup/api/demo-data"

export interface QRScannerDialogProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (code: string) => void
}

export function QRScannerDialog({
  isOpen,
  onClose,
  onScanSuccess,
}: QRScannerDialogProps) {
  const { t, i18n } = useTranslation()
  const isEn = (i18n.language || "vi").startsWith("en")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState<boolean>(true)

  const stopTracks = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch {
          // Bỏ qua lỗi khi track đã dừng
        }
      })
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      stopTracks()
      return
    }

    let isMounted = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let controls: any = null

    async function startCamera() {
      setIsInitializing(true)
      setCameraError(null)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) {
          setCameraError(
            t("qrScanner.noCameraError", "Trình duyệt hoặc thiết bị của bạn không hỗ trợ truy cập Camera trực tiếp.")
          )
          setIsInitializing(false)
        }
        return
      }

      try {
        const codeReader = new BrowserQRCodeReader()
        // Yêu cầu camera sau (environment) nếu có trên di động
        const constraints: MediaStreamConstraints = {
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }

        setIsInitializing(false)

        controls = await codeReader.decodeFromVideoElement(
          videoRef.current!,
          (result) => {
            if (result && isMounted) {
              const text = result.getText().trim()
              if (text) {
                // Tách mã nếu kết quả là URL có query hoặc đường dẫn
                let detectedCode = text
                try {
                  const url = new URL(text)
                  const codeParam =
                    url.searchParams.get("code") ||
                    url.searchParams.get("id") ||
                    url.pathname.split("/").filter(Boolean).pop()
                  if (codeParam) detectedCode = codeParam
                } catch {
                  // Text là raw string
                }

                stopTracks()
                onScanSuccess(detectedCode)
                onClose()
              }
            }
          }
        )
      } catch (err: unknown) {
        if (!isMounted) return
        setIsInitializing(false)
        const error = err as Error
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setCameraError(
            t("qrScanner.deniedError", "Quyền truy cập camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.")
          )
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setCameraError(
            t("qrScanner.notFoundError", "Không tìm thấy thiết bị camera trên máy này.")
          )
        } else {
          setCameraError(error.message || "Camera initialization failed")
        }
      }
    }

    startCamera()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      isMounted = false
      window.removeEventListener("keydown", handleKeyDown)
      if (controls && typeof controls.stop === "function") {
        controls.stop()
      }
      stopTracks()
    }
  }, [isOpen, onClose, onScanSuccess, stopTracks, t])

  if (!isOpen) return null

  return (
    <div
      className="qr-scanner-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
      onClick={onClose}
    >
      <div
        className="qr-scanner-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="qr-scanner-dialog__header">
          <div className="qr-scanner-dialog__title-wrap">
            <Camera className="qr-scanner-dialog__icon" aria-hidden="true" />
            <h3 id="qr-scanner-title">{t("qrScanner.title", "Quét mã QR truy xuất")}</h3>
          </div>
          <button
            type="button"
            className="qr-scanner-dialog__close"
            onClick={onClose}
            aria-label={t("qrScanner.closeAria", "Đóng máy quét QR")}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="qr-scanner-dialog__body">
          {cameraError ? (
            <div className="qr-scanner-dialog__error" role="alert">
              <AlertCircle size={32} className="qr-scanner-dialog__error-icon" />
              <p className="qr-scanner-dialog__error-text">{cameraError}</p>
              <p className="qr-scanner-dialog__hint">
                {t("qrScanner.hint", "Bạn có thể thử nghiệm nhanh bằng cách chọn một mã mẫu bên dưới:")}
              </p>
              <div className="qr-scanner-dialog__demo-list">
                {SUGGESTED_DEMO_CODES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className="qr-scanner-dialog__demo-btn"
                    onClick={() => {
                      onScanSuccess(item.code)
                      onClose()
                    }}
                  >
                    <span>{isEn ? item.titleEn : item.title}</span>
                    <code>{item.code}</code>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="qr-scanner-dialog__viewport">
              {isInitializing && (
                <div className="qr-scanner-dialog__loading">
                  <RefreshCw className="animate-spin" size={28} />
                  <span>{t("qrScanner.initializing", "Đang kết nối camera...")}</span>
                </div>
              )}
              <video
                ref={videoRef}
                className="qr-scanner-dialog__video"
                playsInline
                muted
                aria-label={t("qrScanner.videoAria", "Khung hình camera quét mã QR")}
              />
              <div className="qr-scanner-dialog__reticle" aria-hidden="true">
                <div className="reticle-corner reticle-tl" />
                <div className="reticle-corner reticle-tr" />
                <div className="reticle-corner reticle-bl" />
                <div className="reticle-corner reticle-br" />
                <div className="reticle-laser" />
              </div>
              <p className="qr-scanner-dialog__instruction">
                {t("qrScanner.instruction", "Hướng camera về phía mã QR trên bao bì sản phẩm")}
              </p>
            </div>
          )}
        </div>

        <div className="qr-scanner-dialog__footer">
          <p className="qr-scanner-dialog__safety-note">
            {t("qrScanner.safetyNote", "Camera chỉ hoạt động khi hộp thoại này mở và tắt ngay khi bạn đóng.")}
          </p>
        </div>
      </div>
    </div>
  )
}
