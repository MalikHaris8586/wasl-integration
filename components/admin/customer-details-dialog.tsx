"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Server, 
  Shield,
  User,
  Key
} from "lucide-react"

interface Role {
  name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface AccessControl {
  id: number;
  name: string;
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
}

interface CustomerDetailsDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{customer.name}</DialogTitle>
          <DialogDescription>
            Customer ID: {customer.id} •{" "}
            {customer.active === 1 ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access">Access & Roles</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{customer.email}</span>
                  {customer.email_verified_at && (
                    <Badge className="ml-2" variant="outline">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{customer.phone_number}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Account Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Created: {formatDate(customer.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Login: {formatDate(customer.last_login_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Active: {formatDate(customer.last_active_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Updated: {formatDate(customer.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>User roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.roles.map((role, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{role.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.access_control.map((access, index) => (
                  <div key={index} className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{access.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Genesis (Wialon) integration configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Genesis URL</p>
                  <div className="flex items-center">
                    <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{customer.setting.url}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                  <div className="flex items-center">
                    <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{customer.setting.ip}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Genesis Session Key</p>
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base break-all">{customer.setting.genesis_session_key}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Integration Created</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{formatDate(customer.setting.created_at)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Integration Updated</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-base">{formatDate(customer.setting.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
