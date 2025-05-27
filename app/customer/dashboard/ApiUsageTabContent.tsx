import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchApiUsage } from "../../redux/auth/apiUsageSlice"; // adjust path
import { RootState, useAppDispatch } from "../../redux/store"; // adjust path
import {
  Building2,
  User,
  Car,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // adjust path
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

const ApiUsageTabContent = () => {
  const dispatch = useAppDispatch();
  const { data: apiUsage, loading, error } = useSelector(
    (state: RootState) => state.apiUsage
  );
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchApiUsage({ token }));
    }
  }, [token, dispatch]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (error)
    return (
      <div className="p-4 text-center text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  // Defensive fallback to empty array
  const usageData = Array.isArray(apiUsage) ? apiUsage : [];

  return (
    <TabsContent value="usage" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Your WASL API usage over the last 5 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                Company API Usage
              </h3>
              <div className="bg-muted rounded-md p-4">
                <div className="flex justify-between items-end h-24">
                  {usageData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-blue-500 w-10 rounded-t-sm"
                        style={{ height: `${day.companies * 10}px` }}
                      />
                      <span className="text-xs mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-green-500" />
                Driver API Usage
              </h3>
              <div className="bg-muted rounded-md p-4">
                <div className="flex justify-between items-end h-24">
                  {usageData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-green-500 w-10 rounded-t-sm"
                        style={{ height: `${day.drivers * 3}px` }}
                      />
                      <span className="text-xs mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Car className="h-4 w-4 mr-2 text-orange-500" />
                Vehicle API Usage
              </h3>
              <div className="bg-muted rounded-md p-4">
                <div className="flex justify-between items-end h-24">
                  {usageData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-orange-500 w-10 rounded-t-sm"
                        style={{ height: `${day.vehicles * 5}px` }}
                      />
                      <span className="text-xs mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                Location API Usage
              </h3>
              <div className="bg-muted rounded-md p-4">
                <div className="flex justify-between items-end h-24">
                  {usageData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-red-500 w-10 rounded-t-sm"
                        style={{ height: `${day.locations / 5}px` }}
                      />
                      <span className="text-xs mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Download Usage Report
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default ApiUsageTabContent;
