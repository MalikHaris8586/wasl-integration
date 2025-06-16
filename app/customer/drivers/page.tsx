"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Driver, fetchDriver } from "../../redux/auth/driverSlice"
import { RootState, AppDispatch } from "../../redux/store"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button" // ✅ Corrected import
import { Plus } from "lucide-react"
import { RegisterDriverForm } from "@/components/customer/register-driver-form"

export default function DriversPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.driver)
  const token = useSelector((state: RootState) => state.auth.token)

  const [searchTerm, setSearchTerm] = useState("")
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [localDrivers, setLocalDrivers] = useState<Driver[]>([])

  // Fetch drivers when token is available
  useEffect(() => {
    if (token) {
      dispatch(fetchDriver({ token }))
    }
  }, [token, dispatch])

  // Combine fetched + newly registered (local) drivers
  const allDrivers = [...data, ...localDrivers]

  // Filter drivers based on search term
  const filteredData = allDrivers.filter((driver: Driver) =>
    driver.driver_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns: ColumnDef<Driver>[] = [
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

  const companies = ["Acme Corporation", "XYZ Industries", "Global Logistics"]

  const handleRegisterDriver = (values: {
    companyName: string
    driverName: string
    identityNumber: string
  }) => {
    const newDriver: Driver = {
      id: Math.random().toString(36).substring(2, 9),
      driver_name: values.driverName,
      identity_number: values.identityNumber,
      mobile_number: "N/A",
      waslKey: `WASL-DRV-${Math.floor(Math.random() * 10000)}`,
      status: "success",
      company: {
        company_name: values.companyName,
      },
      added_by_datetime: new Date().toISOString(),
    }

    setLocalDrivers((prev) => [...prev, newDriver])
    setIsRegisterOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <Button onClick={() => setIsRegisterOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Register New Driver
        </Button>
      </div>

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

      <RegisterDriverForm
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={handleRegisterDriver}
        companies={companies}
      />
    </div>
  )
}
