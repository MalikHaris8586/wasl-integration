"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Download, Printer, Building2, User, Car, ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { 
  fetchAccessControlReport, 
  fetchOverviewReport, 
  fetchCompanyReport, 
  fetchDriverReport, 
  fetchVehiclesReport, 
  fetchDetailReport,
  selectSummary,
  selectApiCalls,
  selectOverviewData,
  selectCompanyReport,
  selectDriverReport,
  selectVehiclesReport,
  selectDetailReport,
  selectLoading
} from '../../store/slices/reportSlice';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ReportUser, CompanyReport, DriverReport, VehicleReport, DetailReport } from '../../types/report';

export default function AccessControlReportsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const summary = useSelector(selectSummary);
  const api_calls = useSelector(selectApiCalls);
  const overviewData = useSelector(selectOverviewData);
  const loading = useSelector(selectLoading);
  const token = useSelector((state: RootState) => state.auth.token);

  const companyReport = useSelector(selectCompanyReport);
  const driverReport = useSelector(selectDriverReport);
  const vehiclesReport = useSelector(selectVehiclesReport);
  const detailReport = useSelector(selectDetailReport);

  const [timeframe, setTimeframe] = useState("last_month");
  const [companyTimeframe, setCompanyTimeframe] = useState("last_month");
  const [driverTimeframe, setDriverTimeframe] = useState("last_month");
  const [vehiclesTimeframe, setVehiclesTimeframe] = useState("last_month");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      dispatch(fetchAccessControlReport());
      dispatch(fetchOverviewReport(timeframe));
    }
  }, [dispatch, token, timeframe]);

  useEffect(() => {
    if (token) dispatch(fetchCompanyReport(companyTimeframe));
  }, [dispatch, token, companyTimeframe]);

  useEffect(() => {
    if (token) dispatch(fetchDriverReport(driverTimeframe));
  }, [dispatch, token, driverTimeframe]);

  useEffect(() => {
    if (token) dispatch(fetchVehiclesReport(vehiclesTimeframe));
  }, [dispatch, token, vehiclesTimeframe]);

  useEffect(() => {
    if (token) dispatch(fetchDetailReport(timeframe));
  }, [dispatch, token, timeframe]);

  // Summary values
  const totalCustomers = summary.find(s => s.label === "Total Customers")?.count || 0;
  const customersNearLimit = summary.find(s => s.label === "Total Customers")?.description?.match(/\d+/)?.[0] || 0;

  const totalCompanyUsed = api_calls?.company?.used || 0;
  const totalCompanyLimits = api_calls?.company?.allowed || 0;
  const totalDriverUsed = api_calls?.driver?.used || 0;
  const totalDriverLimits = api_calls?.driver?.allowed || 0;
  const totalVehicleUsed = api_calls?.vehicle?.used || 0;
  const totalVehicleLimits = api_calls?.vehicle?.allowed || 0;

  console.log('API Calls Data:', {
    company: api_calls?.company,
    driver: api_calls?.driver,
    vehicle: api_calls?.vehicle
  });

  const chartData = overviewData
    ? [
        { name: "Companies", used: overviewData.data.company || 0, limit: totalCompanyLimits },
        { name: "Drivers", used: overviewData.data.driver || 0, limit: totalDriverLimits },
        { name: "Vehicles", used: overviewData.data.vehicle || 0, limit: totalVehicleLimits },
      ]
    : [
        { name: "Companies", used: totalCompanyUsed, limit: totalCompanyLimits },
        { name: "Drivers", used: totalDriverUsed, limit: totalDriverLimits },
        { name: "Vehicles", used: totalVehicleUsed, limit: totalVehicleLimits },
      ];

  // Add debug logging
  useEffect(() => {
    console.log('Summary:', summary);
    console.log('API Calls:', api_calls);
    console.log('Overview Data:', overviewData);
    console.log('Chart Data:', chartData);
  }, [summary, api_calls, overviewData, chartData]);

  // Add debug log for detailReport
  useEffect(() => {
    console.log('Detail Report:', detailReport);
  }, [detailReport]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };
  
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
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_quarter">Last Quarter</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
         
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {Number(customersNearLimit) > 0 && `${customersNearLimit} customers near limit`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company API Usage</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCompanyLimits ? Math.round((totalCompanyUsed / totalCompanyLimits) * 100) : 0}%
            </div>
            <Progress value={totalCompanyLimits ? (totalCompanyUsed / totalCompanyLimits) * 100 : 0} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Driver API Usage</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDriverLimits ? Math.round((totalDriverUsed / totalDriverLimits) * 100) : 0}%
            </div>
            <Progress value={totalDriverLimits ? (totalDriverUsed / totalDriverLimits) * 100 : 0} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicle API Usage</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalVehicleLimits ? Math.round((totalVehicleUsed / totalVehicleLimits) * 100) : 0}%
            </div>
            <Progress value={totalVehicleLimits ? (totalVehicleUsed / totalVehicleLimits) * 100 : 0} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="Detailed Report">Detailed Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Overview</CardTitle>
              <CardDescription>Summary of all API usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="used" fill="#3b82f6" name="Used" />
                    <Bar dataKey="limit" fill="#94a3b8" name="Limit" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Companies Registration Report</CardTitle>
                <CardDescription>
                  {companyReport && `From ${format(new Date(companyReport.from), 'PPP')} to ${format(new Date(companyReport.to), 'PPP')}`}
                </CardDescription>
              </div>
              <Select value={companyTimeframe} onValueChange={setCompanyTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">Loading report data...</p>
                  </div>
                ) : companyReport && companyReport.users.length > 0 ? (
                  <>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={companyReport.users}
                          margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="user_name"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            tickFormatter={(value) => String(Math.floor(value))}
                            domain={[0, 'auto']}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                            formatter={(value) => [value, 'Companies Registered']}
                          />
                          <Bar
                            dataKey="company_registered_count"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                            name="Companies Registered"
                          >
                            {companyReport.users.map((entry: ReportUser) => (
                              <Cell key={`cell-${entry.user_id}`} fill="#3b82f6" />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80%]">User Name</TableHead>
                            <TableHead className="text-right">Companies Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companyReport.users.map((user: ReportUser) => (
                            <TableRow key={user.user_id}>
                              <TableCell className="font-medium">{user.user_name}</TableCell>
                              <TableCell className="text-right">{user.company_registered_count || 0}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="text-right font-bold">
                              {companyReport.total}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">No data available for the selected timeframe</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Drivers Registration Report</CardTitle>
                <CardDescription>
                  {driverReport && `From ${format(new Date(driverReport.from), 'PPP')} to ${format(new Date(driverReport.to), 'PPP')}`}
                </CardDescription>
              </div>
              <Select value={driverTimeframe} onValueChange={setDriverTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">Loading report data...</p>
                  </div>
                ) : driverReport && driverReport.users.length > 0 ? (
                  <>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={driverReport.users}
                          margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="user_name"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            tickFormatter={(value) => String(Math.floor(value))}
                            domain={[0, 'auto']}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                            formatter={(value) => [value, 'Drivers Registered']}
                          />
                          <Bar
                            dataKey="Driver_registered_count"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                            name="Drivers Registered"
                          >
                            {driverReport.users.map((entry: ReportUser) => (
                              <Cell key={`cell-${entry.user_id}`} fill="#3b82f6" />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80%]">User Name</TableHead>
                            <TableHead className="text-right">Drivers Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {driverReport.users.map((user: ReportUser) => (
                            <TableRow key={user.user_id}>
                              <TableCell className="font-medium">{user.user_name}</TableCell>
                              <TableCell className="text-right">{user.Driver_registered_count || 0}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="text-right font-bold">
                              {driverReport.total}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">No data available for the selected timeframe</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vehicles Registration Report</CardTitle>
                <CardDescription>
                  {vehiclesReport &&
                    `From ${format(new Date(vehiclesReport.from), 'PPP')} to ${format(
                      new Date(vehiclesReport.to),
                      'PPP'
                    )}`}
                </CardDescription>
              </div>
              <Select value={vehiclesTimeframe} onValueChange={setVehiclesTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">Loading report data...</p>
                  </div>
                ) : vehiclesReport && vehiclesReport.users && vehiclesReport.users.length > 0 ? (
                  <>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={vehiclesReport.users}
                          margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="user_name"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            tickFormatter={(value) => String(Math.floor(value))}
                            domain={[0, 'auto']}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                            formatter={(value) => [value, 'Vehicles Registered']}
                          />
                          <Bar
                            dataKey="vehicle_registered_count"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                            name="Vehicles Registered"
                          >
                            {vehiclesReport.users.map((entry: ReportUser) => (
                              <Cell key={`cell-${entry.user_id}`} fill="#3b82f6" />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80%]">User Name</TableHead>
                            <TableHead className="text-right">Vehicles Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vehiclesReport.users.map((user: ReportUser) => (
                            <TableRow key={user.user_id}>
                              <TableCell className="font-medium">{user.user_name}</TableCell>
                              <TableCell className="text-right">{user.vehicle_registered_count || 0}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="text-right font-bold">
                              {vehiclesReport.total || 0}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">
                      No data available for the selected timeframe
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Detailed Report">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Access Control Report</CardTitle>
              <CardDescription>Comprehensive report of all access control limits and usage</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show fallback if no customers */}
              {(!detailReport?.customers || detailReport.customers.length === 0) ? (
                <div className="flex h-[200px] items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected timeframe</p>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Drivers</TableHead>
                    <TableHead>Vehicles</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailReport?.customers?.map((item: {
                    id: string;
                    customerName: string;
                    status: 'active' | 'warning' | 'critical';
                    companiesLimit: number;
                    driversLimit: number;
                    vehiclesLimit: number;
                    companiesUsed: number;
                    driversUsed: number;
                    vehiclesUsed: number;
                    lastUpdated: string;
                  }) => (
                    <>
                      <TableRow 
                        key={item.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleRow(item.id)}
                      >
                        <TableCell>
                          {expandedRows.includes(item.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
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
                        <TableCell>{format(new Date(item.lastUpdated), "PPP")}</TableCell>
                      </TableRow>
                      {expandedRows.includes(item.id) && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <Tabs defaultValue="companies" className="w-full">
                                <TabsList className="w-full justify-start">
                                  <TabsTrigger value="companies">Companies Details</TabsTrigger>
                                  <TabsTrigger value="drivers">Drivers Details</TabsTrigger>
                                  <TabsTrigger value="vehicles">Vehicles Details</TabsTrigger>
                                </TabsList>
                                <TabsContent value="companies">
                                  <div className="space-y-4">
                                  </div>
                                </TabsContent>
                                <TabsContent value="drivers">
                                  <div className="space-y-4">
                                  </div>
                                </TabsContent>
                                <TabsContent value="vehicles">
                                </TabsContent>
                              </Tabs>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
