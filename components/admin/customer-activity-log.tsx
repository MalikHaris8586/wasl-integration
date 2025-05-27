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
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Download, Filter, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the activity log entry type
type ActivityLogEntry = {
  id: string
  customerId: string
  timestamp: string
  action: string
  details: string
  user: string
  category: "auth" | "api" | "admin" | "system"
  status: "success" | "warning" | "error" | "info"
}

interface CustomerActivityLogProps {
  customerId: string
  customerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerActivityLog({ customerId, customerName, open, onOpenChange }: CustomerActivityLogProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Sample activity log data
  const activityLog: ActivityLogEntry[] = [
    {
      id: "1",
      customerId,
      timestamp: "2023-04-22T10:30:00Z",
      action: "Login",
      details: "User logged in successfully",
      user: "admin@acme.com",
      category: "auth",
      status: "success",
    },
    {
      id: "2",
      customerId,
      timestamp: "2023-04-22T09:15:00Z",
      action: "API Call",
      details: "Register new company with WASL",
      user: "admin@acme.com",
      category: "api",
      status: "success",
    },
    {
      id: "3",
      customerId,
      timestamp: "2023-04-21T14:45:00Z",
      action: "API Call",
      details: "Register new driver with WASL",
      user: "admin@acme.com",
      category: "api",
      status: "warning",
    },
    {
      id: "4",
      customerId,
      timestamp: "2023-04-21T11:20:00Z",
      action: "Settings Update",
      details: "Updated integration settings",
      user: "admin@acme.com",
      category: "admin",
      status: "info",
    },
    {
      id: "5",
      customerId,
      timestamp: "2023-04-20T16:30:00Z",
      action: "API Call",
      details: "Register new vehicle with WASL",
      user: "admin@acme.com",
      category: "api",
      status: "error",
    },
    {
      id: "6",
      customerId,
      timestamp: "2023-04-20T10:00:00Z",
      action: "Login",
      details: "Failed login attempt",
      user: "admin@acme.com",
      category: "auth",
      status: "error",
    },
    {
      id: "7",
      customerId,
      timestamp: "2023-04-19T15:45:00Z",
      action: "System",
      details: "Account activated",
      user: "system",
      category: "system",
      status: "success",
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Filter activity log based on tab, search query, and status filter
  const filteredLog = activityLog.filter((entry) => {
    // Filter by tab
    if (activeTab !== "all" && entry.category !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !entry.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !entry.details.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by status
    if (filterStatus !== "all" && entry.status !== filterStatus) {
      return false
    }

    return true
  })

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Success
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Error
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Info
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Activity Log for {customerName}</DialogTitle>
          <DialogDescription>View all activity related to this customer account</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="api">API Calls</TabsTrigger>
            <TabsTrigger value="admin">Admin Actions</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-4">
                {filteredLog.length > 0 ? (
                  filteredLog.map((entry) => (
                    <div key={entry.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.action}</span>
                          {getStatusBadge(entry.status)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{formatDate(entry.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{entry.details}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        <span>{entry.user}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity logs found matching your filters
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>
              Showing {filteredLog.length} of {activityLog.length} activities
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
