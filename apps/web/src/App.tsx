import { lazy, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { Link, Navigate, Route, Routes } from "react-router"
import { DashboardLayout } from "./components/layout/dashboard-layout"

const DashboardPage = lazy(() => import("./features/overview/page"))
const CompanyPage = lazy(() => import("./features/company/page"))
const ProductsPage = lazy(() => import("./features/products/page"))
const EmployeesPage = lazy(() => import("./features/employees/page"))
const GuidePage = lazy(() =>
  import("./features/support/pages").then((module) => ({
    default: module.GuidePage,
  }))
)
const SettingsPage = lazy(() =>
  import("./features/support/pages").then((module) => ({
    default: module.SettingsPage,
  }))
)
const HelpPage = lazy(() =>
  import("./features/support/pages").then((module) => ({
    default: module.HelpPage,
  }))
)

export function App() {
  const { t } = useTranslation()
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <main className="p-8" role="status">
            {t("page.loading")}
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/cong-ty" replace />} />
          <Route path="/tong-quan" element={<DashboardPage />} />
          <Route path="/cong-ty" element={<CompanyPage />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/nhan-vien" element={<EmployeesPage />} />
          <Route path="/huong-dan" element={<GuidePage />} />
          <Route path="/cai-dat" element={<SettingsPage />} />
          <Route path="/tro-giup" element={<HelpPage />} />
          <Route
            path="*"
            element={
              <main className="p-8">
                <h1 className="text-2xl font-semibold">{t("page.notFound")}</h1>
                <Link
                  to="/tong-quan"
                  className="mt-4 inline-block text-primary underline"
                >
                  {t("page.backToOverview")}
                </Link>
              </main>
            }
          />
        </Routes>
      </Suspense>
    </DashboardLayout>
  )
}
