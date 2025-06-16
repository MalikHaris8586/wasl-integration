"use client"

import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/reduxhook/Hook"
import { fetchCompanies, registerCompany } from "../../../redux/auth/companiesSlice"
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

export default function WaslCompaniesPage() {
  const dispatch = useAppDispatch()
  const { data: companies, loading, error } = useAppSelector((state) => state.companies)
  const token = useAppSelector((state) => state.auth.token)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(fetchCompanies({ token }))
    }
  }, [dispatch, token])

  // Map API data to table format
  const tableData = useMemo(
    () =>
      companies.map((c) => ({
        id: c.id.toString(),
        customerName: c.company_name || "-",
        name: c.company_name || "-",
        contactPhone: c.phone_number || "-",
        contactEmail: c.email || "-",
        identityNumber: c.identity_number || "-",
        waslKey: c.waslKey || "-",
        status: c.status === 1 ? "success" : "error",
        createdAt: c.created_at,
      })),
    [companies]
  )

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
    if (!token) return;
    dispatch(
      registerCompany({
        customerName: company.customerName,
        name: company.name,
        contactPhone: company.contactPhone,
        contactEmail: company.contactEmail,
        identityNumber: company.identityNumber,
        token,
      })
    )
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
          <DataTable columns={columns} data={tableData} searchKey="name" searchPlaceholder="Search by company name..." />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Showing {tableData.length} companies</div>
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
