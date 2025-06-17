"use client"

import type React from "react"
import { Bell, ChevronDown, Search, User } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Suspense } from "react"
import { Providers } from '@/lib/providers'
import { useSelector } from "react-redux"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useSelector((state: any) => state.auth.user)

  return (
    <Providers>
      <div className="flex min-h-screen">
        <DashboardSidebar isAdmin />
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-medium">Admin Portal</h1>
              {/* <div className="hidden md:flex items-center gap-2 rounded-md border px-2 focus-within:ring-1 focus-within:ring-ring">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-[200px] md:w-[300px] border-0 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div> */}
            </div>
            <div className="flex items-center gap-4">
              {/* <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="hidden md:block text-sm font-medium">{user?.name || 'User'}</div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                  {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="p-6">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </div>
    </Providers>
  )
}
