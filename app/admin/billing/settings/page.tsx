"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentGatewaySettings } from "@/components/admin/payment-gateway-settings"
import { SubscriptionManagement } from "@/components/admin/subscription-management"
import { UsageAlerts } from "@/components/admin/usage-alerts"
import { InvoiceGenerator } from "@/components/admin/invoice-generator"

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing Settings</h1>
      </div>

      <Tabs defaultValue="payment" className="space-y-4">
        <TabsList className="">
          {/* <TabsTrigger value="payment">Payment Gateways</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="alerts">Usage Alerts</TabsTrigger> */}
          <TabsTrigger value="invoice">Invoice Generator</TabsTrigger>
        </TabsList>

        {/* <TabsContent value="payment" className="space-y-4">
          <PaymentGatewaySettings />
        </TabsContent> */}

        {/* <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionManagement />
        </TabsContent> */}

        {/* <TabsContent value="alerts" className="space-y-4">
          <UsageAlerts />
        </TabsContent> */}

        <TabsContent value="invoice" className="space-y-4">
          <InvoiceGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
