import { useTranslation } from "react-i18next"
import {
  GuidePage,
  HelpPage,
  SettingsPage,
} from "./app/dashboard/support_pages"
import DashboardPage from "./app/dashboard/page"
import CompanyPage from "./app/dashboard/company_page"
import ProductsPage from "./app/dashboard/products_page"
import EmployeesPage from "./app/dashboard/employees_page"
import { useCurrentPage } from "./hooks/use-current-page"
import { DashboardLayout } from "./components/dashboard-layout"

export function App() {
  const { t } = useTranslation()
  const page = useCurrentPage()
  const content =
    page === "#tong-quan" ? (
      <DashboardPage />
    ) : page === "#cong-ty" ? (
      <CompanyPage />
    ) : page === "#san-pham" ? (
      <ProductsPage />
    ) : page === "#nhan-vien" ? (
      <EmployeesPage />
    ) : page === "#huong-dan" ? (
      <GuidePage />
    ) : page === "#cai-dat" ? (
      <SettingsPage />
    ) : page === "#tro-giup" ? (
      <HelpPage />
    ) : (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">{t("page.notFound")}</h1>
        <a
          href="#tong-quan"
          className="mt-4 inline-block text-primary underline"
        >
          {t("page.backToOverview")}
        </a>
      </main>
    )

  return <DashboardLayout>{content}</DashboardLayout>
}
