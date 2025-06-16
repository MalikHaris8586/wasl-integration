"use client";

import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchAdminDashboard } from "../../redux/auth/dashboardSlice"; // ✅ Corrected import
import { useState, useEffect } from "react";
import { Activity, Building2, Car, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiUsageTabContent from "./ApiUsageTabContent";

export default function CustomerDashboard() {
  const dispatch = useAppDispatch();
  const { api_calls, activities, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [activeTab, setActiveTab] = useState("overview");
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchAdminDashboard({ token }));
    }
  }, [token, dispatch]);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}{" "}
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">API Usage</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Company */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Company Limit
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {api_calls.company.used} / {api_calls.company.allowed}
                </div>
                <Progress
                  value={
                    (api_calls.company.used /
                      (api_calls.company.allowed || 1)) *
                    100
                  }
                  className="mt-2 h-2"
                  indicatorClassName="bg-wialon-blue"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {api_calls.company.remaining} remaining
                </p>
              </CardContent>
            </Card>

            {/* Driver */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Driver Limit
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {api_calls.driver.used} / {api_calls.driver.allowed}
                </div>
                <Progress
                  value={
                    (api_calls.driver.used / (api_calls.driver.allowed || 1)) *
                    100
                  }
                  className="mt-2 h-2"
                  indicatorClassName="bg-wialon-red"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {api_calls.driver.remaining} remaining
                </p>
              </CardContent>
            </Card>

            {/* Vehicle */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vehicle Limit
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {api_calls.vehicle.used} / {api_calls.vehicle.allowed}
                </div>
                <Progress
                  value={
                    (api_calls.vehicle.used /
                      (api_calls.vehicle.allowed || 1)) *
                    100
                  }
                  className="mt-2 h-2"
                  indicatorClassName="bg-wialon-blue"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {api_calls.vehicle.remaining} remaining
                </p>
              </CardContent>
            </Card>
            
          </div>
          <Card >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest WASL integration activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 && (
                  <p>No activities found:</p>
                )}
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div 
                      className={`w-2 h-2 mt-2 rounded-full ${
                        activity?.status === "success"
                          ? "bg-green-500"
                          : activity?.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity?.action}: {activity?.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity?.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab("overview")}
              >
               View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <ApiUsageTabContent />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest WASL integration activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 && (
                  <div className="flex items-start gap-4 border-b pb-4 last:border-0">
                   <Activity className="h-5 w-5 text-gray-500"/>
                    <p className="font-semibold">No activities found</p>
                  </div>
                )}
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        activity?.status === "success"
                          ? "bg-green-500"
                          : activity?.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity?.action}: {activity?.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity?.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab("overview")}
              >
                Back to Overview
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
