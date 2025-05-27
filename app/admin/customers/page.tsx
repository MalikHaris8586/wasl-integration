"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Eye, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux'

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddCustomerDialog } from "@/components/admin/add-customer-dialog"
import { EditCustomerDialog } from "@/components/admin/edit-customer-dialog"
import { DeleteCustomerDialog } from "@/components/admin/delete-customer-dialog"
import { CustomerDetailsDialog } from "@/components/admin/customer-details-dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCustomers, fetchCustomerById, createCustomer } from '../store/slices/customerSlice'
import { AppDispatch } from '../store/store'

// Define the data type based on API response
interface AccessControl {
  id: number;
  name: string;
  // Add other access control fields if needed
}

interface Role {
  name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

type Customer = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  active: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  last_active_at: string | null;
  roles: Role[];
  access_control: AccessControl[];
  setting: {
    id: number;
    user_id: number;
    genesis_session_key: string;
    ip: string;
    url: string;
    created_at: string;
    updated_at: string;
  };
}

// Define dialog props types
interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    email: string;
    phoneNumber: string;
    ipAddress?: string;
    genesisSessionKey: string;
    url: string;
    isActive: boolean;
    notes?: string;
  }) => void;
}

interface EditCustomerDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    email: string;
    phoneNumber: string;
    ipAddress?: string;
    genesisSessionKey: string;
    url: string;
    isActive: boolean;
    notes?: string;
  }) => void;
}

interface CustomerDetailsDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DeleteCustomerDialogProps {
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function CustomersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error, pagination, selectedCustomer } = useSelector((state: any) => state.customers);
  const [activeTab, setActiveTab] = useState("all")

  // Dialog states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const token = useSelector((state:any) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCustomers(1));
    }
  }, [dispatch, token]);

  // Filter customers based on active tab
  const filteredCustomers = customers?.filter((customer: Customer) => {
    if (activeTab === "active") return customer.active === 1;
    if (activeTab === "inactive") return customer.active === 0;
    return true;
  }) || [];

  const handleDeleteCustomer = () => {
    // Implement delete functionality
    setIsDeleteOpen(false);
  };

  const handleAddCustomer = (values: {
    name: string;
    email: string;
    phoneNumber: string;
    ipAddress?: string;
    genesisSessionKey: string;
    url: string;
    isActive: boolean;
    notes?: string;
  }) => {
    try {
      dispatch(createCustomer({
        name: values.name,
        email: values.email,
        phone_number: values.phoneNumber,
        active: values.isActive ? 1 : 0,
        setting: {
          ip: values.ipAddress || "",
          genesis_session_key: values.genesisSessionKey,
          url: values.url,
        }
      }));
      setIsAddCustomerOpen(false);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  // Add pagination handling
  const handlePageChange = (newPage: number) => {
    if (token) {
      dispatch(fetchCustomers(newPage));
    }
  };

  // Inside the CustomersPage component, update the handleEditCustomer function
  const handleEditCustomer = async (values: any) => {
    try {
      if (selectedCustomerId === null) {
        console.error("No customer selected");
        return;
      }
      await dispatch(fetchCustomerById(selectedCustomerId));
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Define columns for the data table
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{customer.name}</span>
            <span className="text-xs text-muted-foreground">{customer.email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "setting.ip",
      header: "IP Address",
      cell: ({ row }) => {
        const ip = row.original.setting?.ip
        return ip || "-"
      }
    },
    {
      accessorKey: "setting.url",
      header: "URL",
      cell: ({ row }) => {
        const url = row.original.setting?.url || ""
        return (
          <div className="max-w-[200px] truncate" title={url}>
            {url || "-"}
          </div>
        )
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.active === 1
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                try {
                  await dispatch(fetchCustomerById(customer.id));
                  setIsDetailsOpen(true);
                } catch (error) {
                  console.error("Error fetching customer details:", error);
                }
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setIsEditOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setIsDeleteOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer accounts and their settings
          </p>
        </div>
        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <>
            <DataTable columns={columns} data={filteredCustomers} />
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {pagination.current_page} of {pagination.last_page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddCustomerDialog
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        onSubmit={handleAddCustomer}
      />
      {selectedCustomer && (
        <>
          <CustomerDetailsDialog
            customer={selectedCustomer}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <EditCustomerDialog
            customer={selectedCustomer}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleEditCustomer}
          />
          <DeleteCustomerDialog
            customerName={selectedCustomer.name}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={handleDeleteCustomer}
          />
        </>
      )}
    </div>
  )
}
