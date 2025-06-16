"use client"

import { useEffect, useMemo } from "react"
import { CreditCard, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppDispatch, useAppSelector } from "../../redux/reduxhook/Hook"
import { fetchBillingUsage, fetchInvoices } from "../../redux/auth/CustomerBillingSlice"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function CustomerBillingPage() {
	const dispatch = useAppDispatch()

	const { usage, loading, error, invoices, invoicesLoading, invoicesError } = useAppSelector((state) => state.CustomerBilling)

	type ApiCallUsage = {
		used: number
		allowed: number
	}
	type UsageType = {
		api_calls: Record<string, ApiCallUsage>
	}

	const currentPlan = {
		name: "Standard Plan",
		description: "For medium-sized businesses with moderate WASL usage",
	}

	useEffect(() => {
		dispatch(fetchBillingUsage())
		dispatch(fetchInvoices())
	}, [dispatch])

	const pricePerCallMap = {
		driver: 2,
		company: 5,
		vehicle: 3,
		location: 1,
	}

	const usageArray = useMemo(() => {
		if (!usage || typeof usage !== "object" || !("api_calls" in usage)) return []
		return Object.entries((usage as UsageType).api_calls).map(([key, data]) => ({
			apiType: `${key.charAt(0).toUpperCase()}${key.slice(1)} API`,
			used: data.used,
			limit: data.allowed,
			pricePerCall: pricePerCallMap[key as keyof typeof pricePerCallMap] || 1,
		}))
	}, [usage])

	const totalUsageCost = useMemo(() => {
		return usageArray.reduce((total, item) => total + item.used * item.pricePerCall, 0)
	}, [usageArray])

	// 🔽 PDF DOWNLOAD HANDLER
const companyName = "Wialon"
const companyLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed%20%2810%29-lfBmCiSfcbJsi0OWVCdlU1IatKR60p.png"
const generateInvoicePDF = (invoice: any) => {
	const doc = new jsPDF()
	const img = new window.Image()
	img.crossOrigin = "anonymous"
	img.src = companyLogo

	const drawPDFContent = () => {
		// Header
		doc.addImage(img, "PNG", 10, 10, 25, 18)
		doc.setFontSize(18)
		doc.setFont("helvetica", "bold")
		doc.text("Wialon", 40, 20)
		doc.setFontSize(10)
		doc.setFont("helvetica", "normal")
		doc.text("WASL Integration", 40, 27)

		doc.setFontSize(13)
		doc.setFont("helvetica", "bold")
		doc.text("Invoice", 160, 20, { align: "right" })

		doc.setFontSize(10)
		doc.setFont("helvetica", "normal")
		doc.text("Invoice #: INV-2025-051", 14, 40)
		doc.text("Invoice Date: June 13, 2025", 14, 46)
		doc.text("Due Date: June 16, 2025", 14, 52)
		doc.text("Customer: Haris", 14, 58)
		doc.text("Email: harisali123@gmail.com", 14, 64)

		autoTable(doc, {
			startY: 75,
			head: [["#", "Description", "Qty", "Unit Price", "Total"]],
			body: [["1", "23/07/24", "1", "100.00 SAR", "100.00 SAR"]],
			theme: "grid",
			headStyles: { fillColor: [41, 128, 185], halign: "center" },
			bodyStyles: { halign: "center" },
			styles: { fontSize: 9, cellPadding: 2 },
			columnStyles: {
				0: { cellWidth: 10 },
				1: { cellWidth: 60, halign: "left" },
				2: { cellWidth: 20 },
				3: { cellWidth: 35 },
				4: { cellWidth: 35 },
			},
			margin: { left: 14, right: 14 },
		})

		let finalY = (doc as any).lastAutoTable.finalY || 100
		doc.setFontSize(10)
		doc.setFont("helvetica", "normal")
		doc.text(`Subtotal: SAR 100.00`, 200, finalY + 10, { align: "right" })
		doc.text(`VAT (15%): SAR 15.00`, 200, finalY + 17, { align: "right" })
		doc.setFontSize(11)
		doc.setFont("helvetica", "bold")
		doc.text(`Total: SAR 115.00`, 200, finalY + 26, { align: "right" })

		doc.setFontSize(9)
		doc.setFont("helvetica", "normal")
		doc.text("Thank you for your business!", 14, finalY + 35)

		doc.save(`invoice-INV-2025-051.pdf`)
	}

	img.onload = drawPDFContent

	img.onerror = () => {
		console.warn("Logo failed to load, generating PDF without image.")
		drawPDFContent()
	}
}


	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Billing & Usage</h1>

			<Tabs defaultValue="usage" className="space-y-4">
				<TabsList>
					<TabsTrigger value="usage">Usage & Limits</TabsTrigger>
					<TabsTrigger value="invoices">Invoices</TabsTrigger>
				</TabsList>

				<TabsContent value="usage" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>API Usage & Limits</CardTitle>
							<CardDescription>Current month's usage across all WASL API services</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{loading && <p>Loading usage data...</p>}
							{error && <p className="text-red-500">Failed to load usage data</p>}
							{!loading &&
								usageArray.map((item, index) => (
									<div key={index} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<h4 className="text-sm font-medium">{item.apiType}</h4>
												<p className="text-xs text-muted-foreground">
													{item.used} of {item.limit} calls used
												</p>
											</div>
											<div className="text-sm font-medium">
												{new Intl.NumberFormat("en-US", {
													style: "currency",
													currency: "SAR",
												}).format(item.pricePerCall)}{" "}
												per call
											</div>
										</div>
										<Progress value={(item.used / item.limit) * 100} className="h-2" />
									</div>
								))}
						</CardContent>
						<CardFooter className="flex justify-between border-t pt-6">
							<div>
								<p className="text-sm font-medium">Current Usage Cost</p>
								<p className="text-xs text-muted-foreground">This month so far</p>
							</div>
							<div className="text-xl font-bold">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "SAR",
								}).format(totalUsageCost)}
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
							{invoicesLoading && <p>Loading invoices...</p>}
							{invoicesError && <p className="text-red-500">Failed to load invoices</p>}
							<div className="space-y-4">
								{!invoicesLoading && Array.isArray(invoices) && invoices.length > 0 ? (
									invoices.map((invoice: any) => (
										<div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0">
											<div>
												<p className="font-medium">{invoice.invoice_number || invoice.user_id}</p>
												<p className="text-sm text-muted-foreground">
													{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : "-"} •
													<span
														className={`ml-2 ${
															invoice.invoice_status === "paid"
																? "text-green-500"
																: invoice.invoice_status === "pending"
																? "text-yellow-500"
																: "text-red-500"
														}`}
													>
														{invoice.invoice_status
															? invoice.invoice_status.charAt(0).toUpperCase() +
															  invoice.invoice_status.slice(1)
															: "-"}
													</span>
												</p>
											</div>
											<div className="flex items-center gap-4">
												<p className="font-medium">
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: "SAR",
													}).format(invoice.total || 0)}
												</p>
												<Button
													variant="outline"
													size="sm"
													className="flex items-center gap-1"
													onClick={generateInvoicePDF}
												>
													<Download className="h-4 w-4"  onClick={() => generateInvoicePDF(invoice)}/>
													PDF
												</Button>
											</div>
										</div>
									))
								) : (
									!invoicesLoading && <p>No invoices found.</p>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
