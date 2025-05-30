"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { BarChart3, Settings, Plus, Edit, Trash } from "lucide-react"
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
import { ViewLimitsDialog } from "@/components/admin/view-limits-dialog"
import { AddAccessControlDialog } from "@/components/admin/add-access-control-dialog"
import { EditAccessControlDialog } from "@/components/admin/edit-access-control-dialog"
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
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/admin/store/store"
import { fetchApiAccessControls, fetchUserDetails, updateApiAccessControl, createApiAccessControl } from "@/app/admin/store/slices/apiAccessControlSlice"

interface AccessControl {
  id: number
  user_id: number
  ip_address: string
  api_name: string
  allowed_calls: number
  used_calls: number
  created_at: string
  updated_at: string
}

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  phone_number: string
  created_at: string
  updated_at: string
  active: number
  last_login_at: string | null
  last_active_at: string | null
  access_control: AccessControl[]
}

export default function AccessControlPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { users, selectedUser, loading, error } = useSelector((state: RootState) => state.apiAccessControl)
  const token = useSelector((state: RootState) => state.auth.token)
  const [isViewLimitsOpen, setIsViewLimitsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isAddAccessControlOpen, setIsAddAccessControlOpen] = useState(false)
  const [isEditAccessControlOpen, setIsEditAccessControlOpen] = useState(false)

  useEffect(() => {
    if (token) {
      console.log('Token available, fetching data...');
      dispatch(fetchApiAccessControls());
    } else {
      console.log('No token available');
    }
  }, [dispatch, token]);

  // Log data whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      console.log('Current users data:', users);
    }
  }, [users]);

  const handleEdit = (user: User) => {
    setSelectedUserId(user.id);
    dispatch(fetchUserDetails(user.id));
    setIsEditAccessControlOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUserId(user.id);
    dispatch(fetchUserDetails(user.id));
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = async (user: User) => {
    try {
      console.log("Opening details for user:", user.id);
      setSelectedUserId(user.id);
      const resultAction = await dispatch(fetchUserDetails(user.id));
      if (fetchUserDetails.fulfilled.match(resultAction)) {
        console.log("Successfully fetched user details:", resultAction.payload);
        setIsViewLimitsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Customer Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("active") as number
        return (
          <Badge variant={active === 1 ? "outline" : "destructive"}>
            {active === 1 ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "company",
      header: "Company API Limit",
      cell: ({ row }) => {
        const user = row.original
        const companyControl = user.access_control.find(ac => ac.api_name === "company")
        if (!companyControl) return "No limit set"
        
        const percentage = (companyControl.used_calls / companyControl.allowed_calls) * 100
        return (
          <div className="flex items-center gap-2">
            <span>
              {companyControl.used_calls}/{companyControl.allowed_calls}
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
      id: "driver",
      header: "Driver API Limit",
      cell: ({ row }) => {
        const user = row.original
        const driverControl = user.access_control.find(ac => ac.api_name === "driver")
        if (!driverControl) return "No limit set"
        
        const percentage = (driverControl.used_calls / driverControl.allowed_calls) * 100
        return (
          <div className="flex items-center gap-2">
            <span>
              {driverControl.used_calls}/{driverControl.allowed_calls}
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
      id: "vehicle",
      header: "Vehicle API Limit",
      cell: ({ row }) => {
        const user = row.original
        const vehicleControl = user.access_control.find(ac => ac.api_name === "vehicle")
        if (!vehicleControl) return "No limit set"
        
        const percentage = (vehicleControl.used_calls / vehicleControl.allowed_calls) * 100
        return (
          <div className="flex items-center gap-2">
            <span>
              {vehicleControl.used_calls}/{vehicleControl.allowed_calls}
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
        const user = row.original
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(user)}
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
        const user = row.original
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
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (!token) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Authentication Required</h2>
          <p className="mt-2">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="mt-2">Fetching access control data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => dispatch(fetchApiAccessControls())}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
        <DataTable columns={columns} data={users} />
      </div>

      {/* Add Access Control Dialog */}
      <AddAccessControlDialog
        open={isAddAccessControlOpen}
        onOpenChange={setIsAddAccessControlOpen}
        onSubmit={async (values) => {
          try {
            await dispatch(createApiAccessControl(values));
            dispatch(fetchApiAccessControls()); // Refresh the list
            setIsAddAccessControlOpen(false);
          } catch (error) {
            console.error('Error creating access control:', error);
          }
        }}
      />

      {/* Edit Access Control Dialog */}
      {selectedUser && (
        <EditAccessControlDialog
          open={isEditAccessControlOpen}
          onOpenChange={setIsEditAccessControlOpen}
          onSubmit={async (values) => {
            try {
              console.log('Submitting update with values:', values);
              await dispatch(updateApiAccessControl({
                user_id: selectedUser.id,
                plan_id: Number(values.plan_id)
              }));
              dispatch(fetchApiAccessControls()); // Refresh the list
              setIsEditAccessControlOpen(false);
            } catch (error) {
              console.error('Error updating access control:', error);
            }
          }}
          initialData={{
            name: selectedUser.name,
            email: selectedUser.email,
            phone_number: selectedUser.phone_number,
            plan_id: selectedUser.access_control.find(ac => ac.api_name === "company")?.plan_id?.toString() || "",
          }}
        />
      )}

      {/* View Limits Dialog */}
      {selectedUser && (
        <ViewLimitsDialog
          open={isViewLimitsOpen}
          onOpenChange={(open: boolean) => {
            console.log("Dialog state changing to:", open);
            setIsViewLimitsOpen(open);
          }}
          accessControl={selectedUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the access control settings for{" "}
              <span className="font-semibold">{selectedUser?.name}</span>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              console.log('Deleting:', selectedUserId);
              setIsDeleteDialogOpen(false);
              setSelectedUserId(null);
            }} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
