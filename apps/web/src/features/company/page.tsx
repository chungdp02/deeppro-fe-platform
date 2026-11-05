import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export default function Page() {
  const { t } = useTranslation()
  const companySections = [
  {
    title: t("page.company.title"),
    fields: [
      { label: t("page.company.name"), value: "Công ty Cổ phần Thực phẩm ABZ" },
      { label: t("page.company.industry"), value: t("page.company.foodIndustry") },
      { label: t("page.company.status"), value: t("page.company.active") },
    ],
  },
  {
    title: t("page.company.contact"),
    fields: [
      { label: "Email", value: "abz@example.com" },
      { label: t("page.company.phone"), value: "090 123 4567" },
      { label: t("page.company.address"), value: t("page.company.city") },
    ],
  },
  {
    title: t("page.company.legal"),
    fields: [
      { label: t("page.company.taxCode"), value: t("page.company.notUpdated") },
      { label: t("page.company.license"), value: t("page.company.notUpdated") },
      { label: t("page.company.issueDate"), value: t("page.company.notUpdated") },
    ],
  },
  {
    title: t("page.company.activity"),
    fields: [
      { label: t("page.company.productCount"), value: "4" },
      { label: t("page.company.employeeCount"), value: "3" },
    ],
  },
  ]
  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("page.company.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("page.company.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {companySections.map((section, index) => (
            <Card
              key={section.title}
              className={index % 2 === 0 ? "lg:col-span-2" : ""}
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <dl className="divide-y">
                  {section.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:justify-between sm:gap-6"
                    >
                      <dt className="text-sm text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className="text-sm font-medium break-words sm:max-w-[65%] sm:text-right">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
