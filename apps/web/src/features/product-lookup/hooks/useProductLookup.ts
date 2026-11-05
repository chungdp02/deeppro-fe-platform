import { useState, useCallback } from "react"
import { DEFAULT_DEMO_CODE, DEMO_PRODUCTS } from "../api/demo-data"
import { lookupProduct } from "../api/lookup-service"
import type { LookupStatus, ProductPassportData } from "../types"

export interface UseProductLookupReturn {
  code: string
  status: LookupStatus
  data: ProductPassportData | null
  errorMessage: string | null
  setCode: (code: string) => void
  search: (overrideCode?: string) => Promise<void>
  reset: () => void
  selectDemo: (demoCode: string) => Promise<void>
}

export function useProductLookup(
  initialCode: string = DEFAULT_DEMO_CODE
): UseProductLookupReturn {
  const [code, setCode] = useState(initialCode)
  const [status, setStatus] = useState<LookupStatus>("success")
  const [data, setData] = useState<ProductPassportData | null>(
    DEMO_PRODUCTS[initialCode] || null
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const search = useCallback(
    async (overrideCode?: string) => {
      const target = (overrideCode !== undefined ? overrideCode : code).trim()
      if (overrideCode !== undefined) {
        setCode(overrideCode)
      }

      setStatus("loading")
      setErrorMessage(null)

      try {
        const result = await lookupProduct(target)
        if (result.success && result.data) {
          setData(result.data)
          setStatus("success")
          setErrorMessage(null)
        } else {
          setData(null)
          setStatus(result.errorCode === "NOT_FOUND" ? "not_found" : "error")
          setErrorMessage(result.errorMessage || "Có lỗi xảy ra khi tra cứu.")
        }
      } catch {
        setData(null)
        setStatus("error")
        setErrorMessage("Không thể kết nối đến hệ thống tra cứu. Vui lòng thử lại sau.")
      }
    },
    [code]
  )

  const reset = useCallback(() => {
    setCode(DEFAULT_DEMO_CODE)
    setData(DEMO_PRODUCTS[DEFAULT_DEMO_CODE] || null)
    setStatus("success")
    setErrorMessage(null)
  }, [])

  const selectDemo = useCallback(
    async (demoCode: string) => {
      setCode(demoCode)
      await search(demoCode)
    },
    [search]
  )

  return {
    code,
    status,
    data,
    errorMessage,
    setCode,
    search,
    reset,
    selectDemo,
  }
}
