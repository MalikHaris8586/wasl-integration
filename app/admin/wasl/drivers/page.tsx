"use client"

import { useEffect } from "react"
import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "../../../redux/reduxhook/Hook"
import { fetchDriver } from "../../../redux/auth/driverSlice"

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

export default function WaslDriversPage() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.driver)
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(fetchDriver({ token }))
    }
  }, [dispatch, token])

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Debug: log the first item to inspect API structure
      console.log('First driver item from API:', data[0])
    }
  }, [data])

  // Transform API data to match table columns
  const tableData = Array.isArray(data)
    ? data.map((item: any, idx: number) => ({
        id: item.id || idx.toString(),
        companyName: item.company?.company_name || item.company_name || "-", // Nested company name
        driverName: item.driver_name || item.driverName || "-",
        mobileNumber: item.mobile_number || item.mobileNumber || "-",
        identityNumber: item.identity_number || item.identityNumber || "-",
        waslKey: item.wasl_driver_key || item.waslKey || "-", // Correct WASL key
        status: item.status === true || item.status === "success" || item.status === 1 ? "success" : "error",
      }))
    : []

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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable
              columns={columns}
              data={tableData}
              searchKey="driverName"
              searchPlaceholder="Search by driver name..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
