import { PackageIcon, BoxesIcon, QrCodeIcon, UsersIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@workspace/ui/components/card"

const metrics = [
  {
    titleKey: "products",
    value: "24",
    noteKey: "productsNote",
    icon: PackageIcon,
  },
  {
    titleKey: "batches",
    value: "120",
    noteKey: "batchesNote",
    icon: BoxesIcon,
  },
  {
    titleKey: "scans",
    value: "2.450",
    noteKey: "scansNote",
    icon: QrCodeIcon,
  },
  {
    titleKey: "employees",
    value: "8",
    noteKey: "employeesNote",
    icon: UsersIcon,
  },
]

export function SectionCards() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map(({ titleKey, value, noteKey, icon: Icon }) => (
        <Card key={titleKey} className="gap-0 py-5 shadow-none">
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                {t(`page.overview.metrics.${titleKey}`)}
              </p>
              <span className="rounded-xl bg-accent p-2.5 text-primary">
                <Icon className="size-5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t(`page.overview.metrics.${noteKey}`)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
