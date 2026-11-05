import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { vi } from "./locales/vi"
import { en } from "./locales/en"

const getInitialLanguage = (): "vi" | "en" => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("deeptrace-lang")
      if (saved === "vi" || saved === "en") {
        return saved
      }
    } catch {
      // Bỏ qua nếu localStorage bị chặn
    }
  }
  return "vi"
}

export const defaultNS = "translation"
export const resources = {
  vi: { translation: vi },
  en: { translation: en },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Quan trọng để hỗ trợ Vite prerender và SSR
  },
})

export const setLanguage = (lang: "vi" | "en") => {
  i18n.changeLanguage(lang)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("deeptrace-lang", lang)
      document.documentElement.lang = lang
    } catch {
      // Bỏ qua nếu localStorage bị chặn
    }
  }
}

export default i18n
