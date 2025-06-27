"use client"

import { useEffect } from "react"
import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { StatusDialog } from "@/components/status-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/app/redux/reduxhook/Hook"
import { fetchVehicle } from "@/app/redux/auth/vehicleSlice"

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

export default function WaslVehiclesPage() {
  const dispatch = useAppDispatch()
  const { data: vehicles, loading, error } = useAppSelector((state) => state.vehicle)
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(fetchVehicle({ token }))
    }
  }, [dispatch, token])

  // Define columns for the data table
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "company.company_name",
      header: "Company/Account Name",
      cell: ({ row }) => row.original.company?.company_name || "-",
    },
    {
      accessorKey: "vehicle_name",
      header: "Vehicle Name",
    },
    {
      accessorKey: "wasl_asset_key",
      header: "WASL Key",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const statusMap: Record<number, { text: string; status: "success" | "error" }> = {
          1: { text: "Registered", status: "success" },
          0: { text: "Failed", status: "error" },
        }
        const { text, status: badgeStatus } = statusMap[status] || { text: String(status), status: "error" }
        return <StatusBadge status={badgeStatus} text={text} />
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const vehicle = row.original
        let responseText = vehicle.response
        let isDuplicate = false
        try {
          const parsed = JSON.parse(vehicle.response)
          responseText = JSON.stringify(parsed, null, 2)
          if (parsed?.message?.toLowerCase().includes('duplicate')) {
            isDuplicate = true
          }
        } catch {}
        // Pass token to StatusDialog
        return <StatusDialog response={responseText} duplicate={isDuplicate} vehicleData={vehicle} token={token} />
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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable
              columns={columns}
              data={vehicles}
              searchKey="vehicle_name"
              searchPlaceholder="Search by vehicle name..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
