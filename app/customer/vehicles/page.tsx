"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../../redux/store"
import { fetchVehicle } from "../../redux/auth/vehicleSlice"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RegisterVehicleForm } from "@/components/customer/register-vehicle-form"

type Vehicle = {
  id: string
  companyName: string
  vehicleName: string
  response: string
  waslKey: string
  status: "success" | "error"
}

export default function VehicleTable() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [tab, setTab] = useState("all")

  const dispatch = useDispatch<AppDispatch>()
  const { data, count, loading, error } = useSelector((state: RootState) => state.vehicle)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(fetchVehicle({ token }))
    }
  }, [token, dispatch])

  const registered = data.filter((v: any) => v.status === 1)
  const failed = data.filter((v: any) => v.status !== 1)

  const columns: ColumnDef<any>[] = [
    {
      header: "Vehicle",
      accessorKey: "vehicle_name",
    },
    {
      header: "Company",
      accessorFn: (row) => row.company?.company_name ?? "-",
    },
    {
      header: "Wasl Key",
      accessorFn: (row) => row.company?.waslKey ?? "-",
    },
    {
      header: "Response",
      accessorKey: "response",
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <StatusBadge
            status={status === 1 ? "success" : "error"}
            text={status === 1 ? "Active" : "Inactive"}
          />
        )
      },
    },
  ]

  const companies = ["Acme Corporation", "XYZ Industries", "Global Logistics"]

  const handleRegisterVehicle = (values: { companyName: string; vehicleName: string }) => {
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substring(7),
      ...values,
      response: JSON.stringify(
        {
          status: "success",
          message: "Vehicle registration successful",
          timestamp: new Date().toISOString(),
        },
        null,
        2
      ),
      waslKey: `WASL-VEH-${Math.floor(Math.random() * 1000)}`,
      status: "success",
    }

    // Optionally dispatch to Redux here if you want to update the global state
    // For now, you can display a toast or trigger a refetch after a successful form submission
    setIsRegisterOpen(false)
  }

  if (loading) return <p>Loading vehicles...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="space-y-6">
      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Button onClick={() => setIsRegisterOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Register New Vehicle
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count?.total_vehicles ?? data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {count?.registered ?? registered.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {count?.failed ?? failed.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with DataTables */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data}
                searchKey="vehicle_name"
                searchPlaceholder="Search vehicles..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registered">
          <Card>
            <CardHeader>
              <CardTitle>Registered Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={registered}
                searchKey="vehicle_name"
                searchPlaceholder="Search registered..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Failed Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={failed}
                searchKey="vehicle_name"
                searchPlaceholder="Search failed..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Register Modal */}
      <RegisterVehicleForm
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={handleRegisterVehicle}
        companies={companies}
      />
    </div>
  )
}
