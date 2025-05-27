"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Building2,
  Car,
  ChevronDown,
  CreditCard,
  LogOut,
  User,
  Users,
  FileText,
  FileBarChart,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PartnershipLogo } from "@/components/partnership-logo"

interface SidebarProps {
  isAdmin?: boolean
}

export function DashboardSidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const customerLinks = [
    {
      title: "Dashboard",
      href: "/customer/dashboard",
      icon: BarChart3,
    },
    {
      title: "Companies",
      href: "/customer/companies",
      icon: Building2,
    },
    {
      title: "Drivers",
      href: "/customer/drivers",
      icon: User,
    },
    {
      title: "Vehicles",
      href: "/customer/vehicles",
      icon: Car,
    },
    {
      title: "Billing & Usage",
      href: "/customer/billing",
      icon: CreditCard,
    },
  ]

  const adminLinks = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      title: "Customer Management",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Access Control",
      href: "/admin/access-control",
      icon: Settings,
    },
    {
      title: "Access Control Reports",
      href: "/admin/access-control/reports",
      icon: FileText,
    },
    {
      title: "Billing",
      href: "/admin/billing",
      icon: CreditCard,
    },
    {
      title: "Billing Reports",
      href: "/admin/billing/reports",
      icon: FileBarChart,
    },
    {
      title: "Billing Settings",
      href: "/admin/billing/settings",
      icon: Settings,
    },
    {
      title: "WASL",
      icon: Building2,
      children: [
        {
          title: "Companies",
          href: "/admin/wasl/companies",
        },
        {
          title: "Drivers",
          href: "/admin/wasl/drivers",
        },
        {
          title: "Vehicles",
          href: "/admin/wasl/vehicles",
        },
      ],
    },
  ]

  const links = isAdmin ? adminLinks : customerLinks

  const handleLogout = () => {
    // Remove token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    const toast = document.getElementById("custom-toast")
    if (toast) {
      toast.classList.remove("hidden")
      toast.classList.add("opacity-100")

      setTimeout(() => {
        toast.classList.add("hidden")
        toast.classList.remove("opacity-100")
        router.push("/login")
      }, 2000)
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      <div className="flex h-screen w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center border-b px-4">
          <Link href={isAdmin ? "/admin/dashboard" : "/customer/dashboard"}>
            <PartnershipLogo size={32} />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm gap-1">
            {links.map((link, index) => {
              if (link.children) {
                return (
                  <Collapsible key={index} className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="flex w-full items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-3">
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-10">
                      {link.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent",
                            pathname === child.href && "bg-accent text-wialon-blue font-medium"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              }

              return (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent",
                    pathname === link.href && "bg-accent text-wialon-blue font-medium"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* ✅ Custom Toast */}
      <div
        id="custom-toast"
        className="hidden fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded shadow transition-opacity duration-300"
      >
        Logged out successfully!
      </div>
    </>
  )
}
