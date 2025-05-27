"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Eye, Plus, Trash2 } from "lucide-react"

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

// Define the data type
type Customer = {
  id: string
  name: string
  email: string
  phoneNumber: string
  ipAddress: string
  genesisSessionKey: string
  url: string
  isActive: boolean
  createdAt: string
  lastLogin: string
  usageStats: {
    companiesUsed: number
    companiesLimit: number
    driversUsed: number
    driversLimit: number
    vehiclesUsed: number
    vehiclesLimit: number
  }
  notes?: string
}

// Sample data
const customers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "admin@acme.com",
    phoneNumber: "+966 123456789",
    ipAddress: "192.168.1.1",
    genesisSessionKey: "genesis_session_key_1",
    url: "https://acme.example.com",
    isActive: true,
    createdAt: "2023-01-15T10:30:00Z",
    lastLogin: "2023-04-20T08:45:00Z",
    usageStats: {
      companiesUsed: 32,
      companiesLimit: 50,
      driversUsed: 145,
      driversLimit: 200,
      vehiclesUsed: 98,
      vehiclesLimit: 150,
    },
    notes: "Premium customer with priority support",
  },
  {
    id: "2",
    name: "XYZ Industries",
    email: "admin@xyz.com",
    phoneNumber: "+966 987654321",
    ipAddress: "192.168.1.2",
    genesisSessionKey: "genesis_session_key_2",
    url: "https://xyz.example.com",
    isActive: true,
    createdAt: "2023-02-10T14:20:00Z",
    lastLogin: "2023-04-19T16:30:00Z",
    usageStats: {
      companiesUsed: 15,
      companiesLimit: 30,
      driversUsed: 45,
      driversLimit: 100,
      vehiclesUsed: 30,
      vehiclesLimit: 80,
    },
  },
  {
    id: "3",
    name: "Global Logistics",
    email: "admin@globallogistics.com",
    phoneNumber: "+966 555555555",
    ipAddress: "192.168.1.3",
    genesisSessionKey: "genesis_session_key_3",
    url: "https://globallogistics.example.com",
    isActive: false,
    createdAt: "2023-03-05T09:15:00Z",
    lastLogin: "2023-04-15T11:20:00Z",
    usageStats: {
      companiesUsed: 5,
      companiesLimit: 20,
      driversUsed: 20,
      driversLimit: 80,
      vehiclesUsed: 15,
      vehiclesLimit: 60,
    },
    notes: "Account temporarily disabled due to payment issues",
  },
  {
    id: "4",
    name: "Saudi Transport",
    email: "admin@sauditransport.com",
    phoneNumber: "+966 111222333",
    ipAddress: "192.168.1.4",
    genesisSessionKey: "genesis_session_key_4",
    url: "https://sauditransport.example.com",
    isActive: true,
    createdAt: "2023-03-20T13:40:00Z",
    lastLogin: "2023-04-21T09:10:00Z",
    usageStats: {
      companiesUsed: 25,
      companiesLimit: 40,
      driversUsed: 80,
      driversLimit: 120,
      vehiclesUsed: 60,
      vehiclesLimit: 100,
    },
  },
  {
    id: "5",
    name: "Riyadh Movers",
    email: "admin@riyadhmovers.com",
    phoneNumber: "+966 444555666",
    ipAddress: "192.168.1.5",
    genesisSessionKey: "genesis_session_key_5",
    url: "https://riyadhmovers.example.com",
    isActive: true,
    createdAt: "2023-04-01T10:00:00Z",
    lastLogin: "2023-04-22T10:30:00Z",
    usageStats: {
      companiesUsed: 10,
      companiesLimit: 25,
      driversUsed: 35,
      driversLimit: 75,
      vehiclesUsed: 20,
      vehiclesLimit: 50,
    },
  },
]

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>(customers)
  const [activeTab, setActiveTab] = useState("all")

  // Dialog states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Filter customers based on active tab
  const filteredCustomers = data.filter((customer) => {
    if (activeTab === "active") return customer.isActive
    if (activeTab === "inactive") return !customer.isActive
    return true
  })

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
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => {
        const url = row.getValue("url") as string
        return (
          <div className="max-w-[200px] truncate" title={url}>
            {url}
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex items-center">
            <Switch
              checked={customer.isActive}
              onCheckedChange={(checked) => {
                setData((prev) => prev.map((c) => (c.id === customer.id ? { ...c, isActive: checked } : c)))
              }}
            />
            <span className="ml-2">
              {customer.isActive ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Inactive
                </Badge>
              )}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsDetailsOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsEditOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
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

  const handleAddCustomer = (customer: Omit<Customer, "id" | "createdAt" | "lastLogin" | "usageStats">) => {
    const newCustomer = {
      ...customer,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      usageStats: {
        companiesUsed: 0,
        companiesLimit: 0,
        driversUsed: 0,
        driversLimit: 0,
        vehiclesUsed: 0,
        vehiclesLimit: 0,
      },
    }
    setData((prev) => [...prev, newCustomer])
    setIsAddCustomerOpen(false)
  }

  const handleEditCustomer = (updatedCustomer: any) => {
    setData((prev) =>
      prev.map((customer) => (customer.id === updatedCustomer.id ? { ...customer, ...updatedCustomer } : customer)),
    )
    setIsEditOpen(false)
  }

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setData((prev) => prev.filter((c) => c.id !== selectedCustomer.id))
    }
  }

  // Calculate statistics
  const totalCustomers = data.length
  const activeCustomers = data.filter((c) => c.isActive).length
  const inactiveCustomers = data.filter((c) => !c.isActive).length
  const recentlyActiveCustomers = data.filter((c) => {
    const lastLogin = new Date(c.lastLogin)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">All registered customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((activeCustomers / totalCustomers) * 100).toFixed(0)}% of total customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((inactiveCustomers / totalCustomers) * 100).toFixed(0)}% of total customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentlyActiveCustomers}</div>
            <p className="text-xs text-muted-foreground">Active in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customer accounts and their integration settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          <DataTable
            columns={columns}
            data={filteredCustomers}
            searchKey="name"
            searchPlaceholder="Search by customer name or email..."
          />
        </CardContent>
      </Card>

      <AddCustomerDialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen} onSubmit={handleAddCustomer} />

      {selectedCustomer && (
        <>
          <CustomerDetailsDialog customer={selectedCustomer} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />

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
