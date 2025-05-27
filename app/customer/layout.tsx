import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="flex h-16 items-center border-b px-6 bg-white dark:bg-slate-950 shadow-sm">
          <h1 className="text-lg font-medium">Customer Portal</h1>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
