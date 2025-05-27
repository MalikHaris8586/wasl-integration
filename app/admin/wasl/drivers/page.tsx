"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the data type
type Driver = {
  id: string
  companyName: string
  driverName: string
  mobileNumber: string
  identityNumber: string
  waslKey: string
  status: "success" | "error"
}

// Sample data
const drivers: Driver[] = [
  {
    id: "1",
    companyName: "Acme Corporation",
    driverName: "John Doe",
    mobileNumber: "+966 123456789",
    identityNumber: "1234567890",
    waslKey: "WASL-DRV-001",
    status: "success",
  },
  {
    id: "2",
    companyName: "XYZ Industries",
    driverName: "Jane Smith",
    mobileNumber: "+966 987654321",
    identityNumber: "0987654321",
    waslKey: "WASL-DRV-002",
    status: "success",
  },
  {
    id: "3",
    companyName: "Global Logistics",
    driverName: "Ahmed Abdullah",
    mobileNumber: "+966 555555555",
    identityNumber: "5555555555",
    waslKey: "WASL-DRV-003",
    status: "error",
  },
  {
    id: "4",
    companyName: "Saudi Transport",
    driverName: "Mohammed Al-Harbi",
    mobileNumber: "+966 111222333",
    identityNumber: "1112223334",
    waslKey: "WASL-DRV-004",
    status: "success",
  },
  {
    id: "5",
    companyName: "Riyadh Movers",
    driverName: "Khalid Al-Otaibi",
    mobileNumber: "+966 444555666",
    identityNumber: "4445556667",
    waslKey: "WASL-DRV-005",
    status: "success",
  },
]

export default function WaslDriversPage() {
  const [data] = useState<Driver[]>(drivers)

  // Define columns for the data table
  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "companyName",
      header: "Company/Account Name",
    },
    {
      accessorKey: "driverName",
      header: "Driver Name",
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile Number",
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
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">WASL Drivers</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Driver Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="driverName"
            searchPlaceholder="Search by driver name..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
