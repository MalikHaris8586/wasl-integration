"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/reduxhook/Hook"
import { fetchBillingUsage } from "../../admin/store/slices/billingSlice"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { Download, CreditCard } from "lucide-react"

export default function CustomerBillingPage() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.billing)

  const token = useSelector((state: any) => state.auth.token)
  
  useEffect(() => {
    if (token) {
      dispatch(fetchBillingUsage({ token }))
    }
  }, [token, dispatch])

  // Agar API se data nahi aa raha, to default empty zero data use karenge
  const usageData = data && Object.keys(data).length > 0 ? data : {
    driver: { used: 0, allowed: 0 },
    company: { used: 0, allowed: 0 },
    vehicle: { used: 0, allowed: 0 },
    location: { used: 0, allowed: 0 },
  }

  const priceMap: Record<string, number> = {
    driver: 2,
    company: 5,
    vehicle: 3,
    location: 1,
  }

  const formatLabel = (key: string) =>
    key.charAt(0).toUpperCase() + key.slice(1) + " API"

  const totalUsageCost = Object.entries(usageData).reduce(
    (total, [key, val]) => total + val.used * (priceMap[key] || 0),
    0
  )

  // Empty invoices since API not providing them
  const invoices = []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing & Usage</h1>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage & Limits</CardTitle>
              <CardDescription>Monthly usage for WASL services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading &&
                Object.entries(usageData).map(([key, val]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{formatLabel(key)}</h4>
                        <p className="text-xs text-muted-foreground">
                          {val.used} of {val.allowed} calls used
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        SAR {priceMap[key]} per call
                      </div>
                    </div>
                    <Progress value={val.allowed ? (val.used / val.allowed) * 100 : 0} className="h-2" />
                  </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div>
                <p className="text-sm font-medium">Total Usage Cost</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="text-xl font-bold">
                SAR {totalUsageCost}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-center text-muted-foreground">No invoices available</p>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(invoice.date).toLocaleDateString()} •
                          <span
                            className={`ml-2 ${
                              invoice.status === "paid"
                                ? "text-green-500"
                                : invoice.status === "pending"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "SAR",
                          }).format(invoice.amount)}
                        </p>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Payment method example */}
                <p>No Payment Methods available Right Now</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
