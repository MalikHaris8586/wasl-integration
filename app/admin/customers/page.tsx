"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCustomerDialog } from "@/components/admin/add-customer-dialog";
import { EditCustomerDialog } from "@/components/admin/edit-customer-dialog";
import { DeleteCustomerDialog } from "@/components/admin/delete-customer-dialog";
import { CustomerDetailsDialog } from "@/components/admin/customer-details-dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  deleteApiAccessControl,
  deleteCustomer,
  updateCustomerStatus,
  updateCustomer,
} from "../store/slices/customerSlice";
import { AppDispatch } from "../../redux/store";

// Define the data type based on API response
interface AccessControl {
  id: number;
  name: string;
  // Add other access control fields if needed
}

interface Role {
  name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

type Customer = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  active: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  last_active_at: string | null;
  roles: Role[];
  access_control: AccessControl[];
  setting: {
    id: number;
    user_id: number;
    genesis_session_key: string;
    ip: string;
    url: string;
    created_at: string;
    updated_at: string;
  };
};

// Define dialog props types
interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    email: string;
    phoneNumber: string;
    ipAddress?: string;
    genesisSessionKey: string;
    url: string;
    isActive: boolean;
    notes?: string;
  }) => void;
}

interface EditCustomerDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    name: string;
    email: string;
    phoneNumber: string;
    ipAddress?: string;
    genesisSessionKey: string;
    url: string;
    isActive: boolean;
    notes?: string;
  }) => void;
}

interface CustomerDetailsDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DeleteCustomerDialogProps {
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function CustomersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error, pagination } = useSelector(
    (state: any) => state.customers
  );
  const [activeTab, setActiveTab] = useState("all");

  // Dialog states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const token = useSelector((state: any) => state.auth.token);
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchCustomers(1));
    }
  }, [dispatch, token]);

  // Calculate customer stats for cards
  const totalCustomers = customers?.length || 0;
  const activeCustomers =
    customers?.filter((c: Customer) => c.active === 1).length || 0;
  const inactiveCustomers =
    customers?.filter((c: Customer) => c.active === 0).length || 0;
  const recentlyActiveCustomers =
    customers?.filter((c: Customer) => {
      if (!c.last_active_at) return false;
      const lastActive = new Date(c.last_active_at);
      const now = new Date();
      const diffDays =
        (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length || 0;

  // Filter customers based on active tab
  const filteredCustomers =
    customers?.filter((customer: Customer) => {
      if (activeTab === "active") return customer.active === 1;
      if (activeTab === "inactive") return customer.active === 0;
      return true;
    }) || [];

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await dispatch(deleteCustomer(customerId)).unwrap();
      // Close the delete dialog
      setIsDeleteOpen(false);
      // Refresh the customers list
      dispatch(fetchCustomers(pagination.current_page));
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      alert(
        `Failed to delete customer: ${
          error.message || "Unknown error occurred"
        }`
      );
    }
  };

  const handleAddCustomer = async (values: {
    name: string;
    email: string;
    phoneNumber: string;
    ipAddress?: string;
    genesisSessionKey: string;
    url: string;
    isActive: boolean;
    notes?: string;
  }) => {
    try {
      // Format data exactly as per API requirements
      const customerData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        setting: {
          ipAddress: values.ipAddress || "",
          genesisSessionKey: values.genesisSessionKey,
          url: values.url,
        },
      };

      console.log("Submitting customer data:", customerData);

      const result = await dispatch(createCustomer(customerData)).unwrap();

      if (result?.data) {
        console.log("Customer created successfully:", result.data);
        setIsAddCustomerOpen(false);
        // Refresh the customers list
        dispatch(fetchCustomers(pagination.current_page));
      }
    } catch (error: any) {
      console.error("Error creating customer:", error);

      // Show a simple error message to the user
      let errorMessage = error.message || "Failed to create customer";
      if (error.originalError?.description) {
        errorMessage = JSON.stringify(error.originalError.description);
      }

      alert(`Error: ${errorMessage}`);
    }
  };

  // Add pagination handling
  const handlePageChange = (newPage: number) => {
    if (token) {
      dispatch(fetchCustomers(newPage));
    }
  };

  // Inside the CustomersPage component, update the handleEditCustomer function
  const handleEditCustomer = async (values: any) => {
    try {
      if (selectedCustomerId === null) {
        console.error("No customer selected");
        return;
      }

      // Format the data for the API
      const updateData = {
        userId: selectedCustomerId,
        data: {
          name: values.name,
          email: values.email,
          phone_number: values.phoneNumber,
          setting: {
            ip: values.ipAddress,
            genesis_session_key: values.genesisSessionKey,
            url: values.url,
          },
        },
      };

      console.log("Submitting edit data:", updateData);

      // Dispatch the update action
      await dispatch(updateCustomer(updateData)).unwrap();

      // Close the edit dialog
      setIsEditOpen(false);

      // Refresh the customer list
      dispatch(fetchCustomers(pagination.current_page));
    } catch (error: any) {
      console.error("Error updating customer:", error);
      let errorMessage = error.message || "Failed to update customer";
      if (error.originalError?.description) {
        errorMessage = JSON.stringify(error.originalError.description);
      }
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteApiAccess = async (id: number) => {
    try {
      await dispatch(deleteApiAccessControl(id)).unwrap();
      // Optional: Show success message
      alert("API access control deleted successfully");
    } catch (error: any) {
      // Extract error message properly
      let errorMessage = "Failed to delete API access control";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.type && error?.description) {
        errorMessage = `${error.type}: ${error.description}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show error message to user
      alert(errorMessage);
    }
  };

  const handleStatusChange = async (
    customerId: number,
    currentStatus: number
  ) => {
    try {
      // Toggle between 1 and 0
      const newStatus = currentStatus === 1 ? 0 : 1;
      await dispatch(
        updateCustomerStatus({ userId: customerId, active: newStatus })
      ).unwrap();
      // Refresh the list
      dispatch(fetchCustomers(pagination.current_page));
    } catch (error: any) {
      console.error("Error updating customer status:", error);
      alert(
        `Failed to update status: ${error.message || "Unknown error occurred"}`
      );
    }
  };

  // Define columns for the data table
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{customer.name}</span>
            <span className="text-xs text-muted-foreground">
              {customer.email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "setting.ip",
      header: "IP Address",
      cell: ({ row }) => {
        const ip = row.original.setting?.ip;
        return ip || "-";
      },
    },
    {
      accessorKey: "setting.url",
      header: "URL",
      cell: ({ row }) => {
        const url = row.original.setting?.url || "";
        return (
          <div className="max-w-[200px] truncate" title={url}>
            {url || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const customer = row.original;
        const isActive = customer.active === 1;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={() =>
                handleStatusChange(customer.id, customer.active)
              }
              aria-label="Toggle active status"
            />
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              className="border-gray-200 "
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await dispatch(fetchCustomerById(customer.id));
                  setIsDetailsOpen(true);
                } catch (error) {
                  console.error("Error fetching customer details:", error);
                }
              }}
            >
              <Eye className="h-4 w-4 " />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setIsEditOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setSelectedCustomer(customer);
                setIsDeleteOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
         
        </div>
        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              All registered customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {((activeCustomers / totalCustomers) * 100).toFixed(0)}% of total
              customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inactiveCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {((inactiveCustomers / totalCustomers) * 100).toFixed(0)}% of
              total customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recently Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {recentlyActiveCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              Active in the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>
 <h2 className="text-3xl font-semibold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
           Manage your customer accounts and their integration settings
          </p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <>
            <DataTable columns={columns} data={filteredCustomers} />
          </>
        )}
      </div>

      <AddCustomerDialog
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        onSubmit={handleAddCustomer}
      />
      {selectedCustomer && (
        <>
          <CustomerDetailsDialog
            customer={selectedCustomer}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <EditCustomerDialog
            customer={selectedCustomer}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleEditCustomer}
          />
          <DeleteCustomerDialog
            customerName={selectedCustomer.name}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={() => handleDeleteCustomer(selectedCustomer.id)}
          />
        </>
      )}
    </div>
  );
}
