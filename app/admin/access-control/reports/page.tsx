"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Printer, Building2, User, Car } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Define the data type
type AccessControlReport = {
  id: string
  customerName: string
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
const accessControlReports: AccessControlReport[] = [
  {
    id: "1",
    customerName: "Acme Corporation",
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

export default function AccessControlReportsPage() {
  const [data] = useState<AccessControlReport[]>(accessControlReports)
  const [timeframe, setTimeframe] = useState("month")

  // Prepare data for charts
  const companyChartData = data.map((item) => ({
    name: item.customerName,
    used: item.companiesUsed,
    limit: item.companiesLimit,
    remaining: item.companiesLimit - item.companiesUsed,
  }))

  const driverChartData = data.map((item) => ({
    name: item.customerName,
    used: item.driversUsed,
    limit: item.driversLimit,
    remaining: item.driversLimit - item.driversUsed,
  }))

  const vehicleChartData = data.map((item) => ({
    name: item.customerName,
    used: item.vehiclesUsed,
    limit: item.vehiclesLimit,
    remaining: item.vehiclesLimit - item.vehiclesUsed,
  }))

  // Calculate summary statistics
  const totalCustomers = data.length
  const totalCompanyLimits = data.reduce((sum, item) => sum + item.companiesLimit, 0)
  const totalDriverLimits = data.reduce((sum, item) => sum + item.driversLimit, 0)
  const totalVehicleLimits = data.reduce((sum, item) => sum + item.vehiclesLimit, 0)
  const totalCompanyUsed = data.reduce((sum, item) => sum + item.companiesUsed, 0)
  const totalDriverUsed = data.reduce((sum, item) => sum + item.driversUsed, 0)
  const totalVehicleUsed = data.reduce((sum, item) => sum + item.vehiclesUsed, 0)
  const customersNearLimit = data.filter((item) => item.status === "warning" || item.status === "critical").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Access Control Reports</h1>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customersNearLimit > 0 && `${customersNearLimit} customers near limit`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company API Usage</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((totalCompanyUsed / totalCompanyLimits) * 100)}%</div>
            <div className="mt-2 h-2">
              <Progress value={(totalCompanyUsed / totalCompanyLimits) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Driver API Usage</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((totalDriverUsed / totalDriverLimits) * 100)}%</div>
            <div className="mt-2 h-2">
              <Progress value={(totalDriverUsed / totalDriverLimits) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle API Usage</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((totalVehicleUsed / totalVehicleLimits) * 100)}%</div>
            <div className="mt-2 h-2">
              <Progress value={(totalVehicleUsed / totalVehicleLimits) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Overview</CardTitle>
              <CardDescription>Summary of all API usage across customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    used: {
                      label: "Used",
                      color: "hsl(var(--chart-1))",
                    },
                    limit: {
                      label: "Limit",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: "Companies", used: totalCompanyUsed, limit: totalCompanyLimits },
                        { name: "Drivers", used: totalDriverUsed, limit: totalDriverLimits },
                        { name: "Vehicles", used: totalVehicleUsed, limit: totalVehicleLimits },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="used" fill="var(--color-used)" name="Used" />
                      <Bar dataKey="limit" fill="var(--color-limit)" name="Limit" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Company API Usage</CardTitle>
              <CardDescription>Detailed breakdown of company API usage by customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    used: {
                      label: "Used",
                      color: "hsl(var(--chart-1))",
                    },
                    remaining: {
                      label: "Remaining",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={companyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="used" stackId="a" fill="var(--color-used)" name="Used" />
                      <Bar dataKey="remaining" stackId="a" fill="var(--color-remaining)" name="Remaining" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Driver API Usage</CardTitle>
              <CardDescription>Detailed breakdown of driver API usage by customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    used: {
                      label: "Used",
                      color: "hsl(var(--chart-1))",
                    },
                    remaining: {
                      label: "Remaining",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={driverChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="used" stackId="a" fill="var(--color-used)" name="Used" />
                      <Bar dataKey="remaining" stackId="a" fill="var(--color-remaining)" name="Remaining" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle API Usage</CardTitle>
              <CardDescription>Detailed breakdown of vehicle API usage by customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    used: {
                      label: "Used",
                      color: "hsl(var(--chart-1))",
                    },
                    remaining: {
                      label: "Remaining",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={vehicleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="used" stackId="a" fill="var(--color-used)" name="Used" />
                      <Bar dataKey="remaining" stackId="a" fill="var(--color-remaining)" name="Remaining" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Access Control Report</CardTitle>
              <CardDescription>Comprehensive report of all access control limits and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Drivers</TableHead>
                    <TableHead>Vehicles</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.customerName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "active"
                              ? "outline"
                              : item.status === "warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {item.status === "active" ? "Active" : item.status === "warning" ? "Near Limit" : "Critical"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {item.companiesUsed}/{item.companiesLimit}
                          </span>
                          <Progress value={(item.companiesUsed / item.companiesLimit) * 100} className="h-1 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {item.driversUsed}/{item.driversLimit}
                          </span>
                          <Progress value={(item.driversUsed / item.driversLimit) * 100} className="h-1 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {item.vehiclesUsed}/{item.vehiclesLimit}
                          </span>
                          <Progress value={(item.vehiclesUsed / item.vehiclesLimit) * 100} className="h-1 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>{format(item.lastUpdated, "PPP")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
