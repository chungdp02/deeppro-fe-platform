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
import { ThemeProvider } from "@/components/theme-provider"

export function App() {
  return (
    <ThemeProvider storageKey="deeptrace-theme">
      <>
        <a className="skip-link" href="#main-content">
          Bỏ qua điều hướng
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
    </ThemeProvider>
  )
}
