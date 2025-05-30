"use client"

import { useState, useEffect, useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { CreditCard, DollarSign, Download, Plus, Users } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import { fetchPaymentPlanDashboard } from "../store/slices/paymentPlanSlice"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddBillingPlanDialog } from "@/components/admin/add-billing-plan-dialog"

// Define the data types
type BillingPlan = {
  id: string
  name: string
  description: string
  companyApiPrice: number
  driverApiPrice: number
  vehicleApiPrice: number
  locationApiPrice: number
  isActive: boolean
}

type Invoice = {
  id: string
  customerName: string
  invoiceNumber: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
}

// Sample data
const billingPlans: BillingPlan[] = [
  {
    id: "1",
    name: "Basic Plan",
    description: "For small businesses with limited WASL needs",
    companyApiPrice: 5,
    driverApiPrice: 2,
    vehicleApiPrice: 3,
    locationApiPrice: 1,
    isActive: true,
  },
  {
    id: "2",
    name: "Standard Plan",
    description: "For medium-sized businesses with moderate WASL usage",
    companyApiPrice: 4,
    driverApiPrice: 1.5,
    vehicleApiPrice: 2.5,
    locationApiPrice: 0.8,
    isActive: true,
  },
  {
    id: "3",
    name: "Enterprise Plan",
    description: "For large businesses with high WASL volume",
    companyApiPrice: 3,
    driverApiPrice: 1,
    vehicleApiPrice: 2,
    locationApiPrice: 0.5,
    isActive: true,
  },
]

const invoices: Invoice[] = [
  {
    id: "1",
    customerName: "Acme Corporation",
    invoiceNumber: "INV-2023-001",
    date: "2023-10-01",
    amount: 1250.0,
    status: "paid",
  },
  {
    id: "2",
    customerName: "XYZ Industries",
    invoiceNumber: "INV-2023-002",
    date: "2023-10-05",
    amount: 875.5,
    status: "paid",
  },
  {
    id: "3",
    customerName: "Global Logistics",
    invoiceNumber: "INV-2023-003",
    date: "2023-10-15",
    amount: 1560.75,
    status: "pending",
  },
  {
    id: "4",
    customerName: "Acme Corporation",
    invoiceNumber: "INV-2023-004",
    date: "2023-11-01",
    amount: 1320.25,
    status: "pending",
  },
  {
    id: "5",
    customerName: "XYZ Industries",
    invoiceNumber: "INV-2023-005",
    date: "2023-11-05",
    amount: 920.0,
    status: "overdue",
  },
]

export default function BillingPage() {
  const [plans, setPlans] = useState<BillingPlan[]>(billingPlans)
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.auth.token)
  
  const dashboardData = useSelector((state: RootState) => state.paymentPlan)
  const { total_revenue, pending_revenue, active_customers, loading } = useMemo(
    () => ({
      total_revenue: dashboardData?.total_revenue || { value: 0, change: "0%" },
     
      pending_revenue: dashboardData?.pending_revenue || { value: 0, change: "0%" },
      active_customers: dashboardData?.active_customers || { value: 0, change: 0 },
      loading: dashboardData?.loading || false
    }),
    [dashboardData]
  )

  useEffect(() => {
    if (token) {
      dispatch(fetchPaymentPlanDashboard());
    }
  }, [dispatch, token]);
  // Define columns for the billing plans table
  const planColumns: ColumnDef<BillingPlan>[] = [
    {
      accessorKey: "name",
      header: "Plan Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "companyApiPrice",
      header: "Company API Price",
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("companyApiPrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(price)
        return formatted
      },
    },
    {
      accessorKey: "driverApiPrice",
      header: "Driver API Price",
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("driverApiPrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(price)
        return formatted
      },
    },
    {
      accessorKey: "vehicleApiPrice",
      header: "Vehicle API Price",
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("vehicleApiPrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(price)
        return formatted
      },
    },
    {
      accessorKey: "locationApiPrice",
      header: "Location API Price",
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("locationApiPrice"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(price)
        return formatted
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setPlans((prev) => prev.filter((p) => p.id !== plan.id))
              }}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  // Define columns for the invoices table
  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${
              status === "paid"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )
      },
    },
  ]

  const handleAddPlan = (plan: Omit<BillingPlan, "id" | "isActive">) => {
    const newPlan = {
      ...plan,
      id: Math.random().toString(36).substring(7),
      isActive: true,
    }
    setPlans((prev) => [...prev, newPlan])
    setIsAddPlanOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing Management</h1>
        <Button onClick={() => setIsAddPlanOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Billing Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(total_revenue.value)}
            </div>
            <p className="text-xs text-muted-foreground">{total_revenue.change} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(pending_revenue.value)}
            </div>
            <p className="text-xs text-muted-foreground">{pending_revenue.change} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : active_customers.value}
            </div>
            <p className="text-xs text-muted-foreground">+{active_customers.change} from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="plans">Billing Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="plans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Plans</CardTitle>
              <CardDescription>Manage your WASL API pricing plans. Prices are per API call.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={planColumns} data={plans} searchKey="name" searchPlaceholder="Search plans..." />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and manage customer invoices for WASL API usage.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={invoiceColumns}
                data={invoices}
                searchKey="customerName"
                searchPlaceholder="Search by customer name..."
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export All</Button>
              <Button>Generate New Invoice</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AddBillingPlanDialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen} onSubmit={handleAddPlan} />
    </div>
  )
}
