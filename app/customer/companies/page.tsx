"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchCompanies,
  registerCompany,
  Company,
} from "../../redux/auth/companiesSlice";

import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download } from "lucide-react";
import { RegisterCompanyForm } from "@/components/customer/register-company-form";

export default function CompaniesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.companies
  );
  const token = useSelector((state: any) => state.auth.token);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchCompanies({ token }));
    }
  }, [token, dispatch]);

  const handleRegisterCompany = (values: { name: string }) => {
    if (!token) return;

    dispatch(registerCompany({ name: values.name, token }))
      .unwrap()
      .then(() => {
        setIsRegisterOpen(false);
      })
      .catch((err) => {
        console.error("Company registration failed:", err);
      });
  };

  const registered = data.filter((c) => c.status === 1);
  const failed = data.filter((c) => c.status !== 1);

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const columns = [
    {
      accessorKey: "company_name",
      header: "Company Name",
    },
    {
      accessorKey: "waslKey",
      header: "WASL Key",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const { text, status: badgeStatus } = mapStatus(status);
        return <StatusBadge status={badgeStatus} text={text} />;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: any) => {
        const date = new Date(row.original.created_at);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Button onClick={() => setIsRegisterOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Register New Company
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {registered.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {failed.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Companies</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Companies</CardTitle>
              <CardDescription>All company registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data}
                searchKey="company_name"
                searchPlaceholder="Search by company name..."
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}{" "}
                {new Date().toLocaleTimeString()}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="registered">
          <Card>
            <CardHeader>
              <CardTitle>Registered Companies</CardTitle>
              <CardDescription>
                Companies successfully registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
  columns={columns}
  data={registered}
  searchKey="company_name"
  searchPlaceholder="Search by company name..."
 
/>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Failed Companies</CardTitle>
              <CardDescription>
                Companies with registration issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={failed}
                searchKey="company_name"
                searchPlaceholder="Search by company name..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RegisterCompanyForm
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={handleRegisterCompany}
      />
    </div>
  );
}

function mapStatus(status: number) {
  return status === 1
    ? { text: "Registered", status: "success" }
    : { text: "Failed", status: "error" };
}
