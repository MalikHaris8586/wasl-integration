"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { StatusDialog } from "@/components/status-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the data type
type Vehicle = {
  id: string
  companyName: string
  vehicleName: string
  imeiNumber: string
  sequenceNumber: string
  activity: string
  response: string
  waslKey: string
  status: "success" | "error"
}

// Sample data
const vehicles: Vehicle[] = [
  {
    id: "1",
    companyName: "Acme Corporation",
    vehicleName: "Truck 001",
    imeiNumber: "123456789012345",
    sequenceNumber: "001",
    activity: "Delivery",
    response: JSON.stringify(
      { status: "success", message: "Vehicle registered successfully", timestamp: "2025-04-15T10:30:00Z" },
      null,
      2,
    ),
    waslKey: "WASL-VEH-001",
    status: "success",
  },
  {
    id: "2",
    companyName: "XYZ Industries",
    vehicleName: "Van 002",
    imeiNumber: "987654321098765",
    sequenceNumber: "002",
    activity: "Transport",
    response: JSON.stringify(
      { status: "success", message: "Vehicle registration successful", timestamp: "2025-04-16T09:15:00Z" },
      null,
      2,
    ),
    waslKey: "WASL-VEH-002",
    status: "success",
  },
  {
    id: "3",
    companyName: "Global Logistics",
    vehicleName: "Truck 003",
    imeiNumber: "555555555555555",
    sequenceNumber: "003",
    activity: "Logistics",
    response: JSON.stringify(
      { status: "error", message: "Invalid IMEI number", timestamp: "2025-04-14T14:45:00Z" },
      null,
      2,
    ),
    waslKey: "WASL-VEH-003",
    status: "error",
  },
  {
    id: "4",
    companyName: "Saudi Transport",
    vehicleName: "Bus 004",
    imeiNumber: "111222333444555",
    sequenceNumber: "004",
    activity: "Passenger Transport",
    response: JSON.stringify(
      { status: "success", message: "Vehicle registered successfully", timestamp: "2025-04-13T08:20:00Z" },
      null,
      2,
    ),
    waslKey: "WASL-VEH-004",
    status: "success",
  },
  {
    id: "5",
    companyName: "Riyadh Movers",
    vehicleName: "Truck 005",
    imeiNumber: "444555666777888",
    sequenceNumber: "005",
    activity: "Moving",
    response: JSON.stringify(
      { status: "success", message: "Vehicle registration successful", timestamp: "2025-04-12T16:40:00Z" },
      null,
      2,
    ),
    waslKey: "WASL-VEH-005",
    status: "success",
  },
]

export default function WaslVehiclesPage() {
  const [data] = useState<Vehicle[]>(vehicles)

  // Define columns for the data table
  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "companyName",
      header: "Company/Account Name",
    },
    {
      accessorKey: "vehicleName",
      header: "Vehicle Name",
    },
    {
      accessorKey: "imeiNumber",
      header: "IMEI Number",
    },
    {
      accessorKey: "sequenceNumber",
      header: "Sequence Number",
    },
    {
      accessorKey: "activity",
      header: "Activity",
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
      id: "actions",
      cell: ({ row }) => {
        const vehicle = row.original

        return <StatusDialog response={vehicle.response} />
      },
    },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">WASL Vehicles</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicle Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="vehicleName"
            searchPlaceholder="Search by vehicle name..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
