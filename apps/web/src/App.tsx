import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import "@/i18n"
import { AboutSection } from "@/components/landing/AboutSection"
import { FAQSection } from "@/components/landing/FAQSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { Footer } from "@/components/landing/Footer"
import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { IndustrySolutions } from "@/components/landing/IndustrySolutions"
import { PlatformValueSection } from "@/components/landing/PlatformValueSection"
import { ProductPassportSection } from "@/components/landing/ProductPassportSection"
import { FinalCTASection } from "@/components/landing/FinalCTASection"
import { TraceabilityJourney } from "@/components/landing/TraceabilityJourney"

export function App() {
  const { t } = useTranslation()

  useEffect(() => {
    // Khóa giao diện luôn ở chế độ sáng (Light Theme)
    const root = document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
    try {
      localStorage.removeItem("deeptrace-theme")
    } catch {
      // Bỏ qua nếu storage bị hạn chế
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("nav.skipLink", "Bỏ qua điều hướng")}
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <AboutSection />
        <PlatformValueSection />
        <TraceabilityJourney />
        <ProductPassportSection />
        <FeaturesSection />
        <IndustrySolutions />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
