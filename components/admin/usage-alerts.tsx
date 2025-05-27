"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AlertTriangle, Bell, BellOff, Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

const alertFormSchema = z.object({
  name: z.string().min(2, {
    message: "Alert name must be at least 2 characters.",
  }),
  apiType: z.enum(["company", "driver", "vehicle", "location", "all"]),
  thresholdType: z.enum(["percentage", "absolute"]),
  thresholdValue: z.coerce.number().positive({
    message: "Threshold must be a positive number.",
  }),
  notifyEmail: z.boolean(),
  notifyDashboard: z.boolean(),
  isActive: z.boolean(),
})

type AlertFormValues = z.infer<typeof alertFormSchema>

type Alert = AlertFormValues & {
  id: string
  createdAt: string
}

// Sample data
const alerts: Alert[] = [
  {
    id: "1",
    name: "High Usage Warning",
    apiType: "all",
    thresholdType: "percentage",
    thresholdValue: 80,
    notifyEmail: true,
    notifyDashboard: true,
    isActive: true,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "Critical Usage Alert",
    apiType: "all",
    thresholdType: "percentage",
    thresholdValue: 95,
    notifyEmail: true,
    notifyDashboard: true,
    isActive: true,
    createdAt: "2023-05-15",
  },
  {
    id: "3",
    name: "Driver API Limit",
    apiType: "driver",
    thresholdType: "absolute",
    thresholdValue: 1000,
    notifyEmail: true,
    notifyDashboard: false,
    isActive: true,
    createdAt: "2023-06-10",
  },
]

export function UsageAlerts() {
  const [alertsList, setAlertsList] = useState<Alert[]>(alerts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      name: "",
      apiType: "all",
      thresholdType: "percentage",
      thresholdValue: 80,
      notifyEmail: true,
      notifyDashboard: true,
      isActive: true,
    },
  })

  const handleAddAlert = async (values: AlertFormValues) => {
    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newAlert: Alert = {
      ...values,
      id: `alert-${Date.now()}-${alertsList.length + 1}`,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setAlertsList((prev) => [...prev, newAlert])
    setIsPending(false)
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Alert created",
      description: `${values.name} has been created successfully.`,
    })
  }

  const handleEditAlert = async (values: AlertFormValues) => {
    if (!currentAlert) return

    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedAlerts = alertsList.map((alert) => (alert.id === currentAlert.id ? { ...alert, ...values } : alert))

    setAlertsList(updatedAlerts)
    setIsPending(false)
    setIsEditDialogOpen(false)

    toast({
      title: "Alert updated",
      description: `${values.name} has been updated successfully.`,
    })
  }

  const handleDeleteAlert = async () => {
    if (!currentAlert) return

    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setAlertsList((prev) => prev.filter((alert) => alert.id !== currentAlert.id))
    setIsPending(false)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Alert deleted",
      description: `${currentAlert.name} has been deleted successfully.`,
    })
  }

  const toggleAlertStatus = async (alert: Alert) => {
    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedAlerts = alertsList.map((a) => (a.id === alert.id ? { ...a, isActive: !a.isActive } : a))

    setAlertsList(updatedAlerts)
    setIsPending(false)

    toast({
      title: `Alert ${!alert.isActive ? "enabled" : "disabled"}`,
      description: `${alert.name} has been ${!alert.isActive ? "enabled" : "disabled"}.`,
    })
  }

  const openEditDialog = (alert: Alert) => {
    setCurrentAlert(alert)
    form.reset(alert)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (alert: Alert) => {
    setCurrentAlert(alert)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Usage Alerts</h2>
        <Button
          onClick={() => {
            form.reset({
              name: "",
              apiType: "all",
              thresholdType: "percentage",
              thresholdValue: 80,
              notifyEmail: true,
              notifyDashboard: true,
              isActive: true,
            })
            setIsAddDialogOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Alert
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alertsList.map((alert) => (
          <Card key={alert.id} className={`${!alert.isActive ? "opacity-70" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {alert.name}
                </CardTitle>
                <Badge variant={alert.isActive ? "default" : "outline"}>{alert.isActive ? "Active" : "Disabled"}</Badge>
              </div>
              <CardDescription>Created on {new Date(alert.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Type:</span>
                  <span className="text-sm">
                    {alert.apiType === "all"
                      ? "All APIs"
                      : `${alert.apiType.charAt(0).toUpperCase() + alert.apiType.slice(1)} API`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Threshold:</span>
                  <span className="text-sm">
                    {alert.thresholdType === "percentage"
                      ? `${alert.thresholdValue}% of limit`
                      : `${alert.thresholdValue} calls`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications:</span>
                  <div className="flex items-center gap-2">
                    {alert.notifyEmail && (
                      <Badge variant="outline" className="text-xs">
                        Email
                      </Badge>
                    )}
                    {alert.notifyDashboard && (
                      <Badge variant="outline" className="text-xs">
                        Dashboard
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleAlertStatus(alert)} disabled={isPending}>
                  {alert.isActive ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  <span className="sr-only">{alert.isActive ? "Disable" : "Enable"}</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(alert)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </div>
              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(alert)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Alert Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Usage Alert</DialogTitle>
            <DialogDescription>Create a new alert to monitor API usage limits.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddAlert)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Name</FormLabel>
                    <FormControl>
                      <Input placeholder="High Usage Warning" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="apiType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select API type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All APIs</SelectItem>
                          <SelectItem value="company">Company API</SelectItem>
                          <SelectItem value="driver">Driver API</SelectItem>
                          <SelectItem value="vehicle">Vehicle API</SelectItem>
                          <SelectItem value="location">Location API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thresholdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshold Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select threshold type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage of Limit</SelectItem>
                          <SelectItem value="absolute">Absolute Value</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="thresholdValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Threshold Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      {form.watch("thresholdType") === "percentage"
                        ? "Percentage of the usage limit (e.g., 80 for 80%)"
                        : "Number of API calls"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="notifyEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notification</FormLabel>
                        <FormDescription>Send email notifications when threshold is reached</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifyDashboard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Dashboard Notification</FormLabel>
                        <FormDescription>Show notifications in the dashboard</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>Enable or disable this alert</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Alert"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Usage Alert</DialogTitle>
            <DialogDescription>Update the settings for this alert.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditAlert)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Name</FormLabel>
                    <FormControl>
                      <Input placeholder="High Usage Warning" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="apiType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select API type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All APIs</SelectItem>
                          <SelectItem value="company">Company API</SelectItem>
                          <SelectItem value="driver">Driver API</SelectItem>
                          <SelectItem value="vehicle">Vehicle API</SelectItem>
                          <SelectItem value="location">Location API</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thresholdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshold Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select threshold type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage of Limit</SelectItem>
                          <SelectItem value="absolute">Absolute Value</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="thresholdValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Threshold Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      {form.watch("thresholdType") === "percentage"
                        ? "Percentage of the usage limit (e.g., 80 for 80%)"
                        : "Number of API calls"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="notifyEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notification</FormLabel>
                        <FormDescription>Send email notifications when threshold is reached</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifyDashboard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Dashboard Notification</FormLabel>
                        <FormDescription>Show notifications in the dashboard</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>Enable or disable this alert</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Alert"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this alert? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">
              You are about to delete: <span className="font-bold">{currentAlert?.name}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAlert} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
