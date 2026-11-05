export interface ProducerInfo {
  name: string
  nameEn?: string
  location: string
  locationEn?: string
  facilityId: string
  contact?: string
}

export interface TraceabilityEvidence {
  type: "hash" | "document" | "inspection" | "sensor"
  label: string
  labelEn?: string
  value: string
  verifiedAt?: string
}

export interface TraceabilityEvent {
  step: string
  title: string
  titleEn?: string
  detail: string
  detailEn?: string
  time: string
  location?: string
  locationEn?: string
  operator?: string
  status: "completed" | "in_progress" | "pending"
  evidence?: TraceabilityEvidence
}

export interface ProductPassportData {
  code: string
  name: string
  nameEn?: string
  category: string
  categoryEn?: string
  batchNumber: string
  gtin: string
  standardBadge: string
  standardBadgeEn?: string
  producer: ProducerInfo
  productionDate: string
  expiryDate?: string
  image: {
    src: string
    srcSet: string
    alt: string
  }
  description: string
  descriptionEn?: string
  timeline: TraceabilityEvent[]
  standards: string[]
  standardsEn?: string[]
  isDemo: boolean
  verificationNotice: string
  verificationNoticeEn?: string
}

export type LookupStatus = "idle" | "loading" | "success" | "not_found" | "error"

export interface LookupResult {
  success: boolean
  data?: ProductPassportData
  errorCode?: "EMPTY_CODE" | "INVALID_FORMAT" | "NOT_FOUND" | "NETWORK_ERROR"
  errorMessage?: string
}
