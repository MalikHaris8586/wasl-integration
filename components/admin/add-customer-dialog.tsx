"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertCircle, HelpCircle } from "lucide-react"

// Schema
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
          "Password must contain uppercase, lowercase, number, and special character.",
      }),
    confirmPassword: z.string().min(8, { message: "Confirm Password is required." }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
    ipAddress: z.string().optional(),
    genesisSessionKey: z.string().min(1, { message: "Genesis Session Key is required." }),
    url: z.string().url({ message: "Please enter a valid URL." }),
    isActive: z.boolean().default(true),
    notes: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

interface AddCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: Omit<FormValues, "password" | "confirmPassword">) => void
}

export function AddCustomerDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      ipAddress: "",
      genesisSessionKey: "",
      url: "",
      isActive: true,
      notes: "",
    },
  })

  function handleSubmit(values: FormValues) {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const { password, confirmPassword, ...customerData } = values
      onSubmit(customerData)
      form.reset()
      setActiveTab("account")
    }, 1000)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset()
          setActiveTab("account")
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to the system. They will be able to access the platform with these credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account Information</TabsTrigger>
                <TabsTrigger value="integration">Integration Details</TabsTrigger>
              </TabsList>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-4 mt-4">
                {/* Name */}
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl><Input placeholder="Customer company name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {/* Email */}
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="customer@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Password</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                            <TooltipContent>
                              <p>Password must contain:</p>
                              <ul className="list-disc pl-4 text-xs">
                                <li>8 characters</li><li>Uppercase</li><li>Lowercase</li><li>Number</li><li>Special char</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Phone */}
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input placeholder="+966 123456789" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Notes */}
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl><Input placeholder="Additional notes..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </TabsContent>

              {/* Integration Tab */}
              <TabsContent value="integration" className="space-y-4 mt-4">
                <div className="rounded-md bg-blue-50 p-4 mb-4 flex gap-3">
                  <AlertCircle className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Integration Information</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Required for WASL & Genesis (Wialon) integration.
                    </p>
                  </div>
                </div>

                {/* IP Address */}
                <FormField control={form.control} name="ipAddress" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>IP Address</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent><p>Genesis server IP</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl><Input placeholder="192.168.1.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Session Key */}
                <FormField control={form.control} name="genesisSessionKey" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genesis Session Key</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* URL */}
                <FormField control={form.control} name="url" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genesis URL</FormLabel>
                    <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Active Toggle */}
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between border p-3 rounded-lg shadow-sm">
                    <div>
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable customer access
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <DialogFooter className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                {activeTab === "account" ? (
                  <Button type="button" onClick={() => setActiveTab("integration")}>
                    Next: Integration Details
                  </Button>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={() => setActiveTab("account")}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Customer"}
                    </Button>
                  </>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
