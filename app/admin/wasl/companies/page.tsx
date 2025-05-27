"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Download, Filter, Plus } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RegisterCompanyDialog } from "@/components/admin/register-company-dialog"

// Define the data type
type Company = {
  id: string
  customerName: string
  name: string
  contactPhone: string
  contactEmail: string
  identityNumber: string
  waslKey: string
  status: "success" | "error"
  createdAt: string
}

// Sample data
const companies: Company[] = [
  {
    id: "1",
    customerName: "Acme Corporation",
    name: "Acme Logistics",
    contactPhone: "+966 123456789",
    contactEmail: "contact@acme.com",
    identityNumber: "1234567890",
    waslKey: "WASL-COMP-001",
    status: "success",
    createdAt: "2025-04-15T10:30:00Z",
  },
  {
    id: "2",
    customerName: "XYZ Industries",
    name: "XYZ Transport",
    contactPhone: "+966 987654321",
    contactEmail: "info@xyz.com",
    identityNumber: "0987654321",
    waslKey: "WASL-COMP-002",
    status: "success",
    createdAt: "2025-04-16T09:15:00Z",
  },
  {
    id: "3",
    customerName: "Global Logistics",
    name: "Global Shipping",
    contactPhone: "+966 555555555",
    contactEmail: "support@globallogistics.com",
    identityNumber: "5555555555",
    waslKey: "WASL-COMP-003",
    status: "error",
    createdAt: "2025-04-14T14:45:00Z",
  },
  {
    id: "4",
    customerName: "Saudi Transport",
    name: "Saudi Freight",
    contactPhone: "+966 111222333",
    contactEmail: "info@sauditransport.com",
    identityNumber: "1112223334",
    waslKey: "WASL-COMP-004",
    status: "success",
    createdAt: "2025-04-13T08:20:00Z",
  },
  {
    id: "5",
    customerName: "Riyadh Movers",
    name: "Riyadh Express",
    contactPhone: "+966 444555666",
    contactEmail: "contact@riyadhmovers.com",
    identityNumber: "4445556667",
    waslKey: "WASL-COMP-005",
    status: "success",
    createdAt: "2025-04-12T16:40:00Z",
  },
]

export default function WaslCompaniesPage() {
  const [data, setData] = useState<Company[]>(companies)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  // Define columns for the data table
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "name",
      header: "Company/Account Name",
    },
    {
      accessorKey: "contactPhone",
      header: "Contact Phone",
    },
    {
      accessorKey: "contactEmail",
      header: "Contact Email",
    },
    {
      accessorKey: "identityNumber",
      header: "Identity Number",
    },
    {
      accessorKey: "waslKey",
      header: "WASL Key",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusMap: Record<string, { text: string; status: "success" | "error" }> = {
          success: { text: "Registered", status: "success" },
          error: { text: "Failed", status: "error" },
        }

        const { text, status: badgeStatus } = statusMap[status] || { text: status, status: "error" }

        return <StatusBadge status={badgeStatus} text={text} />
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString()
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const company = row.original

        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )
      },
    },
  ]

  const handleRegisterCompany = (company: Omit<Company, "id" | "waslKey" | "status" | "createdAt">) => {
    const newCompany: Company = {
      id: `comp-${Date.now()}-${data.length + 1}`,
      ...company,
      waslKey: `WASL-COMP-${String(data.length + 1).padStart(4, '0')}`,
      status: "success",
      createdAt: new Date().toISOString(),
    }

    setData((prev) => [newCompany, ...prev])
    setIsRegisterOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">WASL Companies</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Registered</DropdownMenuItem>
                <DropdownMenuItem>Failed</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Customer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>All Customers</DropdownMenuItem>
                <DropdownMenuItem>Acme Corporation</DropdownMenuItem>
                <DropdownMenuItem>XYZ Industries</DropdownMenuItem>
                <DropdownMenuItem>Global Logistics</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsRegisterOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Register Company
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Company Registrations</CardTitle>
          <CardDescription>View and manage all WASL company registrations across all customers</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search by company name..." />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Showing {data.length} companies</div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </CardFooter>
      </Card>

      <RegisterCompanyDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={handleRegisterCompany}
        customers={["Acme Corporation", "XYZ Industries", "Global Logistics", "Saudi Transport", "Riyadh Movers"]}
      />
    </div>
  )
}
