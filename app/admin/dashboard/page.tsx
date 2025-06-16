// components/admin/AdminDashboard.tsx
"use client"

import {
  Activity,
  Building2,
  Car,
  CreditCard,
  User,
  Users,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { fetchDashboardData } from "../store/slices/dashboardSlice"
import { useAppDispatch } from "../../redux/store" // typed dispatch
import { RootState } from "../../redux/store"

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const loading = useSelector((state: RootState) => state.admindashboard.loading)
  const error = useSelector((state: RootState) => state.admindashboard.error)
  const dashboardData = useSelector((state: RootState) => state.admindashboard.data)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardData())
    }
  }, [dispatch, token])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    )

  if (!dashboardData)
    return (
      <div className="flex justify-center items-center h-screen">
        No data available
      </div>
    )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
      

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Customers"
              icon={<Users />}
              value={dashboardData.users_count}
              description="Active customers"
            />
            <SummaryCard
              title="Total Companies"
              icon={<Building2 />}
              value={dashboardData.companies_count}
              description="Registered with WASL"
            />
            <SummaryCard
              title="Total Drivers"
              icon={<User />}
              value={dashboardData.drivers_count}
              description="Registered with WASL"
            />
            <SummaryCard
              title="Total Vehicles"
              icon={<Car />}
              value={dashboardData.vehicles_count}
              description="Registered with WASL"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Revenue from WASL API usage this month
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[200px] flex items-center justify-center text-4xl font-bold">
                  {dashboardData.monthly_revenue.amount}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current status of all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemStatus />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>
                  Total API calls: {dashboardData.api_usage_summary.total_api_calls}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.api_usage_summary.details.map((api, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            i === 0 ? "bg-blue-500" :
                            i === 1 ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        <p className="text-sm">{api.api}</p>
                      </div>
                      <p className="text-sm font-medium">{api.calls} calls</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
               
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Invoices</CardTitle>
                <CardDescription>
                  {dashboardData.pending_invoices.count} invoices awaiting payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.pending_invoices.invoices.slice(0, 3).map((inv, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm">{inv.company}</p>
                      <p className="text-sm font-medium">{inv.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View All Invoices
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.activities.slice(0, 3).map((act) => (
                    <div key={act.id} className="flex items-start gap-2">
                      <Activity className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{act.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {act.description} • {new Date(act.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
              
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
              <CardDescription>
                Monthly API usage trends across all services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                API usage chart would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Full Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All system activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2 border-b pb-4 last:border-0">
                    <Activity className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{act.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {act.description} • {new Date(act.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
}

function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
  <div className="flex items-center justify-between w-full">
    <CardTitle className="text-sm font-medium">{title}</CardTitle>
    <span className="text-muted-foreground h-4 w-4 flex items-center justify-center">
      {icon}
    </span>
  </div>
</CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function SystemStatus() {
  const systems = [
    { name: "WASL API Connection", status: "Operational" },
    { name: "Genesis Integration", status: "Operational" },
    { name: "Database Status", status: "Operational" },
    { name: "Billing System", status: "Operational" },
  ]
  return (
    <div className="space-y-4">
      {systems.map((s, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div>
            <p className="text-sm font-medium">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
