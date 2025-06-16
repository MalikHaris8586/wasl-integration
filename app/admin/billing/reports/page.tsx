"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
import { AppDispatch, RootState } from "../../../redux/store"
import { fetchBillingReport } from "../../store/slices/billingReportSlice"
import { fetchRevenueReport, selectRevenueReport } from "../../store/slices/revenueReportSlice"
import { useToast } from "@/hooks/use-toast"

// Types
// Fix: RevenueReport type to match API and DataTable usage
export type RevenueReport = {
  id: string;
  period: string;
  totalRevenue: string; // Accept string for SAR values
  companyApiRevenue: string;
  driverApiRevenue: string;
  vehicleApiRevenue: string;
  locationApiRevenue: string;
  customerCount: number;
  growth: string;
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
    totalRevenue: "4500",
    companyApiRevenue: "1200",
    driverApiRevenue: "1500",
    vehicleApiRevenue: "1300",
    locationApiRevenue: "500",
    customerCount: 20,
    growth: "15",
  },
]

export default function BillingReportsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const billingReport = useSelector((state: RootState) => state.billingReport)
  const revenueReport = useSelector(selectRevenueReport);
  const token = useSelector((state: RootState) => state.auth.token)
  const billingData = billingReport?.data || null
  const loading = billingReport?.loading || false
  const error = billingReport?.error || null
  const revenueLoading = revenueReport.loading;
  const revenueError = revenueReport.error;
  const revenueData = revenueReport.data;
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [reportType, setReportType] = useState("monthly")
  const [activeTab, setActiveTab] = useState("revenue");

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
        to: to.toISOString(),
      }));
      dispatch(fetchRevenueReport({
        filter: reportType,
        from: from.toISOString(),
        to: to.toISOString(),
      }));
    }
  }, [date, reportType, dispatch])

  const handleExportCSV = async () => {
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
      const response = await axios.get('https://wasl-api.tracking.me/api/admin/revenue-report-export', {
        params: {
          filter: reportType,
          from: from.toISOString(),
          to: to.toISOString(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue-report-${reportType}-${format(date, 'yyyy-MM')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "PDF Exported",
        description: "Revenue report PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF.",
        variant: "destructive"
      });
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

      // Log export parameters and customer data for backend debugging
      console.log('Exporting customer PDF with params:', {
        filter: reportType,
        from: from.toISOString(),
        to: to.toISOString(),
        token
      });
      console.log('Customer data in table (billingData.users):', billingData?.users);

      // Changed endpoint to /api/admin/billing-report-customer-export for PDF export
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

      // Debug: Log response size and headers
      console.log('PDF export response:', response);
      if (response.data.size === 0) {
        toast({
          title: "No Data",
          description: "No customer data found for the selected period.",
          variant: "destructive"
        });
        return;
      }

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
      // Use the correct API for customer report CSV export
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
      // Download as CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customer-report-${reportType}-${format(date, 'yyyy-MM')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting customer CSV:', error);
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
    { accessorKey: "companyApiCalls", header: "Company Count" },
    { accessorKey: "driverApiCalls", header: "Driver Count" },
    { accessorKey: "vehicleApiCalls", header: "Vehicle Count" },
    { accessorKey: "planName", header: "Plan" },
  ];

  // Transform billingData.users to match the columns
  const transformedCustomerReports = useMemo(() => {
    if (!billingData?.users) return [];
    return billingData.users.map((user: any) => ({
      id: user.user_id?.toString() || Math.random().toString(),
      customerName: user.user_name || "Unknown Customer",
      totalSpend: parseFloat(user.total_spend) || 0,
      companyApiCalls: parseInt(user.company_count) || 0,
      driverApiCalls: parseInt(user.driver_count) || 0,
      vehicleApiCalls: parseInt(user.vehicle_count) || 0,
      planName: "Standard Plan",
    }));
  }, [billingData]);

  // Transform API revenue data for DataTable
  const transformedRevenueReports = useMemo(() => {
    if (!revenueData || revenueData.length === 0) return [];
    return revenueData.map((item, idx) => ({
      id: idx.toString(),
      period: item.Period,
      totalRevenue: item["Total Revenue"],
      companyApiRevenue: item["Company API Revenue"] ?? "SAR 0.00",
      driverApiRevenue: item["Driver API Revenue"] ?? "SAR 0.00",
      vehicleApiRevenue: item["Vehicle API Revenue"] ?? "SAR 0.00",
      locationApiRevenue: item["Location API Revenue"] ?? "SAR 0.00",
      customerCount: item.Customers,
      growth: item.Growth,
    }));
  }, [revenueData])

  // Helper to fetch customer report if needed
  const fetchCustomerIfNeeded = useCallback(() => {
    if (!billingData?.users || billingData.users.length === 0) {
      const to = date ? new Date(date) : new Date();
      const from = new Date(to);
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
      dispatch(fetchBillingReport({
        filter: reportType,
        from: from.toISOString(),
        to: to.toISOString(),
      }));
    }
  }, [billingData, date, reportType, dispatch]);

  // Refetch customer report when switching to customer tab
  useEffect(() => {
    if (activeTab === "customer") {
      fetchCustomerIfNeeded();
    }
  }, [activeTab, fetchCustomerIfNeeded]);

  if (revenueLoading) {
    return <div className="flex justify-center items-center h-64">Loading revenue reports...</div>;
  }
  if (revenueError) {
    return <div className="flex justify-center items-center h-64 text-red-600">Error loading revenue reports: {revenueError}</div>;
  }

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                data={transformedRevenueReports}
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
