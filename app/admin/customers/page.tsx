"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Eye, Plus, Trash2 } from "lucide-react"
import { useSelector } from 'react-redux'

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
import { fetchCustomers } from '../store/slices/customerSlice'
import { store } from '../../redux/store'

// Define the data type based on API response
type Customer = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  active: number;
  created_at: string;
  last_login_at: string | null;
  setting: {
    ip: string;
    genesis_session_key: string;
    url: string;
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
  const dispatch = store.dispatch;
  const { customers, loading, error, pagination } = useSelector((state: any) => state.customers);
  const [activeTab, setActiveTab] = useState("all")

  // Dialog states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const token = useSelector((state:any) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCustomers());
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
    // TODO: Implement add customer functionality
    setIsAddCustomerOpen(false);
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
    },
    {
      accessorKey: "setting.url",
      header: "URL",
      cell: ({ row }) => {
        const url = row.original.setting.url
        return (
          <div className="max-w-[200px] truncate" title={url}>
            {url}
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
              onClick={() => {
                setSelectedCustomer(customer)
                setIsDetailsOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsEditOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsDeleteOpen(true)
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
          <DataTable columns={columns} data={filteredCustomers} />
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
