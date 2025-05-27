"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchDriver } from "../../redux/auth/driverSlice"
import { RootState, AppDispatch } from "../../redux/store"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"

export default function DriversPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.driver)
  const token = useSelector((state: any) => state.auth.token)

  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all drivers once when token is available
  useEffect(() => {
    if (token) {
      dispatch(fetchDriver({ token })) // fetch without search param
    }
  }, [token, dispatch])

  // Filter data client-side by driver_name based on searchTerm
  const filteredData = data.filter((driver:any) =>
    driver.driver_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "driver_name",
      header: "Driver Name",
    },
    {
      accessorKey: "identity_number",
      header: "ID Number",
    },
    {
      accessorKey: "mobile_number",
      header: "Mobile",
    },
    {
      accessorKey: "company.company_name",
      header: "Company",
    },
    {
      accessorKey: "added_by_datetime",
      header: "Added At",
    },
    {
      id: "status",
      header: "Status",
      cell: () => <StatusBadge status="success" text="Fetched" />,
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Driver Records</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by driver name..."
            className="mb-4 p-2 border rounded w-full"
          />
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
