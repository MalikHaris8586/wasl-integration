"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, DollarSign, Plus, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchPaymentPlanDashboard,
  fetchBillingPlans,
} from "../../admin/store/slices/paymentPlanSlice";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddBillingPlanDialog } from "@/components/admin/add-billing-plan-dialog";
import { EditBillingPlanDialog } from "@/components/admin/edit-billing-plan-dialog";
import { DeleteBillingPlanDialog } from "@/components/admin/delete-billing-plan-dialog";

type BillingPlan = {
  id: string;
  name: string;
  description: string;
  companyApiPrice: number;
  driverApiPrice: number;
  vehicleApiPrice: number;
  locationApiPrice: number;
  isActive: boolean;
};

type Invoice = {
  id: string;
  customerName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
};

const invoices: Invoice[] = [
  {
    id: "1",
    customerName: "ABC Corp",
    invoiceNumber: "INV-001",
    date: "2025-05-01",
    amount: 1200,
    status: "paid",
  },
];

export default function BillingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const { dashboardData, billingPlans, loading } = useSelector(
    (state: RootState) => state.paymentPlan
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchPaymentPlanDashboard());
      dispatch(fetchBillingPlans());
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

  const handleAddPlan = async (values: {
    name: string;
    description: string;
    companyApiCount: number;
    driverApiCount: number;
    vehicleApiCount: number;
    locationApiCount: number;
    totalPrice: number;
  }) => {
    // Submit logic here
    setIsAddPlanOpen(false);
  };

  const handleEditPlan = (plan: BillingPlan) => setEditPlan(plan);
  const handleDeletePlan = (plan: BillingPlan) => setDeletePlan(plan);

  const handleEditPlanSubmit = (updatedPlan: BillingPlan) => {
    // TODO: Dispatch update action here
    setEditPlan(null);
  };
  const handleDeletePlanSubmit = (plan: BillingPlan) => {
    // TODO: Dispatch delete action here
    setDeletePlan(null);
  };

  const planColumns: ColumnDef<BillingPlan>[] = [
    { accessorKey: "name", header: "Plan Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "companyApiPrice",
      header: "Company API Price",
      cell: ({ row }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(parseFloat(row.getValue("companyApiPrice"))),
    },
    {
      accessorKey: "driverApiPrice",
      header: "Driver API Price",
      cell: ({ row }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(parseFloat(row.getValue("driverApiPrice"))),
    },
    {
      accessorKey: "vehicleApiPrice",
      header: "Vehicle API Price",
      cell: ({ row }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(parseFloat(row.getValue("vehicleApiPrice"))),
    },
    {
      accessorKey: "locationApiPrice",
      header: "Location API Price",
      cell: ({ row }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(parseFloat(row.getValue("locationApiPrice"))),
    },
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

  const invoiceColumns: ColumnDef<Invoice>[] = [
    { accessorKey: "invoiceNumber", header: "Invoice #" },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SAR",
        }).format(row.getValue("amount")),
    },
    { accessorKey: "status", header: "Status" },
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
            <DataTable columns={planColumns} data={billingPlans} />
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
