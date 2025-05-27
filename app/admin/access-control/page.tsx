"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { BarChart3, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table"
import { AddAccessControlDialog } from "@/components/admin/add-access-control-dialog"
import { EditAccessControlDialog } from "@/components/admin/edit-access-control-dialog"
import { ViewLimitsDialog } from "@/components/admin/view-limits-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define the data type
type AccessControl = {
  id: string
  customerName: string
  paymentPlan: string
  companiesLimit: number
  driversLimit: number
  vehiclesLimit: number
  companiesUsed: number
  driversUsed: number
  vehiclesUsed: number
  status: "active" | "warning" | "critical"
  lastUpdated: Date
}

// Sample data
const accessControls: AccessControl[] = [
  {
    id: "1",
    customerName: "Acme Corporation",
    paymentPlan: "Premium Plan",
    companiesLimit: 50,
    driversLimit: 200,
    vehiclesLimit: 150,
    companiesUsed: 32,
    driversUsed: 145,
    vehiclesUsed: 98,
    status: "active",
    lastUpdated: new Date(2023, 6, 15),
  },
  {
    id: "2",
    customerName: "XYZ Industries",
    paymentPlan: "Standard Plan",
    companiesLimit: 30,
    driversLimit: 100,
    vehiclesLimit: 80,
    companiesUsed: 15,
    driversUsed: 45,
    vehiclesUsed: 30,
    status: "active",
    lastUpdated: new Date(2023, 7, 2),
  },
  {
    id: "3",
    customerName: "Global Logistics",
    paymentPlan: "Basic Plan",
    companiesLimit: 20,
    driversLimit: 80,
    vehiclesLimit: 60,
    companiesUsed: 5,
    driversUsed: 20,
    vehiclesUsed: 15,
    status: "active",
    lastUpdated: new Date(2023, 7, 10),
  },
  {
    id: "4",
    customerName: "Saudi Transport",
    paymentPlan: "Premium Plan",
    companiesLimit: 40,
    driversLimit: 120,
    vehiclesLimit: 100,
    companiesUsed: 25,
    driversUsed: 80,
    vehiclesUsed: 95,
    status: "warning",
    lastUpdated: new Date(2023, 8, 5),
  },
  {
    id: "5",
    customerName: "Riyadh Movers",
    paymentPlan: "Standard Plan",
    companiesLimit: 25,
    driversLimit: 75,
    vehiclesLimit: 50,
    companiesUsed: 10,
    driversUsed: 35,
    vehiclesUsed: 48,
    status: "warning",
    lastUpdated: new Date(2023, 8, 12),
  },
  {
    id: "6",
    customerName: "Jeddah Shipping",
    paymentPlan: "Basic Plan",
    companiesLimit: 15,
    driversLimit: 60,
    vehiclesLimit: 40,
    companiesUsed: 14,
    driversUsed: 58,
    vehiclesUsed: 39,
    status: "critical",
    lastUpdated: new Date(2023, 8, 20),
  },
]

export default function AccessControlPage() {
  const [data, setData] = useState<AccessControl[]>(accessControls)
  const [isAddAccessControlOpen, setIsAddAccessControlOpen] = useState(false)
  const [isEditAccessControlOpen, setIsEditAccessControlOpen] = useState(false)
  const [selectedAccessControl, setSelectedAccessControl] = useState<AccessControl | null>(null)
  const [isViewLimitsOpen, setIsViewLimitsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editInitialData, setEditInitialData] = useState({
    customerName: "",
    paymentPlan: "",
  })

  // Define columns for the data table
  const columns: ColumnDef<AccessControl>[] = [
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "paymentPlan",
      header: "Payment Plan",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "outline" : status === "warning" ? "secondary" : "destructive"}>
            {status === "active" ? "Active" : status === "warning" ? "Near Limit" : "Critical"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "companiesLimit",
      header: "Companies Assigned Limit",
      cell: ({ row }) => {
        const limit = row.getValue("companiesLimit") as number
        const used = row.original.companiesUsed
        const percentage = (used / limit) * 100
        return (
          <div className="flex items-center gap-2">
            <span>
              {used}/{limit}
            </span>
            <div className="w-24">
              <Progress
                value={percentage}
                className="h-2"
                indicatorClassName={percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : undefined}
              />
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "driversLimit",
      header: "Drivers Assigned Limit",
      cell: ({ row }) => {
        const limit = row.getValue("driversLimit") as number
        const used = row.original.driversUsed
        const percentage = (used / limit) * 100
        return (
          <div className="flex items-center gap-2">
            <span>
              {used}/{limit}
            </span>
            <div className="w-24">
              <Progress
                value={percentage}
                className="h-2"
                indicatorClassName={percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : undefined}
              />
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "vehiclesLimit",
      header: "Vehicles Assigned Limit",
      cell: ({ row }) => {
        const limit = row.getValue("vehiclesLimit") as number
        const used = row.original.vehiclesUsed
        const percentage = (used / limit) * 100
        return (
          <div className="flex items-center gap-2">
            <span>
              {used}/{limit}
            </span>
            <div className="w-24">
              <Progress
                value={percentage}
                className="h-2"
                indicatorClassName={percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : undefined}
              />
            </div>
          </div>
        )
      },
    },
    {
      id: "status",
      header: "View Status",
      cell: ({ row }) => {
        const accessControl = row.original
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedAccessControl(accessControl)
              setIsViewLimitsOpen(true)
            }}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            View Details
          </Button>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const accessControl = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAccessControl(accessControl)
                  setEditInitialData({
                    customerName: accessControl.customerName,
                    paymentPlan: accessControl.paymentPlan,
                  })
                  setIsEditAccessControlOpen(true)
                }}
              >
                Edit Payment Plan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAccessControl(accessControl)
                  setIsDeleteDialogOpen(true)
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleAddAccessControl = (accessControl: {
    customerName: string
    paymentPlan: string
  }) => {
    // Find if customer already exists
    const existingCustomer = data.find((a) => a.customerName === accessControl.customerName)

    if (existingCustomer) {
      // Update existing customer
      setData((prev) =>
        prev.map((a) => {
          if (a.customerName === accessControl.customerName) {
            return {
              ...a,
              paymentPlan: accessControl.paymentPlan,
              // Set limits based on payment plan
              ...(accessControl.paymentPlan === "Basic Plan" && {
                companiesLimit: 20,
                driversLimit: 80,
                vehiclesLimit: 60,
              }),
              ...(accessControl.paymentPlan === "Standard Plan" && {
                companiesLimit: 30,
                driversLimit: 100,
                vehiclesLimit: 80,
              }),
              ...(accessControl.paymentPlan === "Premium Plan" && {
                companiesLimit: 50,
                driversLimit: 200,
                vehiclesLimit: 150,
              }),
              lastUpdated: new Date(),
            }
          }
          return a
        }),
      )
    } else {
      // Add new customer
      const newAccessControl: AccessControl = {
        id: (data.length + 1).toString(),
        customerName: accessControl.customerName,
        paymentPlan: accessControl.paymentPlan,
        // Set limits based on payment plan
        companiesLimit:
          accessControl.paymentPlan === "Basic Plan" ? 20 : accessControl.paymentPlan === "Standard Plan" ? 30 : 50,
        driversLimit:
          accessControl.paymentPlan === "Basic Plan" ? 80 : accessControl.paymentPlan === "Standard Plan" ? 100 : 200,
        vehiclesLimit:
          accessControl.paymentPlan === "Basic Plan" ? 60 : accessControl.paymentPlan === "Standard Plan" ? 80 : 150,
        companiesUsed: 0,
        driversUsed: 0,
        vehiclesUsed: 0,
        status: "active",
        lastUpdated: new Date(),
      }
      setData((prev) => [...prev, newAccessControl])
    }
    setIsAddAccessControlOpen(false)
  }

  const handleEditAccessControl = (accessControl: {
    customerName: string
    paymentPlan: string
  }) => {
    setData((prev) =>
      prev.map((a) => {
        if (a.id === selectedAccessControl?.id) {
          return {
            ...a,
            paymentPlan: accessControl.paymentPlan,
            // Update limits based on payment plan
            ...(accessControl.paymentPlan === "Basic Plan" && {
              companiesLimit: 20,
              driversLimit: 80,
              vehiclesLimit: 60,
            }),
            ...(accessControl.paymentPlan === "Standard Plan" && {
              companiesLimit: 30,
              driversLimit: 100,
              vehiclesLimit: 80,
            }),
            ...(accessControl.paymentPlan === "Premium Plan" && {
              companiesLimit: 50,
              driversLimit: 200,
              vehiclesLimit: 150,
            }),
            lastUpdated: new Date(),
          }
        }
        return a
      }),
    )
    setIsEditAccessControlOpen(false)
  }

  const handleDeleteAccessControl = () => {
    if (selectedAccessControl) {
      setData((prev) => prev.filter((a) => a.id !== selectedAccessControl.id))
      setIsDeleteDialogOpen(false)
      setSelectedAccessControl(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Access Control Management</h1>
          <p className="text-muted-foreground">Manage customer access limits for WASL services</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddAccessControlOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Access Control
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={data} />
      </div>

      {/* Add Access Control Dialog */}
      <AddAccessControlDialog
        open={isAddAccessControlOpen}
        onOpenChange={setIsAddAccessControlOpen}
        onSubmit={handleAddAccessControl}
      />

      {/* Edit Access Control Dialog */}
      {selectedAccessControl && (
        <EditAccessControlDialog
          open={isEditAccessControlOpen}
          onOpenChange={setIsEditAccessControlOpen}
          onSubmit={handleEditAccessControl}
          initialData={editInitialData}
        />
      )}

      {/* View Limits Dialog */}
      {selectedAccessControl && (
        <ViewLimitsDialog
          open={isViewLimitsOpen}
          onOpenChange={setIsViewLimitsOpen}
          accessControl={selectedAccessControl}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the access control settings for{" "}
              <span className="font-semibold">{selectedAccessControl?.customerName}</span>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccessControl} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
