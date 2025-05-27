"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Building2,
  Car,
  CreditCard,
  Edit,
  Key,
  Mail,
  MapPin,
  Phone,
  Server,
  Settings,
  Shield,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { EditCustomerDialog } from "@/components/admin/edit-customer-dialog"
import { CustomerActivityLog } from "@/components/admin/customer-activity-log"
import { DeleteCustomerDialog } from "@/components/admin/delete-customer-dialog"

// Define the customer type
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

// Sample data for customers
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
  // Other customers...
]

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCustomer = customers.find((c) => c.id === params.id)
    if (foundCustomer) {
      setCustomer(foundCustomer)
    } else {
      // Customer not found, redirect to customers list
      router.push("/admin/customers")
    }
  }, [params.id, router])

  if (!customer) {
    return <div>Loading...</div>
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Calculate usage percentages
  const companyUsagePercent = (customer.usageStats.companiesUsed / customer.usageStats.companiesLimit) * 100
  const driverUsagePercent = (customer.usageStats.driversUsed / customer.usageStats.driversLimit) * 100
  const vehicleUsagePercent = (customer.usageStats.vehiclesUsed / customer.usageStats.vehiclesLimit) * 100

  const handleEditCustomer = (updatedCustomer: any) => {
    setCustomer({ ...customer, ...updatedCustomer })
    setIsEditOpen(false)
  }

  const handleDeleteCustomer = () => {
    // In a real app, this would be an API call
    router.push("/admin/customers")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/customers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          {customer.isActive ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Inactive
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsActivityLogOpen(true)}>
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </Button>
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                    <p className="text-base">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-base">
                      {customer.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Inactive
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-base">{customer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-base">{customer.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-base">{customer.notes || "No notes available"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">{formatDate(customer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                  <p className="text-base">{formatDate(customer.lastLogin)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
              <CardDescription>Current usage across all WASL services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">Companies</span>
                  </div>
                  <span className="text-sm">
                    {customer.usageStats.companiesUsed} / {customer.usageStats.companiesLimit}
                  </span>
                </div>
                <Progress value={companyUsagePercent} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm font-medium">Drivers</span>
                  </div>
                  <span className="text-sm">
                    {customer.usageStats.driversUsed} / {customer.usageStats.driversLimit}
                  </span>
                </div>
                <Progress value={driverUsagePercent} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-sm font-medium">Vehicles</span>
                  </div>
                  <span className="text-sm">
                    {customer.usageStats.vehiclesUsed} / {customer.usageStats.vehiclesLimit}
                  </span>
                </div>
                <Progress value={vehicleUsagePercent} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Usage
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage & Limits</CardTitle>
              <CardDescription>Detailed breakdown of WASL API usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Company API</h4>
                      <p className="text-sm text-muted-foreground">Used for registering companies with WASL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {customer.usageStats.companiesUsed} / {customer.usageStats.companiesLimit}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.usageStats.companiesLimit - customer.usageStats.companiesUsed} remaining
                    </p>
                  </div>
                </div>
                <Progress value={companyUsagePercent} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <h4 className="font-medium">Driver API</h4>
                      <p className="text-sm text-muted-foreground">Used for registering drivers with WASL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {customer.usageStats.driversUsed} / {customer.usageStats.driversLimit}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.usageStats.driversLimit - customer.usageStats.driversUsed} remaining
                    </p>
                  </div>
                </div>
                <Progress value={driverUsagePercent} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-2 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Vehicle API</h4>
                      <p className="text-sm text-muted-foreground">Used for registering vehicles with WASL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {customer.usageStats.vehiclesUsed} / {customer.usageStats.vehiclesLimit}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.usageStats.vehiclesLimit - customer.usageStats.vehiclesUsed} remaining
                    </p>
                  </div>
                </div>
                <Progress value={vehicleUsagePercent} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                    <div>
                      <h4 className="font-medium">Location API</h4>
                      <p className="text-sm text-muted-foreground">Used for posting vehicle locations to WASL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Unlimited</div>
                    <p className="text-sm text-muted-foreground">No limit applied</p>
                  </div>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Adjust Limits
              </Button>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Billing Details
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Genesis (Wialon) integration configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Genesis URL</p>
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-base">{customer.url}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-base">{customer.ipAddress}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Genesis Session Key</p>
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-base break-all">{customer.genesisSessionKey}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>Current status of the WASL integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Company Registration</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-500" />
                    <span>Driver Registration</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Vehicle Registration</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                    <span>Location Posting</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage account security and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Account Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {customer.isActive ? "Active and accessible" : "Inactive and restricted"}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password Reset</h4>
                  <p className="text-sm text-muted-foreground">Send a password reset link to the customer</p>
                </div>
                <Button variant="outline" size="sm">
                  Reset Password
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Require 2FA for additional security</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Not Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">API Access</h4>
                  <p className="text-sm text-muted-foreground">Control API access for this customer</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Enabled
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
              <Button variant={customer.isActive ? "destructive" : "default"}>
                {customer.isActive ? "Deactivate Account" : "Activate Account"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>Recent login attempts for this account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Successful Login</p>
                    <p className="text-sm text-muted-foreground">IP: 192.168.1.45</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Success
                    </Badge>
                    <p className="text-sm text-muted-foreground">{formatDate(customer.lastLogin)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Failed Login Attempt</p>
                    <p className="text-sm text-muted-foreground">IP: 203.0.113.42</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Failed
                    </Badge>
                    <p className="text-sm text-muted-foreground">2023-04-19 15:30:22</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Successful Login</p>
                    <p className="text-sm text-muted-foreground">IP: 192.168.1.45</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Success
                    </Badge>
                    <p className="text-sm text-muted-foreground">2023-04-18 09:15:10</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Login History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {customer && (
        <>
          <EditCustomerDialog
            customer={customer}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleEditCustomer}
          />

          <DeleteCustomerDialog
            customerName={customer.name}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={handleDeleteCustomer}
          />

          <CustomerActivityLog
            customerId={customer.id}
            customerName={customer.name}
            open={isActivityLogOpen}
            onOpenChange={setIsActivityLogOpen}
          />
        </>
      )}
    </div>
  )
}
