"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarDays, Clock, CreditCard, Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

const subscriptionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Subscription name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  billingCycle: z.enum(["monthly", "quarterly", "yearly"]),
  trialDays: z.coerce.number().min(0, {
    message: "Trial days must be a positive number or zero.",
  }),
  features: z.string().min(5, {
    message: "Features must be at least 5 characters.",
  }),
  isActive: z.boolean(),
})

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>

type Subscription = SubscriptionFormValues & {
  id: string
  createdAt: string
  subscriberCount: number
}

// Sample data
const subscriptions: Subscription[] = [
  {
    id: "1",
    name: "Basic Plan",
    description: "For small businesses with limited WASL needs",
    price: 99.99,
    billingCycle: "monthly",
    trialDays: 14,
    features:
      "Company API: 50 calls/month\nDriver API: 200 calls/month\nVehicle API: 150 calls/month\nLocation API: 1,000 calls/month",
    isActive: true,
    createdAt: "2023-01-15",
    subscriberCount: 8,
  },
  {
    id: "2",
    name: "Standard Plan",
    description: "For medium-sized businesses with moderate WASL usage",
    price: 199.99,
    billingCycle: "monthly",
    trialDays: 14,
    features:
      "Company API: 100 calls/month\nDriver API: 500 calls/month\nVehicle API: 350 calls/month\nLocation API: 2,500 calls/month",
    isActive: true,
    createdAt: "2023-01-15",
    subscriberCount: 12,
  },
  {
    id: "3",
    name: "Enterprise Plan",
    description: "For large businesses with high WASL volume",
    price: 499.99,
    billingCycle: "monthly",
    trialDays: 30,
    features:
      "Company API: 250 calls/month\nDriver API: 1,250 calls/month\nVehicle API: 1,000 calls/month\nLocation API: 10,000 calls/month",
    isActive: true,
    createdAt: "2023-01-15",
    subscriberCount: 5,
  },
]

export function SubscriptionManagement() {
  const [subs, setSubs] = useState<Subscription[]>(subscriptions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      billingCycle: "monthly",
      trialDays: 14,
      features: "",
      isActive: true,
    },
  })

  const handleAddSubscription = async (values: SubscriptionFormValues) => {
    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newSub: Subscription = {
      ...values,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString().split("T")[0],
      subscriberCount: 0,
    }

    setSubs((prev) => [...prev, newSub])
    setIsPending(false)
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Subscription plan created",
      description: `${values.name} has been created successfully.`,
    })
  }

  const handleEditSubscription = async (values: SubscriptionFormValues) => {
    if (!currentSub) return

    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedSubs = subs.map((sub) => (sub.id === currentSub.id ? { ...sub, ...values } : sub))

    setSubs(updatedSubs)
    setIsPending(false)
    setIsEditDialogOpen(false)

    toast({
      title: "Subscription plan updated",
      description: `${values.name} has been updated successfully.`,
    })
  }

  const handleDeleteSubscription = async () => {
    if (!currentSub) return

    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubs((prev) => prev.filter((sub) => sub.id !== currentSub.id))
    setIsPending(false)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Subscription plan deleted",
      description: `${currentSub.name} has been deleted successfully.`,
    })
  }

  const openEditDialog = (subscription: Subscription) => {
    setCurrentSub(subscription)
    form.reset(subscription)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (subscription: Subscription) => {
    setCurrentSub(subscription)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Subscription Plans</h2>
        <Button
          onClick={() => {
            form.reset({
              name: "",
              description: "",
              price: 0,
              billingCycle: "monthly",
              trialDays: 14,
              features: "",
              isActive: true,
            })
            setIsAddDialogOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Subscription Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subs.map((subscription) => (
          <Card key={subscription.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{subscription.name}</CardTitle>
                <Badge variant={subscription.isActive ? "default" : "outline"}>
                  {subscription.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{subscription.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "SAR",
                  }).format(subscription.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{subscription.billingCycle.replace("ly", "")}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{subscription.trialDays} days free trial</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{subscription.subscriberCount} active subscribers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Created on {new Date(subscription.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-2 font-medium">Features:</h4>
                <div className="rounded-md bg-muted p-3">
                  <pre className="text-xs">{subscription.features}</pre>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(subscription)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(subscription)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Subscription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Subscription Plan</DialogTitle>
            <DialogDescription>Create a new subscription plan for customers to purchase.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSubscription)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enterprise Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="For large businesses with high WASL volume" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (SAR)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="trialDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial Days</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Number of free trial days (0 for no trial)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Company API: 250 calls/month
Driver API: 1,250 calls/month
Vehicle API: 1,000 calls/month
Location API: 10,000 calls/month"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter each feature on a new line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>Make this subscription plan available to customers</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Plan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>Update the details of this subscription plan.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubscription)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enterprise Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="For large businesses with high WASL volume" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (SAR)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="trialDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial Days</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Number of free trial days (0 for no trial)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>Enter each feature on a new line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>Make this subscription plan available to customers</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Plan"}
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
            <DialogTitle>Delete Subscription Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">
              You are about to delete: <span className="font-bold">{currentSub?.name}</span>
            </p>
            {currentSub?.subscriberCount > 0 && (
              <p className="mt-2 text-sm text-destructive">
                Warning: This plan has {currentSub.subscriberCount} active subscribers.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubscription} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
