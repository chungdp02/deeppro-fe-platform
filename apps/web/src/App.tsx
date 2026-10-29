import { AnimatedBackground } from "@/components/landing/AnimatedBackground"
import { ContactSection, Footer } from "@/components/landing/ContactAndFooter"
import { FAQSection } from "@/components/landing/FAQSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { IndustriesSection } from "@/components/landing/IndustriesSection"
import { BrandStatementSection } from "@/components/landing/BrandStatementSection"
import { ProductShowcaseSection } from "@/components/landing/ProductShowcaseSection"
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar"
import { SectionDivider } from "@/components/landing/SectionDivider"
import { SolutionsSection } from "@/components/landing/SolutionsSection"
import { ThemeProvider } from "@/components/theme-provider"

export function App() {
  return (
    <ThemeProvider storageKey="deeptrace-theme">
      <>
        <AnimatedBackground />
        <ScrollProgressBar />
        <a className="skip-link" href="#main-content">
          Bỏ qua điều hướng
        </a>
        <Header />
        <main id="main-content">
          <Hero />
          <SectionDivider />
          <SolutionsSection />
          <SectionDivider />
          <ProductShowcaseSection />
          <SectionDivider />
          <FeaturesSection />
          <SectionDivider />
          <IndustriesSection />
          <SectionDivider />
          <BrandStatementSection />
          <SectionDivider />
          <FAQSection />
          <SectionDivider />
          <ContactSection />
        </main>
        <Footer />
      </>
    </ThemeProvider>
  )
}
