"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, Car, Clock, CreditCard, Mail, MapPin, Phone, Server, User } from "lucide-react"

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
}

interface CustomerDetailsDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Calculate usage percentages
  const companyUsagePercent = (customer.usageStats.companiesUsed / customer.usageStats.companiesLimit) * 100
  const driverUsagePercent = (customer.usageStats.driversUsed / customer.usageStats.driversLimit) * 100
  const vehicleUsagePercent = (customer.usageStats.vehiclesUsed / customer.usageStats.vehiclesLimit) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{customer.name}</DialogTitle>
          <DialogDescription>
            Customer ID: {customer.id} •{" "}
            {customer.isActive ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{customer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{customer.ipAddress}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Account Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Created: {formatDate(customer.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Last Login: {formatDate(customer.lastLogin)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
                <CardDescription>Current usage across all WASL services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Current billing plan and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Standard Plan</h4>
                      <p className="text-sm text-muted-foreground">Monthly billing cycle</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Plan
                  </Button>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">API Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Company API</span>
                      <span>SAR 5.00 per call</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver API</span>
                      <span>SAR 2.00 per call</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle API</span>
                      <span>SAR 3.00 per call</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location API</span>
                      <span>SAR 0.50 per call</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Detailed information about this customer account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Customer Name</h4>
                    <p>{customer.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h4>
                    <p>{customer.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h4>
                    <p>{customer.phoneNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">IP Address</h4>
                    <p>{customer.ipAddress}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Genesis Session Key</h4>
                    <p className="break-all">{customer.genesisSessionKey}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">URL</h4>
                    <p>{customer.url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security & Access</CardTitle>
                <CardDescription>Security settings and access control</CardDescription>
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
                    <h4 className="font-medium">Last Login</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(customer.lastLogin)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Account Created</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Edit Customer</Button>
            <Button>Manage Limits</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
