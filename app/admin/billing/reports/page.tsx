"use client"

import { useState, useEffect, useMemo } from "react"
import { CalendarIcon, Download, FileBarChart, Filter, Printer } from "lucide-react"
import { format } from "date-fns"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { AppDispatch, RootState } from "../../store/store"
import { fetchBillingReport } from "../../store/slices/billingReportSlice"

// Types
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
    period: "April 2024",
    totalRevenue: 4500,
    companyApiRevenue: 1200,
    driverApiRevenue: 1500,
    vehicleApiRevenue: 1300,
    locationApiRevenue: 500,
    customerCount: 20,
    growth: 15,
  },
]

const customerReports: CustomerReport[] = [
  {
    id: "1",
    customerName: "Company A",
    totalSpend: 1200,
    companyApiCalls: 300,
    driverApiCalls: 400,
    vehicleApiCalls: 500,
    locationApiCalls: 0,
    planName: "Standard Plan",
  },
]

export default function BillingReportsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const billingReport = useSelector((state: RootState) => state.billingReport)
  const token = useSelector((state: RootState) => state.auth.token)
  const billingData = billingReport?.data || null
  const loading = billingReport?.loading || false
  const error = billingReport?.error || null

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [reportType, setReportType] = useState("monthly")

  useEffect(() => {
    const currentDate = new Date()
    setDate(currentDate)

    const to = new Date()
    const from = new Date()
    from.setMonth(from.getMonth() - 1)

    dispatch(fetchBillingReport({
      filter: "last_month",
      from: from.toISOString(),
      to: to.toISOString()
    }))
  }, [dispatch])

  useEffect(() => {
    if (date) {
      const to = new Date(date)
      const from = new Date(date)

      switch (reportType) {
        case "monthly":
          from.setMonth(from.getMonth() - 1)
          break
        case "quarterly":
          from.setMonth(from.getMonth() - 3)
          break
        case "yearly":
          from.setFullYear(from.getFullYear() - 1)
          break
      }

      dispatch(fetchBillingReport({
        filter: reportType,
        from: from.toISOString(),
        to: to.toISOString()
      }))
    }
  }, [date, reportType, dispatch])

  const handleExportCSV = () => {
    try {
      if (!revenueReports || revenueReports.length === 0) {
        console.error('No data to export');
        return;
      }

      // Convert data to CSV format
      const headers = [
        'Period',
        'Total Revenue',
        'Company API Revenue',
        'Driver API Revenue',
        'Vehicle API Revenue',
        'Location API Revenue',
        'Customer Count',
        'Growth (%)'
      ];

      const csvData = [
        headers.join(','), // Header row
        ...revenueReports.map(row => [
          row.period,
          row.totalRevenue,
          row.companyApiRevenue,
          row.driverApiRevenue,
          row.vehicleApiRevenue,
          row.locationApiRevenue,
          row.customerCount,
          row.growth
        ].join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue-report-${reportType}-${format(date || new Date(), 'yyyy-MM')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!date) return;
      
      const to = new Date(date);
      const from = new Date(date);
      
      switch (reportType) {
        case "monthly":
          from.setMonth(from.getMonth() - 1);
          break;
        case "quarterly":
          from.setMonth(from.getMonth() - 3);
          break;
        case "yearly":
          from.setFullYear(from.getFullYear() - 1);
          break;
      }

      const response = await axios.get('https://wasl-api.tracking.me/api/admin/revenue-report-pdf', {
        params: {
          filter: reportType,
          from: from.toISOString(),
          to: to.toISOString()
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue-report-${reportType}-${format(date, 'yyyy-MM')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleCustomerExportPDF = async () => {
    try {
      if (!date) return;
      
      const to = new Date(date);
      const from = new Date(date);
      
      switch (reportType) {
        case "monthly":
          from.setMonth(from.getMonth() - 1);
          break;
        case "quarterly":
          from.setMonth(from.getMonth() - 3);
          break;
        case "yearly":
          from.setFullYear(from.getFullYear() - 1);
          break;
      }

      const response = await axios.get('https://wasl-api.tracking.me/api/admin/billing-report-customer-export', {
        params: {
          filter: reportType,
          from: from.toISOString(),
          to: to.toISOString()
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customer-report-${reportType}-${format(date, 'yyyy-MM')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting customer PDF:', error);
    }
  };

  const handleCustomerExportCSV = async () => {
    try {
      if (!date) return;
      
      const to = new Date(date);
      const from = new Date(date);
      
      switch (reportType) {
        case "monthly":
          from.setMonth(from.getMonth() - 1);
          break;
        case "quarterly":
          from.setMonth(from.getMonth() - 3);
          break;
        case "yearly":
          from.setFullYear(from.getFullYear() - 1);
          break;
      }

      const response = await axios.get('https://wasl-api.tracking.me/api/admin/billing-report-customer-excel', {
        params: {
          filter: reportType,
          from: from.toISOString(),
          to: to.toISOString()
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customer-report-${reportType}-${format(date, 'yyyy-MM')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting customer Excel:', error);
    }
  };

  // ✅ Revenue table columns (with "period")
  const revenueColumns: ColumnDef<RevenueReport>[] = [
    { accessorKey: "period", header: "Period" },
    { accessorKey: "totalRevenue", header: "Total Revenue" },
    { accessorKey: "companyApiRevenue", header: "Company API Revenue" },
    { accessorKey: "driverApiRevenue", header: "Driver API Revenue" },
    { accessorKey: "vehicleApiRevenue", header: "Vehicle API Revenue" },
    { accessorKey: "locationApiRevenue", header: "Location API Revenue" },
    { accessorKey: "customerCount", header: "Customers" },
    { accessorKey: "growth", header: "Growth (%)" },
  ]

  // ✅ Customer table columns
  const customerColumns: ColumnDef<CustomerReport>[] = [
    { accessorKey: "customerName", header: "Customer Name" },
    { accessorKey: "totalSpend", header: "Total Spend" },
    { accessorKey: "companyApiCalls", header: "Company API Calls" },
    { accessorKey: "driverApiCalls", header: "Driver API Calls" },
    { accessorKey: "vehicleApiCalls", header: "Vehicle API Calls" },
    { accessorKey: "locationApiCalls", header: "Location API Calls" },
    { accessorKey: "planName", header: "Plan" },
  ]

  const transformedCustomerReports = useMemo(() => {
    if (!billingData?.users) return customerReports

    return billingData.users.map((user) => ({
      id: user.user_id?.toString() || Math.random().toString(),
      customerName: user.user_name || "Unknown Customer",
      totalSpend: parseFloat(user.total_spend) || 0,
      companyApiCalls: parseInt(user.company_count) || 0,
      driverApiCalls: parseInt(user.driver_count) || 0,
      vehicleApiCalls: parseInt(user.vehicle_count) || 0,
      locationApiCalls: 0,
      planName: "Standard Plan",
    }))
  }, [billingData])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Error loading reports: {error.toString()}
      </div>
    )
  }

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
          <Select value={reportType} onValueChange={setReportType}>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleExportCSV}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleExportPDF}
                >
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleCustomerExportCSV}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleCustomerExportPDF}
                >
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
                data={transformedCustomerReports}
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
