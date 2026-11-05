import { ArrowUpRightIcon, Building2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { ChartAreaInteractive } from "./chart-area-interactive"
import { RecentBatches } from "./recent-batches"
import { SectionCards } from "./section-cards"
import { Button } from "@workspace/ui/components/button"

export default function Page() {
  const { t } = useTranslation()
  return (
    <>
      <main className="@container/main mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-primary">
              <Building2Icon className="size-4" />
              {t("page.overview.eyebrow")}
            </div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              {t("page.overview.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("page.overview.description")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/15 bg-accent px-5 py-4">
          <div>
            <p className="font-semibold text-foreground">
              Công ty Cổ phần Thực phẩm ABZ
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("page.overview.companyDescription")}
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/cong-ty" />}
          >
            {t("page.overview.companyProfile")}
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </div>
        <SectionCards />
        <ChartAreaInteractive />
        <RecentBatches />
        <p className="text-center text-xs text-muted-foreground">
          {t("page.overview.footer")}
        </p>
      </main>
    </>
  )
}
