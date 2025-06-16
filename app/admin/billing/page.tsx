"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, DollarSign, Plus, Users, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchPaymentPlanDashboard,
  fetchBillingPlans,
  updateBillingPlan,
  createBillingPlan, // <-- import the thunk
  deleteBillingPlan, // <-- import the thunk
  fetchInvoices,
} from "../../admin/store/slices/paymentPlanSlice";
import type { BillingPlan } from "../../admin/types/billingPlan";
import axios from "axios";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddBillingPlanDialog } from "@/components/admin/add-billing-plan-dialog";
import { EditBillingPlanDialog } from "@/components/admin/edit-billing-plan-dialog";
import { DeleteBillingPlanDialog } from "@/components/admin/delete-billing-plan-dialog";
import { InvoiceGenerator } from "@/components/admin/invoice-generator";

export default function BillingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const { dashboardData, billingPlans, loading, invoices, invoicesPaging } = useSelector(
    (state: RootState) => state.paymentPlan
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchPaymentPlanDashboard());
      dispatch(fetchBillingPlans());
      dispatch(fetchInvoices({ page: 1 })); // fetch first page of invoices
    }
  }, [dispatch, token]);

  const {
    total_revenue,
    pending_revenue,
    active_customers,
  } = useMemo(() => {
    return {
      total_revenue: dashboardData?.total_revenue || { value: 0, change: "0%" },
      pending_revenue: dashboardData?.pending_revenue || { value: 0, change: "0%" },
      active_customers: dashboardData?.active_customers || { value: 0, change: "0%" },
    };
  }, [dashboardData]);

  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<BillingPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<BillingPlan | null>(null);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);

  const handleAddPlan = async (values: {
    name: string;
    description: string;
    companyApiCount: number;
    driverApiCount: number;
    vehicleApiCount: number;
    locationApiCount: number;
    totalPrice: number;
  }) => {
    // Map frontend fields to API fields
    const payload = {
      name: values.name,
      description: values.description,
      company_calls: values.companyApiCount,
      driver_calls: values.driverApiCount,
      vehicle_calls: values.vehicleApiCount,
      location_calls: values.locationApiCount,
      price: Number(values.totalPrice), // ensure price is a number
    };
    await dispatch(createBillingPlan(payload));
    // Refresh billing plans after add
    dispatch(fetchBillingPlans());
    setIsAddPlanOpen(false);
  };

  const handleEditPlan = (plan: BillingPlan) => setEditPlan(plan);
  const handleDeletePlan = (plan: BillingPlan) => setDeletePlan(plan);

  const handleEditPlanSubmit = async (updatedPlan: BillingPlan) => {
    if (updatedPlan && updatedPlan.id) {
      const payload = {
        name: updatedPlan.name,
        description: updatedPlan.description,
        company_calls: updatedPlan.companyApiPrice,
        driver_calls: updatedPlan.driverApiPrice,
        vehicle_calls: updatedPlan.vehicleApiPrice,
        location_calls: updatedPlan.locationApiPrice,
        isActive: updatedPlan.isActive ?? true,
      };
      console.log('Update Billing Plan Payload:', payload);
      await dispatch(updateBillingPlan({ id: updatedPlan.id, data: payload }));
      // Refresh billing plans after update
      dispatch(fetchBillingPlans());
    }
    setEditPlan(null);
  };
  const handleDeletePlanSubmit = async (plan: BillingPlan) => {
    if (plan && plan.id) {
      await dispatch(deleteBillingPlan(plan.id));
      dispatch(fetchBillingPlans()); // Refresh after delete
    }
    setDeletePlan(null);
  };

  // Export Invoices Handler
  const handleExportInvoices = async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        "https://wasl-api.tracking.me/api/invoice-export",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          responseType: "blob",
        }
      );
      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoices-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export invoices");
    }
  };

  // Invoice columns for API data
  const invoiceColumns: ColumnDef<any>[] = [
    {
      accessorKey: "invoice_number",
      header: () => "Invoice #",
    },
    {
      accessorKey: "user.name",
      header: () => "Customer",
      cell: (info) => info.row.original.user?.name || "-",
    },
    {
      accessorKey: "invoice_date",
      header: () => "Date",
      cell: (info) => info.row.original.invoice_date ? new Date(info.row.original.invoice_date).toLocaleDateString() : "-",
    },
    {
      accessorKey: "total",
      header: () => "Amount",
      cell: (info) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(Number(info.row.original.total) || 0),
    },
    {
      accessorKey: "invoice_status",
      header: () => "Status",
      cell: (info) => info.row.original.invoice_status,
    },
  ];

  // Billing Plan columns for DataTable
  const planColumns: ColumnDef<BillingPlan>[] = [
    { accessorKey: "name", header: "Plan Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "price",
      header: () => "Price",
      cell: (info) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(Number(info.row.original.companyApiPrice + info.row.original.driverApiPrice + info.row.original.vehicleApiPrice + (info.row.original.locationApiPrice || 0)) || 0),
    },
    { accessorKey: "companyApiPrice", header: "Company" },
    { accessorKey: "driverApiPrice", header: "Driver" },
    { accessorKey: "vehicleApiPrice", header: "Vehicle" },
    // { accessorKey: "locationApiPrice", header: "Location" },
   
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditPlan(row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeletePlan(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing Management</h1>
        <Button onClick={() => setIsAddPlanOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Billing Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "Loading..."
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "SAR",
                  }).format(total_revenue.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {total_revenue.change} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "Loading..."
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "SAR",
                  }).format(pending_revenue.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pending_revenue.change} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : active_customers.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {active_customers.change} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="billing-plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="billing-plans">Billing Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="billing-plans" className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable columns={planColumns} data={billingPlans} />
              {/* Dashboard summary row below the table */}
            </>
          )}
          <EditBillingPlanDialog
            open={!!editPlan}
            onOpenChange={(open) => {
              if (!Boolean(open)) setEditPlan(null);
            }}
            plan={editPlan}
            onEdit={handleEditPlanSubmit}
          />
          <DeleteBillingPlanDialog
            open={!!deletePlan}
            onOpenChange={(open) => {
              if (!Boolean(open)) setDeletePlan(null);
            }}
            plan={deletePlan}
            onDelete={handleDeletePlanSubmit}
          />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          
          <DataTable columns={invoiceColumns} data={invoices} />
          <div className="flex justify-between mb-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportInvoices}>
              <Download className="h-4 w-4" /> Export Invoices
            </Button>
            <Button variant="default" size="sm" className="flex items-center gap-1" onClick={() => {
              window.location.href = "/admin/billing/settings?tab=invoice-generator";
            }}>
              <Plus className="h-4 w-4" /> Generate New Invoice
            </Button>
          </div>
        </TabsContent>

      </Tabs>

      <AddBillingPlanDialog
        open={isAddPlanOpen}
        onOpenChange={setIsAddPlanOpen}
        onSubmit={handleAddPlan}
      />
    </div>
  );
}
