"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Check, CreditCard, Info, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

const paypalFormSchema = z.object({
  clientId: z.string().min(10, {
    message: "Client ID must be at least 10 characters.",
  }),
  clientSecret: z.string().min(10, {
    message: "Client Secret must be at least 10 characters.",
  }),
  sandboxMode: z.boolean(),
})

const stripeFormSchema = z.object({
  publishableKey: z.string().min(10, {
    message: "Publishable Key must be at least 10 characters.",
  }),
  secretKey: z.string().min(10, {
    message: "Secret Key must be at least 10 characters.",
  }),
  webhookSecret: z.string().min(10, {
    message: "Webhook Secret must be at least 10 characters.",
  }),
  testMode: z.boolean(),
})

type PayPalFormValues = z.infer<typeof paypalFormSchema>
type StripeFormValues = z.infer<typeof stripeFormSchema>

export function PaymentGatewaySettings() {
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const paypalForm = useForm<PayPalFormValues>({
    resolver: zodResolver(paypalFormSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      sandboxMode: true,
    },
  })

  const stripeForm = useForm<StripeFormValues>({
    resolver: zodResolver(stripeFormSchema),
    defaultValues: {
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
      testMode: true,
    },
  })

  const onPayPalSubmit = async (values: PayPalFormValues) => {
    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(values)
    setIsPending(false)
    toast({
      title: "PayPal settings updated",
      description: "Your PayPal payment gateway settings have been saved successfully.",
    })
  }

  const onStripeSubmit = async (values: StripeFormValues) => {
    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(values)
    setIsPending(false)
    toast({
      title: "Stripe settings updated",
      description: "Your Stripe payment gateway settings have been saved successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Gateway Settings
        </CardTitle>
        <CardDescription>Configure payment gateways for processing customer payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stripe" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="mt-4 space-y-4">
            <Form {...stripeForm}>
              <form onSubmit={stripeForm.handleSubmit(onStripeSubmit)} className="space-y-4">
                <FormField
                  control={stripeForm.control}
                  name="publishableKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publishable Key</FormLabel>
                      <FormControl>
                        <Input placeholder="pk_..." {...field} />
                      </FormControl>
                      <FormDescription>Your Stripe publishable key (starts with pk_)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stripeForm.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="sk_..." {...field} />
                      </FormControl>
                      <FormDescription>Your Stripe secret key (starts with sk_)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stripeForm.control}
                  name="webhookSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="whsec_..." {...field} />
                      </FormControl>
                      <FormDescription>Your Stripe webhook signing secret (starts with whsec_)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stripeForm.control}
                  name="testMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Test Mode</FormLabel>
                        <FormDescription>Enable test mode to use Stripe in a sandbox environment</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="flex items-center gap-2" disabled={isPending}>
                  {isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Stripe Settings
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="paypal" className="mt-4 space-y-4">
            <Form {...paypalForm}>
              <form onSubmit={paypalForm.handleSubmit(onPayPalSubmit)} className="space-y-4">
                <FormField
                  control={paypalForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PayPal client ID" {...field} />
                      </FormControl>
                      <FormDescription>Your PayPal client ID from the developer dashboard</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paypalForm.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter PayPal client secret" {...field} />
                      </FormControl>
                      <FormDescription>Your PayPal client secret from the developer dashboard</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paypalForm.control}
                  name="sandboxMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Sandbox Mode</FormLabel>
                        <FormDescription>Enable sandbox mode to use PayPal in a test environment</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="flex items-center gap-2" disabled={isPending}>
                  {isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save PayPal Settings
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="mr-2 h-4 w-4" />
          Payment gateway settings are encrypted and stored securely
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                <Check className="h-4 w-4" />
                SSL Secured
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>All payment data is transmitted over secure SSL connections</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}
