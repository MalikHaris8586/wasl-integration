"use client"

import { useState } from "react"
import { CalendarIcon, Download, FileBarChart, Filter, Printer } from "lucide-react"
import { format } from "date-fns"
import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"

// Define the data types
type RevenueReport = {
  id: string
  period: string
  totalRevenue: number
  companyApiRevenue: number
  driverApiRevenue: number
  vehicleApiRevenue: number
  locationApiRevenue: number
  customerCount: number
  growth: number
}

type CustomerReport = {
  id: string
  customerName: string
  totalSpend: number
  companyApiCalls: number
  driverApiCalls: number
  vehicleApiCalls: number
  locationApiCalls: number
  planName: string
}

// Sample data
const revenueReports: RevenueReport[] = [
  {
    id: "1",
    period: "Jan 2023",
    totalRevenue: 45250.75,
    companyApiRevenue: 12500.5,
    driverApiRevenue: 8750.25,
    vehicleApiRevenue: 15000.0,
    locationApiRevenue: 9000.0,
    customerCount: 15,
    growth: 0,
  },
  {
    id: "2",
    period: "Feb 2023",
    totalRevenue: 48500.25,
    companyApiRevenue: 13200.75,
    driverApiRevenue: 9500.5,
    vehicleApiRevenue: 16000.0,
    locationApiRevenue: 9800.0,
    customerCount: 16,
    growth: 7.18,
  },
  {
    id: "3",
    period: "Mar 2023",
    totalRevenue: 52750.5,
    companyApiRevenue: 14500.25,
    driverApiRevenue: 10250.0,
    vehicleApiRevenue: 17500.25,
    locationApiRevenue: 10500.0,
    customerCount: 17,
    growth: 8.76,
  },
  {
    id: "4",
    period: "Apr 2023",
    totalRevenue: 55000.0,
    companyApiRevenue: 15000.0,
    driverApiRevenue: 11000.0,
    vehicleApiRevenue: 18000.0,
    locationApiRevenue: 11000.0,
    customerCount: 17,
    growth: 4.26,
  },
  {
    id: "5",
    period: "May 2023",
    totalRevenue: 58250.25,
    companyApiRevenue: 16000.25,
    driverApiRevenue: 11500.0,
    vehicleApiRevenue: 19250.0,
    locationApiRevenue: 11500.0,
    customerCount: 18,
    growth: 5.91,
  },
  {
    id: "6",
    period: "Jun 2023",
    totalRevenue: 62500.75,
    companyApiRevenue: 17250.25,
    driverApiRevenue: 12500.5,
    vehicleApiRevenue: 20750.0,
    locationApiRevenue: 12000.0,
    customerCount: 19,
    growth: 7.29,
  },
]

const customerReports: CustomerReport[] = [
  {
    id: "1",
    customerName: "Acme Corporation",
    totalSpend: 12500.5,
    companyApiCalls: 250,
    driverApiCalls: 1250,
    vehicleApiCalls: 850,
    locationApiCalls: 3500,
    planName: "Enterprise Plan",
  },
  {
    id: "2",
    customerName: "XYZ Industries",
    totalSpend: 8750.25,
    companyApiCalls: 175,
    driverApiCalls: 950,
    vehicleApiCalls: 625,
    locationApiCalls: 2750,
    planName: "Standard Plan",
  },
  {
    id: "3",
    customerName: "Global Logistics",
    totalSpend: 15000.0,
    companyApiCalls: 300,
    driverApiCalls: 1500,
    vehicleApiCalls: 1000,
    locationApiCalls: 4500,
    planName: "Enterprise Plan",
  },
  {
    id: "4",
    customerName: "Fast Transport LLC",
    totalSpend: 6500.75,
    companyApiCalls: 125,
    driverApiCalls: 625,
    vehicleApiCalls: 425,
    locationApiCalls: 1750,
    planName: "Basic Plan",
  },
  {
    id: "5",
    customerName: "City Movers",
    totalSpend: 9250.25,
    companyApiCalls: 185,
    driverApiCalls: 925,
    vehicleApiCalls: 625,
    locationApiCalls: 2850,
    planName: "Standard Plan",
  },
]

export default function BillingReportsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  
  React.useEffect(() => {
    // Set initial date on client-side only
    setDate(new Date())
  }, [])

  // Define columns for the revenue reports table
  const revenueColumns: ColumnDef<RevenueReport>[] = [
    {
      accessorKey: "period",
      header: "Period",
    },
    {
      accessorKey: "totalRevenue",
      header: "Total Revenue",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("totalRevenue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "companyApiRevenue",
      header: "Company API",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("companyApiRevenue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "driverApiRevenue",
      header: "Driver API",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("driverApiRevenue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "vehicleApiRevenue",
      header: "Vehicle API",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("vehicleApiRevenue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "locationApiRevenue",
      header: "Location API",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("locationApiRevenue"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "customerCount",
      header: "Customers",
    },
    {
      accessorKey: "growth",
      header: "Growth",
      cell: ({ row }) => {
        const growth = Number.parseFloat(row.getValue("growth"))
        const formatted = `${growth.toFixed(2)}%`
        return (
          <div className={`${growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : ""}`}>
            {growth > 0 ? "+" : ""}
            {formatted}
          </div>
        )
      },
    },
  ]

  // Define columns for the customer reports table
  const customerColumns: ColumnDef<CustomerReport>[] = [
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "planName",
      header: "Plan",
    },
    {
      accessorKey: "totalSpend",
      header: "Total Spend",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("totalSpend"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "companyApiCalls",
      header: "Company API Calls",
    },
    {
      accessorKey: "driverApiCalls",
      header: "Driver API Calls",
    },
    {
      accessorKey: "vehicleApiCalls",
      header: "Vehicle API Calls",
    },
    {
      accessorKey: "locationApiCalls",
      header: "Location API Calls",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing Reports</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : "Select month"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
          <TabsTrigger value="customer">Customer Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue Reports</CardTitle>
                <CardDescription>Monthly revenue breakdown by API service</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileBarChart className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={revenueColumns}
                data={revenueReports}
                searchKey="period"
                searchPlaceholder="Search by period..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customer" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Reports</CardTitle>
                <CardDescription>API usage and spending by customer</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileBarChart className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={customerColumns}
                data={customerReports}
                searchKey="customerName"
                searchPlaceholder="Search by customer name..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
