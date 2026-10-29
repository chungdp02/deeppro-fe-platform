import { useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"

import data from "./data.json"

export default function Page() {
  const [search, setSearch] = useState("")

  const filteredData = data.filter((item) =>
    item.header.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <SidebarProvider className="flex-col">
      <SiteHeader />

      <div className="flex min-h-0 flex-1">
        <AppSidebar
          variant="sidebar"
          className="top-16 h-[calc(100svh-4rem)]"
        />

        <SidebarInset className="min-w-0 bg-[#edeff4]">
          <main className="@container/main flex flex-1 flex-col gap-6 py-6">
            {/* Tiêu đề */}
            <div className="px-4 lg:px-6">
              <h1 className="text-2xl font-semibold text-[#0c263d]">
                Tổng quan
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Theo dõi số liệu và hoạt động trên DeepTrace.
              </p>
            </div>

            <SectionCards />

            
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

            
            <div className="flex flex-col gap-3 px-4 sm:flex-row lg:px-6">
              <Input
                aria-label="Tìm trong bảng"
                placeholder="Tìm theo tiêu đề..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-white sm:max-w-sm"
              />

              <Button
                variant="outline"
                onClick={() => setSearch("")}
                disabled={!search}
              >
                Xóa bộ lọc
              </Button>
            </div>
            <DataTable data={filteredData} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}